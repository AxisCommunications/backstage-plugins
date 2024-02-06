import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-proxy-backend/alpha'));
backend.add(import('@backstage/plugin-techdocs-backend/alpha'));
backend.add(import('@backstage/plugin-search-backend/alpha'));
backend.add(import('@backstage/plugin-app-backend/alpha'));
backend.add(import('@axis-backstage/plugin-jira-dashboard-backend'));
backend.add(import('@axis-backstage/plugin-readme-backend'));
backend.add(import('@axis-backstage/plugin-statuspage-backend'));
backend.start();
