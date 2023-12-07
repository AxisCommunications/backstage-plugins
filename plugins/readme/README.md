# Readme plugin

Welcome to the readme plugin!

![home](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/readme/media/readme-card.png)

## Introduction

The `Readme-plugin` enables easy access and viewing of the README file. By having information such as the project's purpose, usage instructions, or installation details as a central part of the EntityPage, we hope to improve the `onboarding and understanding of entities`. 

The plugin **supports all ScmIntegrations**, like Gerrit & GitLab. This makes it possible for organizations with many Source Code Integrations to use the same plugin.

It also supports various file extentions such as README.md, README.MD, README.txt, README, and README.rst.

### Where can the plugin find my README file?

The README.md file is always retrieved from the same directory as the `catalog-info.yaml file`, also known as the `entity source location`. If you wish to view the path where the plugin looks for your README.md file, you can find it in the backstage.io/source-location annotation in the catalog-info.yaml file. This annotation is automatically added to your entity, so there is no need to add it manually.

The displays README files with one of the following file types: **md**, **MD**, **rst**, or **txt**. The plugin can also handle symlinks.

Currently, placing your README.md file elsewhere than in the same directory as the `catalog-info.yaml file` repository is not supported. 

## Note

You will **need** to also perform the installation instructions in [Readme Backend](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/readme-backend) in order for this plugin to work.

## Getting started

1. First, install the plugin into your app:

```bash
# From your Backstage root directory
yarn --cwd packages/app add @axis-backstage/plugin-readme
```

2. Then, modify your entity page in `EntityPage.tsx` to include the `ReadmeCard` component that is exported from the plugin to `overviewContent``.

```tsx
// In packages/app/src/components/catalog/EntityPage.tsx
import { ReadmeCard } from '@axis-backstage/plugin-readme';

const overviewContent = (
...
  <Grid item md={6} sx={12}>
      <ReadmeCard />
  </Grid>
  ...
)
```

## Layout

The readme card is located in the overview page on the entity page. From the card header it is also possible to open a dialog displaying the full README.md.

![home](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/readme/media/readme-card.png)

![home](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/readme/media/readme-dialog.png)

### Troubleshooting

#### "No README.md file found at the source location..."

This message indicates that the backend cannot find your README.md file. Ensure that the README.md file is indeed located in the same directory as the `catalog-info.yaml file`. If you are still unable to locate it, try scheduling an entity refresh by clicking the "Schedule Entity Refresh" button in the AboutCard of the entity.
