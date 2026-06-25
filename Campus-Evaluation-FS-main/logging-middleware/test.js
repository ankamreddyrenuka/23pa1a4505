const { Log } = require('./index');

(async () => {
  try {
    const responses = [
      await Log('backend', 'info', 'handler', 'Logger initialized'),
      await Log('backend', 'debug', 'route', 'GET /notifications'),
      await Log('backend', 'warn', 'service', 'Slow response'),
      await Log('backend', 'error', 'handler', 'Unhandled exception')
    ];

    responses.forEach((response, index) => {
      console.log(`Response ${index + 1}:`, JSON.stringify(response, null, 2));
    });
  } catch (error) {
    console.error('Logging test failed:', error.message);
    process.exitCode = 1;
  }
})();
