/**
 * dsh-custom-fonts — host half.
 *
 * Intentionally a no-op: every behavior of this plugin lives in the
 * browser half (./client). The host entry exists so the package carries a
 * `dsh.bundle` manifest — the marketplace listing requirement — and the
 * loader has something to import on the Node side. Nothing is mounted,
 * nothing is configured; the browser half does all the work.
 */
export const name = 'dsh-custom-fonts'

/** No host-side behavior. */
export function apply() {}