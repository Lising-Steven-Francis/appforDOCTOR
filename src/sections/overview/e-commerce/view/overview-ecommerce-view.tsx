'use client';

import { HealthNewsFeed } from '../health-news-feed';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function OverviewEcommerceView() {
  return (
    <DashboardContent maxWidth="xl">
      <div style={{ width: '100%' }}>
        <HealthNewsFeed
          title="Medical News & Updates"
          subheader="Stay updated with the latest in healthcare"
        />
      </div>
    </DashboardContent>
  );
}
