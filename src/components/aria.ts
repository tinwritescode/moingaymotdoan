/** ARIA states are the strings "true"/"false"; a JSX boolean would render an empty attribute or none. */
export const ariaState = (on: boolean) => (on ? "true" : "false");
