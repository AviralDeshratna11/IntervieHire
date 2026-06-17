'use client';

import DashboardShell from '../DashboardShell.js';

export default function TeamPage() {
  return (
    <DashboardShell
      navigateTo={() => {
        window.navigateToTab?.('team');
      }}
    />
  );
}
