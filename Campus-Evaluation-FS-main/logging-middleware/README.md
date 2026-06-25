# AffordMed Logging Middleware

A reusable Node.js logging package for the AffordMed evaluation service.

## Installation

```bash
cd logging-middleware
npm install
```

## Configuration

Update the authentication placeholders in [config/auth.js](config/auth.js) before using the package.

```js
module.exports = {
  email: 'YOUR_EMAIL',
  name: 'YOUR_NAME',
  rollNo: 'YOUR_ROLL_NO',
  accessCode: 'YOUR_ACCESS_CODE',
  clientID: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET'
};
```

## Folder Structure

```text
logging-middleware/
├── config/
│   └── auth.js
├── middleware/
│   └── logger.js
├── utils/
│   ├── axiosClient.js
│   ├── tokenManager.js
│   └── validators.js
├── test.js
├── index.js
├── package.json
└── README.md
```

## How Authentication Works

The package authenticates with the AffordMed server by sending a POST request to:

```text
http://4.224.186.213/evaluation-service/auth
```

The access token is stored in memory and reused for subsequent logging calls.

## How Token Refresh Works

If no token exists or the token has expired, the package automatically requests a new one. If a log request returns 401 or 403, the token is cleared and a fresh token is requested once before the request is retried.

## How to Use Log()

```js
const { Log } = require('./index');

(async () => {
  const response = await Log('backend', 'info', 'handler', 'Logger initialized');
  console.log(response);
})();
```

## Example Usage

```bash
node test.js
```

## Supported Values

- Stack: backend, frontend
- Level: debug, info, warn, error, fatal
- Backend packages: cache, controller, cron_job, db, domain, handler, repository, route, service
- Frontend packages: api, component, hook, page, state
- Common packages: auth, config, middleware, utils
