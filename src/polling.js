/* global process */

import store from "./store/";

let fastInterval = null;

export function startPolling() {
  fastInterval = setInterval(() => {
    // Only track user position / latency in production environments
    if (process.env.NODE_ENV === "production") {
      store.dispatch("latency");
    }
  }, 10000);
}

export function stopPolling() {
  clearInterval(fastInterval);
}
