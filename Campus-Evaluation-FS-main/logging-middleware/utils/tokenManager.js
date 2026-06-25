const authConfig = require('../config/auth');
const axiosClient = require('./axiosClient');

const AUTH_URL = 'http://4.224.186.213/evaluation-service/auth';

let tokenState = {
  accessToken: null,
  expiryTime: 0
};

/**
 * Check whether the authentication credentials are still placeholders.
 * @returns {boolean}
 */
function hasPlaceholderCredentials() {
  return Object.values(authConfig).some((value) => typeof value === 'string' && value.startsWith('YOUR_'));
}

/**
 * Extract an access token from an authentication response.
 * @param {object} responseData
 * @returns {string}
 */
function extractToken(responseData) {
  const candidate = responseData?.accessToken
    || responseData?.token
    || responseData?.access_token
    || responseData?.data?.accessToken
    || responseData?.data?.token
    || responseData?.data?.access_token;

  if (typeof candidate !== 'string' || candidate.trim() === '') {
    throw new Error('Authentication failed: no access token was returned by the server.');
  }

  return candidate;
}

/**
 * Determine the token expiry time from the authentication response.
 * @param {object} responseData
 * @returns {number}
 */
function extractExpiryTime(responseData) {
  const candidate = responseData?.expiryTime
    || responseData?.expiresAt
    || responseData?.expires_at
    || responseData?.expiresIn
    || responseData?.data?.expiryTime
    || responseData?.data?.expiresAt
    || responseData?.data?.expires_at
    || responseData?.data?.expiresIn;

  if (typeof candidate === 'number' && candidate > 0) {
    return Date.now() + candidate * 1000;
  }

  if (typeof candidate === 'string' && candidate.trim() !== '') {
    const parsed = Date.parse(candidate);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return Date.now() + 55 * 60 * 1000;
}

/**
 * Authenticate with the AffordMed test server and store the token in memory.
 * @returns {Promise<string>}
 */
async function authenticate() {
  if (hasPlaceholderCredentials()) {
    throw new Error('Authentication failed: replace the placeholder credentials in config/auth.js before sending requests.');
  }

  const payload = {
    email: authConfig.email,
    name: authConfig.name,
    rollNo: authConfig.rollNo,
    accessCode: authConfig.accessCode,
    clientID: authConfig.clientID,
    clientSecret: authConfig.clientSecret
  };

  try {
    const response = await axiosClient.post(AUTH_URL, payload);
    const accessToken = extractToken(response.data);
    const expiryTime = extractExpiryTime(response.data);

    tokenState = {
      accessToken,
      expiryTime
    };

    return accessToken;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        throw new Error('Authentication failed: invalid credentials or unauthorized access.');
      }
      throw new Error(`Authentication failed with status ${status}.`);
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new Error('Authentication failed: request timed out.');
    }

    if (error.message) {
      throw new Error(`Authentication failed: ${error.message}`);
    }

    throw new Error('Authentication failed: unable to connect to the server.');
  }
}

/**
 * Return a valid access token, refreshing it if it is missing or expired.
 * @returns {Promise<string>}
 */
async function getValidToken() {
  if (tokenState.accessToken && Date.now() < tokenState.expiryTime) {
    return tokenState.accessToken;
  }

  return authenticate();
}

/**
 * Clear the cached token so the next request will authenticate again.
 */
function clearToken() {
  tokenState = {
    accessToken: null,
    expiryTime: 0
  };
}

module.exports = {
  authenticate,
  getValidToken,
  clearToken
};
