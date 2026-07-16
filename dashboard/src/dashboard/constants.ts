// Single source of truth for the vocabularies that were drifting across the
// JD/parse prompts, the edit dropdowns, and the question editors — mismatches
// here silently corrupted AI output (experience bands reset on edit, question
// difficulty downgraded on save). Every prompt, <select>, and default MUST use
// these so AI-set values always round-trip.

export const EXPERIENCE_BANDS = [
  'Fresher',
  'Upto 2 Years',
  '1-4 Years',
  '3-6 Years',
  '5-10 Years',
  '8-15 Years',
  '10+ Years',
] as const;

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

// Literal union types derived from the vocabularies above — use these to type any
// field that must hold one of the allowed values (keeps AI-set values round-tripping).
export type ExperienceBand = (typeof EXPERIENCE_BANDS)[number];
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

// Pipe-joined form for embedding the allowed values inside an LLM prompt.
export const EXPERIENCE_BANDS_PROMPT = EXPERIENCE_BANDS.join(' | ');
export const DIFFICULTY_LEVELS_PROMPT = DIFFICULTY_LEVELS.join(' | ');
