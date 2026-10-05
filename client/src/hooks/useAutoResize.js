import { useRef, useLayoutEffect } from 'react';

/**
 * Returns a ref to attach to a textarea.
 * On each render, resets height to 'auto' then grows to scrollHeight,
 * capped at (lineHeight * maxLines) px. Beyond the cap, the textarea
 * scrolls internally.
 *
 * @param {string} value    - Current textarea value (used as the dependency)
 * @param {number} maxLines - Maximum number of visible lines before scrolling
 * @returns {React.RefObject}
 */
export function useAutoResize(value, maxLines = 5) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Read the computed line-height so we can calculate the cap accurately
    const computed = window.getComputedStyle(el);
    const lineHeight = parseFloat(computed.lineHeight) || 20;
    const maxHeight = lineHeight * maxLines;

    // Reset to 'auto' first so scrollHeight shrinks when text is deleted
    el.style.height = 'auto';
    el.style.overflowY = 'hidden';

    if (el.scrollHeight > maxHeight) {
      el.style.height = `${maxHeight}px`;
      el.style.overflowY = 'scroll';
    } else {
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [value, maxLines]);

  return ref;
}
