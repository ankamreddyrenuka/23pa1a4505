import { useEffect, useState } from 'react';

import { fetchNotifications } from '../api/notifications';
import { logFrontendEvent } from '../services/logging';

export function useNotifications({ mode = 'all', page = 1, filter = 'All' } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        await logFrontendEvent('info', 'Loading notifications', { mode, page, filter });
        const data = await fetchNotifications({
          limit: 5,
          page,
          notificationType: filter
        });

        if (!isMounted) {
          return;
        }

        setNotifications(data.notifications ?? []);
        setTotal(data.total ?? 0);
        setError(null);
        await logFrontendEvent('info', 'Notifications loaded', { mode, page, count: data.notifications?.length ?? 0 });
      } catch (err) {
        if (!isMounted) {
          return;
        }

        const message = err.message || 'Unable to load notifications';
        setError(`Failed to load notifications: ${message}`);
        await logFrontendEvent('error', 'Notifications load failed', { mode, page, filter, message });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [mode, page, filter]);

  const totalPages = Math.max(1, Number(total > 0 ? Math.ceil(total / 5) : 1));

  return { notifications, total, totalPages, loading, error };
}
