'use client';

import DashboardShell from '../DashboardShell.js';

export default function SettingsPage() {
  return (
    <DashboardShell
      navigateTo={() => {
        window.navigateToSubtab?.('settings-general');
      }}
    />
  );
}
