import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";
import { Log } from "../../../logging-middleware";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        await Log("frontend", "info", "hook", "Loading notifications");
        const data = await fetchNotifications();
        setNotifications(data.notifications ?? []);
        setTotal(data.notifications?.length ?? 0);
        setError(null);
      } catch (err) {
        setError(err.message || "Unable to load notifications");
        await Log("frontend", "error", "hook", `Failed to load notifications: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / 5));

  return { notifications, total, totalPages, loading, error };
}
