export function plusReady(callback) {
  if (typeof callback !== 'function') {
    return;
  }
  if (window.plus) {
    return callback();
  }
  document.addEventListener('plusready', callback);
}

let webview;
let pullToRefreshStyle;

export function initScrollBounce() {
  plusReady(() => {
    if (!webview) {
      webview = plus.webview.currentWebview();
    }
    if (!pullToRefreshStyle) {
      pullToRefreshStyle = (webview.getStyle() || {}).pullToRefresh || {};
    }
  });
}

export function disableScrollBounce({
  disable,
}) {
  if (pullToRefreshStyle && pullToRefreshStyle.support) {
    webview.setPullToRefresh({ ...pullToRefreshStyle, support: !disable });
  }
}

export let supportsPassive = false;
try {
  const opts = {};
  Object.defineProperty(opts, 'passive', ({
    get() {
      /* istanbul ignore next */
      supportsPassive = true;
    },
  })); // https://github.com/facebook/flow/issues/285
  window.addEventListener('test-passive', null, opts);
} catch (e) {}
