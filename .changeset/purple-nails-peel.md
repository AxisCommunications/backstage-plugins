---
'@axis-backstage/plugin-readme-backend': patch
---

Headers were being set after the response was sent, causing errors. Replaced break statements with return statements in the loop.
