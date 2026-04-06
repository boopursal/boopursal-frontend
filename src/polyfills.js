/* eslint-disable no-undef */
if (!window.process) {
    window.process = { env: { NODE_ENV: 'development' } };
}

if (!window.global) {
    window.global = window;
}

if (typeof globalThis !== 'undefined') {
    globalThis.process = window.process;
    globalThis.global = window;
}
