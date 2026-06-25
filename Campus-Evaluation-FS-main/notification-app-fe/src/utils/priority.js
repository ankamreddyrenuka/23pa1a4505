const TYPE_WEIGHT = {
  placement: 3,
  result: 2,
  event: 1
};

function normalizeType(type) {
  return String(type || '').toLowerCase();
}

export function calculatePriority(notification) {
  const createdAt = new Date(notification.createdAt || notification.created_at || 0).getTime();
  const recencyScore = Number.isFinite(createdAt) ? createdAt : 0;
  const typeWeight = TYPE_WEIGHT[normalizeType(notification.type)] || 0;

  return typeWeight * 1000000000000 + recencyScore;
}

export function getPriorityNotifications(notifications, topN = 10) {
  return [...notifications]
    .filter((notification) => notification.isUnread !== false)
    .sort((left, right) => calculatePriority(right) - calculatePriority(left))
    .slice(0, topN);
}
