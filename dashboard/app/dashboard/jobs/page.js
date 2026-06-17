'use client';

import DashboardShell from '../DashboardShell.js';

export default function JobsPage() {
  return (
    <DashboardShell
      navigateTo={() => {
        window.navigateToTab?.('jobs');
      }}
    />
  );
}
