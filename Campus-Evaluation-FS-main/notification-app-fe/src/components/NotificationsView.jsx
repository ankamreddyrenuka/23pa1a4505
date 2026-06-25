import { Alert, Box, CircularProgress, Pagination, Stack, Typography } from '@mui/material';

import { NotificationCard } from './NotificationCard';
import { NotificationFilter } from './NotificationFilter';

export function NotificationsView({
  title,
  description,
  filter,
  onFilterChange,
  notifications,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
  viewedIds,
  onMarkViewed,
  emptyMessage,
  showPagination = true
}) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {description}
        </Typography>
      </Box>

      <NotificationFilter value={filter} onChange={onFilterChange} />

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">{emptyMessage}</Alert>
      )}

      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={1.5}>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              isViewed={viewedIds.includes(notification.id)}
              onMarkViewed={onMarkViewed}
            />
          ))}
        </Stack>
      )}

      {showPagination && !loading && !error && totalPages > 1 && (
        <Box display="flex" justifyContent="center">
          <Pagination count={totalPages} page={page - 1} onChange={onPageChange} color="primary" shape="rounded" />
        </Box>
      )}
    </Stack>
  );
}
