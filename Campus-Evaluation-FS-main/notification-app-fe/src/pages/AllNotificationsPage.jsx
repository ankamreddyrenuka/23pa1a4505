import { useMemo } from 'react';

import { useNotifications } from '../hooks/useNotifications';
import { NotificationsView } from '../components/NotificationsView';

export default function AllNotificationsPage({ filter, onFilterChange, page, onPageChange, viewedIds, onMarkViewed }) {
  const { notifications, totalPages, loading, error } = useNotifications({ mode: 'all', page, filter });

  const content = useMemo(() => notifications, [notifications]);

  return (
    <NotificationsView
      title="All Notifications"
      description="Review every notification and track which ones you have already consumed."
      filter={filter}
      onFilterChange={onFilterChange}
      notifications={content}
      loading={loading}
      error={error}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      viewedIds={viewedIds}
      onMarkViewed={onMarkViewed}
      emptyMessage="No notifications are available for the current filter."
    />
  );
}
