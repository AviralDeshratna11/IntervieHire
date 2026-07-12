import React from 'react';

/**
 * useMediaQuery
 * Reactive hook that returns true when the given CSS media query matches.
 *
 * @param {string} query - e.g. '(max-width: 768px)'
 * @returns {boolean}
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const listener = window.matchMedia(query);
    setMatches(listener.matches);

    const handler = (e) => setMatches(e.matches);
    listener.addEventListener('change', handler);
    return () => listener.removeEventListener('change', handler);
  }, [query]);

  return matches;
};
