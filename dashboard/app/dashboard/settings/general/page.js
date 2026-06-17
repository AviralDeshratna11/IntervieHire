'use client';

import DashboardShell from '../../DashboardShell.js';

export default function SettingsGeneralPage() {
  return (
    <DashboardShell
      navigateTo={() => {
        window.navigateToSubtab?.('settings-general');
      }}
    />
  );
}
