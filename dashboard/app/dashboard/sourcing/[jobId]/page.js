'use client';

import { useParams } from 'next/navigation';
import DashboardShell from '../../DashboardShell.js';

export default function SourcingPage() {
  const { jobId } = useParams();

  return (
    <DashboardShell
      navigateTo={() => {
        window.navigateToSourcing?.(jobId);
      }}
    />
  );
}
