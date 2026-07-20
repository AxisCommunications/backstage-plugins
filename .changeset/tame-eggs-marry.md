---
'@axis-backstage/plugin-vacation-calendar': patch
---

Fix broken timeline layout in consuming apps. The `react-calendar-timeline`
package declares `sideEffects: false` with no exception for CSS, so its base
stylesheet was tree-shaken out of the bundle when this plugin was consumed by
a host app (it only appeared to work in this plugin's own dev server, which
does not tree-shake). The base timeline styles are now inlined into this
plugin's own CSS file, and the `sideEffects` field is updated to also cover
the compiled `*.css.esm.js` output so it survives bundling.
