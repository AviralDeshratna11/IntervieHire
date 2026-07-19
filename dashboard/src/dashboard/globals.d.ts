// Ambient global augmentations for the dashboard's vanilla-JS surface.
//
// The dashboard deliberately attaches its state store (`AppState`), API client
// (`IHApi`), and navigation/kebab/drawer handler functions onto `window` so that
// inline HTML `on*="..."` attributes (and loosely-coupled cross-module calls) can
// reach them without an import graph. That is an intentional bridge pattern, not
// incidental global leakage — dozens of such names exist across the engine.
//
// Rather than declare each name (a long, ever-growing list), we open Window with a
// string index typed `any`. Real DOM Window members keep their precise lib.dom
// types; only the dashboard's own attached names resolve through the index.
export {};

declare global {
  interface Window {
    [key: string]: any;
  }
}
