# Notification App Frontend

This React + Vite application displays campus notifications from the AffordMed evaluation service and supports all/priority views, filtering, pagination, and viewed-state tracking.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev -- --host 0.0.0.0 --port 3000
   ```
3. Open http://localhost:3000

## Project structure

- src/App.jsx - top-level app shell
- src/pages/AllNotificationsPage.jsx - all notifications experience
- src/pages/PriorityNotificationsPage.jsx - priority notifications experience
- src/components/ - reusable UI pieces such as cards and filters
- src/hooks/useNotifications.js - data-loading hook backed by the notification API
- src/api/notifications.js - API client for authentication and fetching notifications
- src/services/logging.js - frontend logging integration

## Notes

- The app uses Material UI for styling.
- The priority page ranks notifications using the same priority idea introduced in Stage 6.
- The app logs important UI events through the shared logging middleware.
