export function suppressFetchWarnings() {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (!args[0]?.includes('using `window.fetch`')) {
      originalWarn.apply(console, args);
    }
  };
}