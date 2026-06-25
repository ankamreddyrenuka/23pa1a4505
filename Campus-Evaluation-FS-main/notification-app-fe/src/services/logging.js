import { Log } from '../../../logging-middleware';

export async function logFrontendEvent(level, message, details = {}) {
  try {
    const payload = `${message} ${JSON.stringify(details)}`;
    await Log('frontend', level, 'notification-app-fe', payload);
  } catch (error) {
    console.warn('Frontend logging failed:', error.message);
  }
}
