// Inline this as a classic script at the top of <head>: a module runs after first paint, so the
// page would flash the wrong theme.
try {
  const theme = localStorage.getItem('rk-theme')
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.dataset.theme = theme
  }
} catch {
  // Storage is blocked (some private modes), so follow the OS.
}
