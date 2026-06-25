export async function fetchNotifications() {
  return {
    notifications: [
      {
        id: 1,
        title: 'Placement update',
        message: 'Placement drive scheduled for Friday.',
        type: 'Placement'
      }
    ]
  };
}
