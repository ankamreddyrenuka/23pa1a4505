import { useMemo } from 'react';

import { useNotifications } from '../hooks/useNotifications';
import { NotificationsView } from '../components/NotificationsView';

export default function PriorityNotificationsPage({ filter, onFilterChange, page, onPageChange, viewedIds, onMarkViewed }) {
  const { notifications, totalPages, loading, error } = useNotifications({ mode: 'priority', page, filter });

  const content = useMemo(() => notifications, [notifications]);

  return (
    <NotificationsView
      title="Priority Notifications"
      description="The highest-priority unread notifications are surfaced first using the Stage 6 ranking logic."
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
      emptyMessage="No priority notifications match your current filter."
      showPagination={false}
    />
  );
}
