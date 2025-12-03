import { atomWithStorage } from 'jotai/utils';

/**
 * Helper to create persistent atoms using localStorage
 * @param key - Storage key (will be prefixed with app name)
 * @param initial - Initial value
 * @returns Atom with localStorage persistence
 */
export function persistentAtom<T>(key: string, initial: T) {
  return atomWithStorage<T>(`my-money-control:${key}`, initial);
}

