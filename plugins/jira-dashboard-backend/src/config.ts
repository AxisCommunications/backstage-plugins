import { Config } from '@backstage/config';

const JIRA_BASE_URL_CONFIG_PATH = 'jiraDashboard.baseUrl';
const JIRA_TOKEN_CONFIG_PATH = 'jiraDashboard.token';
const JIRA_USER_CONFIG_EMAIL_SUFFIX = 'jiraDashboard.userEmailSuffix';
const JIRA_ANNOTATION = 'jiraDashboard.annotationPrefix';

export function resolveJiraBaseUrl(config: Config): string {
  try {
    return config.getString(JIRA_BASE_URL_CONFIG_PATH);
  } catch (error) {
    throw new Error(`Invalid Jira baseUrl, ${error}`);
  }
}

export function resolveJiraToken(config: Config): string {
  try {
    return config.getString(JIRA_TOKEN_CONFIG_PATH);
  } catch (error) {
    throw new Error(`Invalid Jira token, ${error}`);
  }
}

export function resolveUserEmailSuffix(config: Config): string {
  try {
    return config.getString(JIRA_USER_CONFIG_EMAIL_SUFFIX);
  } catch (error) {
    throw new Error(`Invalid Jira user path, ${error}`);
  }
}

export function resolveAnnotationPrefix(config: Config): string {
  const annotationPrefix = config.getOptionalString(JIRA_ANNOTATION);
  return annotationPrefix ?? 'axis.com';
}
