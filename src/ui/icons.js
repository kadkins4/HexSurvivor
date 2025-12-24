import feather from 'feather-icons';

// Helper to create an SVG element for a feather icon
export function createIcon(name, attrs = {}) {
  const ico = feather.icons[name];
  if (!ico) return null;
  const wrapper = document.createElement('span');
  wrapper.innerHTML = ico.toSvg(attrs);
  return wrapper.firstElementChild;
}

// Convenience factory functions for common icons the project uses
export const icons = {
  next: (attrs) => createIcon('arrow-right', attrs),
  play: (attrs) => createIcon('play', attrs),
  pause: (attrs) => createIcon('pause', attrs),
  refresh: (attrs) =>
    createIcon('rotate-cw', attrs) ||
    createIcon('refresh-cw', attrs) ||
    createIcon('refresh-ccw', attrs),
  clear: (attrs) => createIcon('x', attrs) || createIcon('trash-2', attrs),
  restart: (attrs) =>
    createIcon('rotate-cw', attrs) || createIcon('refresh-cw', attrs),
};
