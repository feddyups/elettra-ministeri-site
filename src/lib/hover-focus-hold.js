/**
 * Tracks whether the pointer is over an element or focus is inside it.
 * `onChange(held)` runs on every change. Returns `{ isHeld, stop }`.
 *
 * @param {Element} element
 * @param {(held: boolean) => void} [onChange]
 */
export const holdWhileEngaged = (element, onChange = () => {}) => {
  let pointer = false;
  let focus = false;
  const update = (next) => {
    const before = pointer || focus;
    next();
    const after = pointer || focus;
    if (after !== before) onChange(after);
  };
  const handlers = {
    pointerenter: () => update(() => { pointer = true; }),
    pointerleave: () => update(() => { pointer = false; }),
    focusin: () => update(() => { focus = true; }),
    focusout: () => update(() => { focus = false; }),
  };
  Object.entries(handlers).forEach(([type, handler]) => element.addEventListener(type, handler));
  return {
    isHeld: () => pointer || focus,
    stop: () => Object.entries(handlers).forEach(([type, handler]) => element.removeEventListener(type, handler)),
  };
};
