'use client';

import DashboardShell from '../DashboardShell.js';

export default function CareerPage() {
  return (
    <DashboardShell
      navigateTo={() => {
        window.navigateToTab?.('career');
      }}
    />
  );
}
