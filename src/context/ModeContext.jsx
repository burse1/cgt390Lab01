import { createContext, useContext, useMemo, useState } from "react";

const ModeContext = createContext(null);

export function ModeProvider({ children }) {
  const [mode, setMode] = useState("light");
  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  const value = useMemo(() => ({ mode, setMode, toggleMode }), [mode]);

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used inside <ModeProvider>");
  return ctx;
}

export default ModeContext;
