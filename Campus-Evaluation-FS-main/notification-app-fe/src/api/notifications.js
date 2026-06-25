const AUTH_URL = '/api/login';
const NOTIFICATIONS_URL = '/api/notifications';
const DEFAULT_LIMIT = 5;

function normalizeNotification(item) {
  return {
    id: item.ID || item.id || item.notificationId,
    title: item.Message || item.message || 'Notification',
    message: item.Message || item.message || 'Notification',
    type: item.Type || item.type || 'General',
    createdAt: item.Timestamp || item.createdAt || item.created_at || 'Recently received',
    isUnread: true
  };
}

async function login() {
  const credentials = {
    email: '23pa1a4505@vishnu.edu.in',
    name: 'Ankamreddy Renuka',
    rollNo: '23pa1a4505',
    accessCode: 'ahXjvp',
    clientID: 'f147683e-e009-4ba0-ac03-8c4e32971c08',
    clientSecret: 'yqUCRhtmsefnTyKH'
  };

  const response = await fetch(AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    throw new Error(`Authentication failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.accessToken || data.token || data.access_token || data.data?.accessToken || data.data?.token;
}

export async function fetchNotifications({ limit = DEFAULT_LIMIT, page = 1, notificationType = 'All' } = {}) {
  const token = await login();
  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page)
  });

  if (notificationType && notificationType !== 'All') {
    params.set('notification_type', notificationType);
  }

  const response = await fetch(`${NOTIFICATIONS_URL}?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Notifications request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const notifications = payload?.notifications
    || payload?.data?.notifications
    || payload?.items
    || [];

  const normalized = Array.isArray(notifications) ? notifications.map(normalizeNotification) : [];
  const total = typeof payload?.total === 'number' ? payload.total : normalized.length;
  const totalPages = typeof payload?.totalPages === 'number'
    ? payload.totalPages
    : Math.max(1, Math.ceil(total / Math.max(limit, 1)));

  return { notifications: normalized, total, totalPages, page };
}
