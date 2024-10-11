---
'@axis-backstage/plugin-readme-backend': minor
'@axis-backstage/plugin-readme': minor
'app': minor
---

Created the isReadmeAvailable function that returns false if no README content is found due to 404-error. If it returns false, no ReadmeCard is rendered in EntityPage. Also updated the error response from backend to be a NotFoundError.
