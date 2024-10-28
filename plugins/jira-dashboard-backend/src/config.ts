import { ConflictError, ServiceUnavailableError } from '@backstage/errors';
import { RootConfigService } from '@backstage/backend-plugin-api';

export interface ConfigInstance {
  token: string;
  baseUrl: string;
  userEmailSuffix?: string;
}

const JIRA_CONFIG_BASE_URL = 'baseUrl';
const JIRA_CONFIG_TOKEN = 'token';
const JIRA_CONFIG_USER_EMAIL_SUFFIX = 'userEmailSuffix';
const JIRA_CONFIG_ANNOTATION = 'annotationPrefix';

export class JiraConfig {
  private instances: Record<string, ConfigInstance> = {};
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
          baseUrl: inst.getString(JIRA_CONFIG_BASE_URL),
          userEmailSuffix: inst.getOptionalString(
            JIRA_CONFIG_USER_EMAIL_SUFFIX,
          ),
        };
      });
    } else {
      // Default form
      this.instances.default = {
        token: jira.getString(JIRA_CONFIG_TOKEN),
        baseUrl: jira.getString(JIRA_CONFIG_BASE_URL),
        userEmailSuffix: jira.getOptionalString(JIRA_CONFIG_USER_EMAIL_SUFFIX),
      };
    }
  }

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

  getInstances() {
    return Object.getOwnPropertyNames(this.instances);
  }

  getInstance(instanceName?: string): ConfigInstance {
    return this.forInstance(instanceName ?? 'default');
  }

  resolveJiraBaseUrl(instanceName: string): string {
    const instance = this.forInstance(instanceName);
    return instance.baseUrl;
  }

  resolveJiraToken(instanceName: string): string {
    const instance = this.forInstance(instanceName);
    return instance.token;
  }

  resolveUserEmailSuffix(instanceName: string): string | undefined {
    const instance = this.forInstance(instanceName);
    return instance.userEmailSuffix;
  }
}
