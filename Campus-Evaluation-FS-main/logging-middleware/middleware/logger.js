const axiosClient = require('../utils/axiosClient');
const { getValidToken, clearToken } = require('../utils/tokenManager');
const { validateLogInput } = require('../utils/validators');

const LOG_URL = 'http://4.224.186.213/evaluation-service/logs';

/**
 * Send a log payload to the AffordMed evaluation service.
 * @param {string} token
 * @param {{stack: string, level: string, package: string, message: string}} payload
 * @returns {Promise<any>}
 */
async function sendLogRequest(token, payload) {
  try {
    const response = await axiosClient.post(LOG_URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        const unauthorizedError = new Error('Log request was unauthorized. The token may be expired or invalid.');
        unauthorizedError.status = status;
        throw unauthorizedError;
      }

      if (status >= 500) {
        const serverError = new Error(`Log request failed with server error ${status}.`);
        serverError.status = status;
        throw serverError;
      }

      const validationError = new Error(`Log request failed with status ${status}.`);
      validationError.status = status;
      throw validationError;
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      const timeoutError = new Error('Log request timed out.');
      timeoutError.code = error.code;
      throw timeoutError;
    }

    if (error.message) {
      throw new Error(`Log request failed: ${error.message}`);
    }

    throw new Error('Log request failed: unable to connect to the server.');
  }
}

/**
 * Publish a log entry to the AffordMed evaluation service.
 * This function validates the input, authenticates if needed, and retries once after refreshing the token.
 * @param {string} stack
 * @param {string} level
 * @param {string} packageName
 * @param {string} message
 * @returns {Promise<any>}
 */
async function Log(stack, level, packageName, message) {
  const validated = validateLogInput(stack, level, packageName, message);
  const payload = {
    stack: validated.stack,
    level: validated.level,
    package: validated.packageName,
    message: validated.message
  };

  let token = await getValidToken();

  try {
    return await sendLogRequest(token, payload);
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      clearToken();
      token = await getValidToken();
      return sendLogRequest(token, payload);
    }

    throw error;
  }
}

module.exports = {
  Log
};
