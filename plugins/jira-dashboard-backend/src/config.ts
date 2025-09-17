import { ConflictError, ServiceUnavailableError } from '@backstage/errors';
import { RootConfigService } from '@backstage/backend-plugin-api';
import { Filter } from '@axis-backstage/plugin-jira-dashboard-common';

type Config = ReturnType<RootConfigService['getConfig']>;

function parseHeaders(config: Config | undefined): Record<string, string> {
  if (!config) {
    return {};
  }
  return Object.fromEntries(
    config.keys().map(key => {
      const value = config.getString(key);
      return [key, value] as const;
    }),
  );
}

/**
 * The configuration of a Jira instance
 *
 * @public
 */
export type ConfigInstance = {
  token: string;
  headers: Record<string, string>;
  baseUrl: string;
  apiUrl?: string;
  userEmailSuffix?: string;
  defaultFilters?: Filter[];
  useApiV3?: boolean;
};

const JIRA_CONFIG_BASE_URL = 'baseUrl';
const JIRA_CONFIG_API_URL = 'apiUrl';
const JIRA_CONFIG_TOKEN = 'token';
const JIRA_CONFIG_HEADERS = 'headers';
const JIRA_CONFIG_USER_EMAIL_SUFFIX = 'userEmailSuffix';
const JIRA_CONFIG_ANNOTATION = 'annotationPrefix';
const JIRA_FILTERS = 'defaultFilters';
const JIRA_CONFIG_USE_API_V3 = 'useApiV3';

/**
 * Class for reading Jira configuration from the root config
 *
 * @public
 */
export class JiraConfig {
  private instances: Record<string, ConfigInstance> = {};
  /**
   * The annotation prefix to use for Jira annotations
   */
  public readonly annotationPrefix: string;

  private constructor(config: RootConfigService) {
    const jira = config.getConfig('jiraDashboard');

    this.annotationPrefix =
      jira.getOptionalString(JIRA_CONFIG_ANNOTATION) ?? 'jira.com';

    const instances = jira.getOptionalConfigArray('instances');
    if (instances) {
      // Multiple instances form
      instances.forEach(inst => {
        const name = inst.getString('name');
        if (Object.getOwnPropertyNames(this.instances).includes(name)) {
          throw new ConflictError(
            `Duplicate jiraDashboard instances: '${name}'`,
          );
        }

        this.instances[name] = {
          token: inst.getString(JIRA_CONFIG_TOKEN),
          headers: parseHeaders(inst.getOptionalConfig(JIRA_CONFIG_HEADERS)),
          baseUrl: inst.getString(JIRA_CONFIG_BASE_URL),
          apiUrl: inst.getOptionalString(JIRA_CONFIG_API_URL),
          userEmailSuffix: inst.getOptionalString(
            JIRA_CONFIG_USER_EMAIL_SUFFIX,
          ),
          defaultFilters: inst
            .getOptionalConfigArray(JIRA_FILTERS)
            ?.map(filterConfig => ({
              name: filterConfig.getString('name'),
              shortName: filterConfig.getString('shortName'),
              query: filterConfig.getString('query'),
            })),
          useApiV3: inst.getOptionalBoolean(JIRA_CONFIG_USE_API_V3) ?? false,
        };
      });
    } else {
      // Default form
      this.instances.default = {
        token: jira.getString(JIRA_CONFIG_TOKEN),
        headers: parseHeaders(jira.getOptionalConfig(JIRA_CONFIG_HEADERS)),
        baseUrl: jira.getString(JIRA_CONFIG_BASE_URL),
        apiUrl: jira.getOptionalString(JIRA_CONFIG_API_URL),
        userEmailSuffix: jira.getOptionalString(JIRA_CONFIG_USER_EMAIL_SUFFIX),
        defaultFilters: jira
          .getOptionalConfigArray(JIRA_FILTERS)
          ?.map(filterConfig => ({
            name: filterConfig.getString('name'),
            shortName: filterConfig.getString('shortName'),
            query: filterConfig.getString('query'),
          })),
        useApiV3: jira.getOptionalBoolean(JIRA_CONFIG_USE_API_V3) ?? false,
      };
    }
  }

  /**
   * Create a JiraConfig from the root config
   */
  public static fromConfig(config: RootConfigService): JiraConfig {
    return new JiraConfig(config);
  }

  private forInstance(instanceName: string) {
    const instance = this.instances[instanceName];
    if (!instance) {
      throw new ServiceUnavailableError(
        `No such jira instance '${instanceName}'`,
      );
    }
    return instance;
  }

  /**
   * Returns the configuration all instances
   */
  getInstances() {
    return Object.getOwnPropertyNames(this.instances);
  }

  /**
   * Get the jira config for a specific instance
   */
  getInstance(instanceName?: string): ConfigInstance {
    return this.forInstance(instanceName ?? 'default');
  }

  /**
   * Get the jira base url for a given instance
   */
  resolveJiraBaseUrl(instanceName: string): string {
    const instance = this.forInstance(instanceName);
    return instance.baseUrl;
  }

  /**
   * Get the auth token for a given instance
   */
  resolveJiraToken(instanceName: string): string {
    const instance = this.forInstance(instanceName);
    return instance.token;
  }

  /**
   * Get the email suffice for a given instance
   */
  resolveUserEmailSuffix(instanceName: string): string | undefined {
    const instance = this.forInstance(instanceName);
    return instance.userEmailSuffix;
  }

  /**
   * Get the defined default filters for a given instance
   */
  resolveDefaultFilters(instanceName: string): Filter[] | undefined {
    const instance = this.forInstance(instanceName);
    return instance.defaultFilters;
  }
}
