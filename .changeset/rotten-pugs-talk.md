---
'@axis-backstage/plugin-readme-backend': minor
---

A configuration has been added to the readme backend that makes it possible to
configure which files to look for and the exact order. Example:

```yaml
readme:
  -fileNames:
    - README.txt
    - README.text
    - README.markdown
```
