const axios = require('axios');

/**
 * Create a shared Axios instance for AffordMed evaluation endpoints.
 * @returns {import('axios').AxiosInstance}
 */
function createAxiosClient() {
  return axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

module.exports = createAxiosClient();
