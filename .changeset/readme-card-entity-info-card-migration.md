---
'@axis-backstage/plugin-readme': minor
---

Migrated `ReadmeCard` from the legacy MUI `InfoCard` to `EntityInfoCard` from `@backstage/plugin-catalog-react`.

The `variant` and `maxHeight` props have been removed from `ReadmeCardProps`. Users relying on these props should switch to `ReadmeCardLegacyProps`, which preserves the old behaviour and is accepted by `ReadmeCard` for backward compatibility. Both `variant` and `maxHeight` are deprecated and will be removed in a future release.
