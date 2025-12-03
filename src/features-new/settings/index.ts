// Public API - only hooks and components are exposed
export { default } from './Settings';
export { useSettings } from './hooks';
export * from './types';
export * from './components/ThemeToggle';

// Selectors for other features to consume (if needed)
export { themeAtom } from './selectors';

