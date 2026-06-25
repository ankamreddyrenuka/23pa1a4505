const BACKEND_PACKAGES = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
const FRONTEND_PACKAGES = ['api', 'component', 'hook', 'page', 'state'];
const COMMON_PACKAGES = ['auth', 'config', 'middleware', 'utils'];
const STACKS = ['backend', 'frontend'];
const LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];

/**
 * Validate the logging stack.
 * @param {string} stack
 */
function validateStack(stack) {
  if (typeof stack !== 'string' || stack.trim() === '') {
    throw new Error('Invalid stack: stack must be a non-empty string.');
  }

  const normalized = stack.trim();
  if (normalized !== normalized.toLowerCase()) {
    throw new Error('Invalid stack: only lowercase values are allowed.');
  }

  if (!STACKS.includes(normalized)) {
    throw new Error(`Invalid stack: ${stack}. Allowed values are backend or frontend.`);
  }

  return normalized;
}

/**
 * Validate the log level.
 * @param {string} level
 */
function validateLevel(level) {
  if (typeof level !== 'string' || level.trim() === '') {
    throw new Error('Invalid level: level must be a non-empty string.');
  }

  const normalized = level.trim();
  if (normalized !== normalized.toLowerCase()) {
    throw new Error('Invalid level: only lowercase values are allowed.');
  }

  if (!LEVELS.includes(normalized)) {
    throw new Error(`Invalid level: ${level}. Allowed values are debug, info, warn, error, or fatal.`);
  }

  return normalized;
}

/**
 * Validate the package name based on the selected stack.
 * @param {string} stack
 * @param {string} packageName
 */
function validatePackage(stack, packageName) {
  if (typeof packageName !== 'string' || packageName.trim() === '') {
    throw new Error('Invalid package: package name must be a non-empty string.');
  }

  const normalized = packageName.trim();
  if (normalized !== normalized.toLowerCase()) {
    throw new Error('Invalid package: only lowercase values are allowed.');
  }

  const allowedPackages = stack === 'backend'
    ? [...BACKEND_PACKAGES, ...COMMON_PACKAGES]
    : [...FRONTEND_PACKAGES, ...COMMON_PACKAGES];

  if (!allowedPackages.includes(normalized)) {
    const expected = stack === 'backend'
      ? 'backend packages or common packages'
      : 'frontend packages or common packages';
    throw new Error(`Invalid package for ${stack}: ${packageName}. Allowed values are ${expected}.`);
  }

  return normalized;
}

/**
 * Validate the log message.
 * @param {string} message
 */
function validateMessage(message) {
  if (typeof message !== 'string' || message.trim() === '') {
    throw new Error('Invalid message: message must be a non-empty string.');
  }

  return message.trim();
}

/**
 * Validate all inputs required for a log request.
 * @param {string} stack
 * @param {string} level
 * @param {string} packageName
 * @param {string} message
 * @returns {{stack: string, level: string, packageName: string, message: string}}
 */
function validateLogInput(stack, level, packageName, message) {
  return {
    stack: validateStack(stack),
    level: validateLevel(level),
    packageName: validatePackage(stack, packageName),
    message: validateMessage(message)
  };
}

module.exports = {
  validateLogInput
};
