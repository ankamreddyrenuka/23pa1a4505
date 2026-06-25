const axios = require('axios');
const MinHeap = require('./utils/priorityQueue');
const { getAccessToken } = require('./utils/auth');

const API_URL = process.env.NOTIFICATION_API_URL || 'http://4.224.186.213/evaluation-service/notifications';
const TOP_N = Number(process.env.TOP_N || 10);

const TYPE_WEIGHT = {
  placement: 3,
  result: 2,
  event: 1
};

/**
 * Normalize API response items into a consistent shape.
 * @param {object} item
 * @returns {object}
 */
function normalizeNotification(item) {
  return {
    id: item.ID || item.notificationId || item.id,
    type: String(item.Type || item.type || '').toLowerCase(),
    message: item.Message || item.message || '',
    createdAt: item.Timestamp || item.createdAt || item.created_at || '',
    isRead: item.isRead ?? item.is_read ?? false,
    raw: item
  };
}

/**
 * Fetch notifications from the Notification API.
 * @param {string} url
 * @returns {Promise<Array<object>>}
 */
async function fetchNotifications(url) {
  const token = await getAccessToken();
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    timeout: 10000
  });

  const payload = response.data;
  const items = payload?.notifications
    || payload?.data?.notifications
    || payload?.data?.items
    || payload?.items
    || payload;

  if (Array.isArray(items)) {
    return items.map(normalizeNotification);
  }

  throw new Error('Unexpected notification API response format.');
}

/**
 * Compute a numeric priority score for a notification.
 * Higher score means higher priority.
 * @param {object} notification
 * @returns {number}
 */
function calculatePriority(notification) {
  const createdAt = new Date(notification.createdAt || notification.created_at || 0).getTime();
  const recencyScore = Number.isFinite(createdAt) ? createdAt : 0;
  const typeWeight = TYPE_WEIGHT[notification.type] || 0;
  return typeWeight * 1000000000000 + recencyScore;
}

/**
 * Build a priority queue that keeps only the top N unread notifications.
 * This uses a min-heap so newly arriving notifications can be processed efficiently.
 * @param {Array<object>} notifications
 * @param {number} topN
 * @returns {Array<object>}
 */
function getTopUnreadNotifications(notifications, topN = TOP_N) {
  const heap = new MinHeap((a, b) => {
    if (a.priority === b.priority) {
      return a.createdAtValue - b.createdAtValue;
    }
    return a.priority - b.priority;
  });

  for (const notification of notifications) {
    if (notification.isRead === true || notification.isRead === 'true') {
      continue;
    }

    const createdAtValue = new Date(notification.createdAt || notification.created_at || 0).getTime();
    const priority = calculatePriority(notification);
    const entry = {
      notification,
      priority,
      createdAtValue
    };

    if (heap.size() < topN) {
      heap.push(entry);
    } else if (heap.data[0] && entry.priority > heap.data[0].priority) {
      heap.pop();
      heap.push(entry);
    } else if (heap.data[0] && entry.priority === heap.data[0].priority && entry.createdAtValue > heap.data[0].createdAtValue) {
      heap.pop();
      heap.push(entry);
    }
  }

  const result = [];
  while (heap.size() > 0) {
    result.push(heap.pop().notification);
  }

  return result.sort((a, b) => {
    const scoreA = calculatePriority(a);
    const scoreB = calculatePriority(b);
    return scoreB - scoreA;
  }).slice(0, topN);
}

/**
 * Run the priority inbox workflow.
 * @param {string} [url]
 * @param {number} [topN]
 * @returns {Promise<Array<object>>}
 */
async function buildPriorityInbox(url = API_URL, topN = TOP_N) {
  const notifications = await fetchNotifications(url);
  return getTopUnreadNotifications(notifications, topN);
}

if (require.main === module) {
  buildPriorityInbox()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error('Failed to build priority inbox:', error.message);
      process.exitCode = 1;
    });
}

module.exports = {
  buildPriorityInbox,
  calculatePriority,
  getTopUnreadNotifications
};
