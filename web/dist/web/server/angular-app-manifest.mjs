
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/telepatia"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 1847, hash: 'cd01f3d06dd3560fc99aa7d442dc17ec3cdde5cc8138e6ca8422e2293791c12e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 966, hash: '52740e741a5a3c197c2669a5909f3caa1b5d670c6d853697244de6434260a016', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 33577, hash: 'f807fcb9e5b4a872344ba7b1bd3e4a9b09f213be1f57dffadd87e4bbc0b97c96', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'telepatia/index.html': {size: 33577, hash: 'f807fcb9e5b4a872344ba7b1bd3e4a9b09f213be1f57dffadd87e4bbc0b97c96', text: () => import('./assets-chunks/telepatia_index_html.mjs').then(m => m.default)},
    'styles-VHGCB5I7.css': {size: 2131, hash: 'Os0qx0Y1IxI', text: () => import('./assets-chunks/styles-VHGCB5I7_css.mjs').then(m => m.default)}
  },
};
