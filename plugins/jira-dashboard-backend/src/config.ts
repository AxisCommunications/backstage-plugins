import { RootConfigService } from '@backstage/backend-plugin-api';

const JIRA_BASE_URL_CONFIG_PATH = 'jiraDashboard.baseUrl';
const JIRA_TOKEN_CONFIG_PATH = 'jiraDashboard.token';
const JIRA_USER_CONFIG_EMAIL_SUFFIX = 'jiraDashboard.userEmailSuffix';
const JIRA_ANNOTATION = 'jiraDashboard.annotationPrefix';

export function resolveJiraBaseUrl(config: RootConfigService): string {
  try {
    return config.getString(JIRA_BASE_URL_CONFIG_PATH);
  } catch (error) {
    throw new Error(`Invalid Jira baseUrl, ${error}`);
  }
}

export function resolveJiraToken(config: RootConfigService): string {
  try {
    return config.getString(JIRA_TOKEN_CONFIG_PATH);
  } catch (error) {
    throw new Error(`Invalid Jira token, ${error}`);
  }
}

export function resolveUserEmailSuffix(
  config: RootConfigService,
): string | undefined {
  return config.getOptionalString(JIRA_USER_CONFIG_EMAIL_SUFFIX);
}

export function resolveAnnotationPrefix(config: RootConfigService): string {
  const annotationPrefix = config.getOptionalString(JIRA_ANNOTATION);
  return annotationPrefix ?? 'jira.com';
}
