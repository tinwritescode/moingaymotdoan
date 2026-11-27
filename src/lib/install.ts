/** True when the site runs as an installed app (home screen / dock) rather than in a browser tab. */
export function isStandalone(): boolean {
  // iOS Safari reports an installed app only through navigator.standalone.
  return window.matchMedia("(display-mode: standalone)").matches || ("standalone" in navigator && navigator.standalone === true);
}
