'use client';

import { useParams } from 'next/navigation';
import DashboardShell from '../../DashboardShell.js';

export default function JobDetailPage() {
  const { jobId } = useParams();

  return (
    <DashboardShell
      navigateTo={() => {
        window.navigateToJobDetail?.(jobId);
      }}
    />
  );
}
