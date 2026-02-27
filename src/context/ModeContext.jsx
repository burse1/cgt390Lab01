import { createContext, useContext, useMemo } from "react";
import useLocalStorageState from "../hooks/useLocalStorageState";

const ModeContext = createContext(null);

export function ModeProvider({ children }) {
  // mode persists after refresh
  const [mode, setMode] = useLocalStorageState("mode", "light");

  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  const value = useMemo(() => ({ mode, setMode, toggleMode }), [mode, setMode]);

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used inside <ModeProvider>");
  return ctx;
}

export default ModeContext;