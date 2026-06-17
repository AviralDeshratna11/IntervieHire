'use client';

import { useParams } from 'next/navigation';
import DashboardShell from '../../../DashboardShell.js';

export default function JobFlowPage() {
  const { jobId } = useParams();

  return (
    <DashboardShell
      navigateTo={() => {
        window.openJobFlowView?.(jobId);
      }}
    />
  );
}
