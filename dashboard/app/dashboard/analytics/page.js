'use client';

import DashboardShell from '../DashboardShell.js';

export default function AnalyticsPage() {
  return (
    <DashboardShell
      navigateTo={() => {
        window.navigateToTab?.('analytics');
      }}
    />
  );
}
