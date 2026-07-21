'use client';
import React from 'react';
import { Navbar } from '../layout';
import { SmoothScrollProvider } from '../providers';
import { FooterCTA } from '../sections';

/**
 * ResourcePageShell
 *
 * Shared wrapper for all resource sub-pages (FAQ, Blogs, About Founder).
 * Provides the smooth-scroll context, top navbar, and footer.
 */
export function ResourcePageShell({ children }) {
  return (
    <SmoothScrollProvider>
      <div className="ih-landing" style={{ background: '#000', minHeight: '100vh' }}>
        <Navbar simple />
        {children}
        <FooterCTA />
      </div>
    </SmoothScrollProvider>
  );
}
