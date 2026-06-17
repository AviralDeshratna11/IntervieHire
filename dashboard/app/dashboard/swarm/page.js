'use client';

import DashboardShell from '../DashboardShell.js';

export default function SwarmPage() {
  return (
    <DashboardShell
      navigateTo={() => {
        window.navigateToTab?.('swarm');
      }}
    />
  );
}
