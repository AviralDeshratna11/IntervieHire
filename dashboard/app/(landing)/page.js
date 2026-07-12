'use client';
import dynamic from 'next/dynamic';

const LandingAppDynamic = dynamic(
  () => import('../../src/landing/pages').then(mod => mod.LandingApp),
  { ssr: false }
);

export default function LandingPage() {
  return <LandingAppDynamic />;
}
