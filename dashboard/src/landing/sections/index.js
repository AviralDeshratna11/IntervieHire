// ─── Sections Master Barrel ───────────────────────────────────────────────────
// Single entry point for ALL section imports across the entire site.
// Do NOT import directly from individual section files — always import from here.

// Landing page sections
export * from './landing';

// Dedicated page sections
export * from './features';
export * from './pricing';
export * from './pilot';

// Resource page sections
export * from './resources';

// Shared across multiple pages
export * from './shared';

// Temp (not yet active — move to a page folder to activate)
// export * from './temp';