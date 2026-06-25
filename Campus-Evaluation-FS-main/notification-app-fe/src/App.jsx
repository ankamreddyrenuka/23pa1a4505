import { useMemo, useState } from 'react';
import { AppBar, Box, Container, CssBaseline, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

import AllNotificationsPage from './pages/AllNotificationsPage';
import PriorityNotificationsPage from './pages/PriorityNotificationsPage';
import { logFrontendEvent } from './services/logging';

function a11yProps(index) {
  return {
    id: `page-tab-${index}`,
    'aria-controls': `page-tabpanel-${index}`
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [viewedIds, setViewedIds] = useState([]);

  const handleTabChange = async (_, nextTab) => {
    setActiveTab(nextTab);
    setPage(1);
    await logFrontendEvent('info', 'Page navigation', { page: nextTab === 0 ? 'all' : 'priority' });
  };

  const handleFilterChange = async (nextFilter) => {
    setFilter(nextFilter);
    setPage(1);
    await logFrontendEvent('info', 'Filter changed', { filter: nextFilter });
  };

  const handlePageChange = async (_, nextPage) => {
    setPage(nextPage);
    await logFrontendEvent('info', 'Pagination changed', { page: nextPage });
  };

  const handleMarkViewed = async (notificationId) => {
    setViewedIds((currentIds) => {
      if (currentIds.includes(notificationId)) {
        return currentIds;
      }

      return [...currentIds, notificationId];
    });

    await logFrontendEvent('info', 'Notification viewed', { notificationId });
  };

  const currentPage = useMemo(() => {
    if (activeTab === 1) {
      return (
        <PriorityNotificationsPage
          filter={filter}
          onFilterChange={handleFilterChange}
          page={page}
          onPageChange={handlePageChange}
          viewedIds={viewedIds}
          onMarkViewed={handleMarkViewed}
        />
      );
    }

    return (
      <AllNotificationsPage
        filter={filter}
        onFilterChange={handleFilterChange}
        page={page}
        onPageChange={handlePageChange}
        viewedIds={viewedIds}
        onMarkViewed={handleMarkViewed}
      />
    );
  }, [activeTab, filter, page, viewedIds]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <CssBaseline />
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Toolbar>
          <NotificationsIcon color="primary" sx={{ mr: 1.5 }} />
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
            Campus Notifications
          </Typography>
        </Toolbar>
        <Container maxWidth="lg">
          <Tabs value={activeTab} onChange={handleTabChange} textColor="primary" indicatorColor="primary" sx={{ px: 1 }}>
            <Tab label="All Notifications" {...a11yProps(0)} />
            <Tab label="Priority Notifications" {...a11yProps(1)} />
          </Tabs>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {currentPage}
      </Container>
    </Box>
  );
}
