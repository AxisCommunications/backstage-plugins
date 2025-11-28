import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-microsoft-provider'));
backend.add(import('@backstage/plugin-mcp-actions-backend'));
backend.add(import('@backstage/plugin-techdocs-backend'));
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@axis-backstage/plugin-jira-dashboard-backend'));
backend.add(import('@axis-backstage/plugin-readme-backend'));
backend.add(import('@axis-backstage/plugin-statuspage-backend'));
backend.start();
