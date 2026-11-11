/**
 * The choices a visitor has made on the Paintings page (a series, a set, a subject, a medium, a color family, a way of building the colors, a price range, the works on sale), shared by every chart:
 * choosing the same thing again clears it. `subscribe` is called now and after each change.
 */
export const createFilter = () => {
  const state = { series: null, set: null, subject: null, medium: null, family: null, build: null, price: null, sale: null };
  const listeners = new Set();
  const notify = () => listeners.forEach((fn) => fn({ ...state }));
  return {
    get: () => ({ ...state }),
    toggle(key, value) { state[key] = state[key] === value ? null : value; notify(); },
    clear() { Object.keys(state).forEach((key) => { state[key] = null; }); notify(); },
    subscribe(fn) { listeners.add(fn); fn({ ...state }); },
  };
};

/** Whether a work (with its `series`, `set`, `subjects`, `medium`, `family`, `builds`, `priceBand` and `onSale`) passes the current choices. */
export const passes = (state, work) =>
  (!state.series || work.series === state.series) &&
  (!state.set || work.set === state.set) &&
  (!state.subject || work.subjects.includes(state.subject)) &&
  (!state.medium || work.medium === state.medium) &&
  (!state.family || work.family === state.family) &&
  (!state.build || work.builds.includes(state.build)) &&
  (!state.price || work.priceBand === state.price) &&
  (!state.sale || work.onSale);
