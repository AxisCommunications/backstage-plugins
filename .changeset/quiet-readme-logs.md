---
'@axis-backstage/plugin-readme-backend': patch
---

Reduced the log level of the per-request cache, lookup, and not-found log messages from `info` to `debug`, since the search collator module requests every entity on each run.
