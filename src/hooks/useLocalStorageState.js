import { useEffect, useState } from "react";

/**
 * Persist a piece of state to localStorage.
 * Example: const [mode, setMode] = useLocalStorageState("mode", "light");
 */
export default function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return initialValue;
      return JSON.parse(raw);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
  }, [key, value]);

  return [value, setValue];
}