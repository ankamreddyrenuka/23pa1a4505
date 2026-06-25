const axios = require('axios');
const authConfig = require('../../Campus-Evaluation-FS-main/logging-middleware/config/auth');

const AUTH_URL = 'http://4.224.186.213/evaluation-service/auth';

async function getAccessToken() {
  const payload = {
    email: authConfig.email,
    name: authConfig.name,
    rollNo: authConfig.rollNo,
    accessCode: authConfig.accessCode,
    clientID: authConfig.clientID,
    clientSecret: authConfig.clientSecret
  };

  const response = await axios.post(AUTH_URL, payload, {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 10000
  });

  const candidate = response.data?.accessToken
    || response.data?.token
    || response.data?.access_token
    || response.data?.data?.accessToken
    || response.data?.data?.token
    || response.data?.data?.access_token;

  if (typeof candidate !== 'string' || candidate.trim() === '') {
    throw new Error('Authentication failed: no access token was returned by the server.');
  }

  return candidate;
}

module.exports = {
  getAccessToken
};
