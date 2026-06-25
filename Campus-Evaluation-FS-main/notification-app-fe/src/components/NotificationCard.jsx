import { Button, Chip, Stack, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

export function NotificationCard({ notification, isViewed, onMarkViewed }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      spacing={1.5}
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: isViewed ? 'grey.300' : 'primary.main',
        borderRadius: 2,
        bgcolor: isViewed ? 'grey.50' : 'background.paper'
      }}
    >
      <Stack spacing={1} sx={{ flex: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <CircleIcon color={isViewed ? 'disabled' : 'primary'} sx={{ fontSize: 12 }} />
          <Typography variant="subtitle1" fontWeight={600}>
            {notification.title || notification.message}
          </Typography>
          <Chip label={notification.type || 'General'} size="small" color="primary" variant="outlined" />
          <Chip label={isViewed ? 'Viewed' : 'Unread'} size="small" color={isViewed ? 'default' : 'warning'} />
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {notification.message}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {notification.createdAt || notification.timestamp || 'Recently received'}
        </Typography>
      </Stack>

      <Button variant="outlined" size="small" onClick={() => onMarkViewed(notification.id)}>
        {isViewed ? 'Viewed' : 'Mark viewed'}
      </Button>
    </Stack>
  );
}
