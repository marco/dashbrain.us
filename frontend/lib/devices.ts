export function isMobileSafari(): boolean {
  // See https://stackoverflow.com/a/29696509.
  return !!(
    (window.navigator.userAgent.match(/iPhone/i) ||
      window.navigator.userAgent.match(/iPad/i)) &&
    window.navigator.userAgent.match(/WebKit/i) &&
    !window.navigator.userAgent.match(/CriOS/i)
  );
}
