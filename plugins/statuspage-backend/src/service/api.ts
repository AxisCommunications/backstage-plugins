import fetch from 'cross-fetch';
import { Config } from '@backstage/config';
import type {
  Component,
  ComponentGroup,
} from '@axis-backstage/plugin-statuspage-common';

const BASE_URL = 'https://api.statuspage.io/v1/pages/';

const getInstance = (config: Config, name: string) => {
  const instance = config
    .getConfigArray(`statuspage.instances`)
    .find(i => i.getString('name') === name);

  if (!instance) {
    throw new Error(
      `Config for instance '${name}' not found in statuspage.instances`,
    );
  }

  return instance;
};

const fetchData = async <T>(url: string, token: string): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      Authorization: `OAuth ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch status page data from ${url}`);
  }

  return response.json() as T;
};

export const fetchComponents = async (
  name: string,
  config: Config,
): Promise<Component[]> => {
  const instance = getInstance(config, name);
  const url = `${BASE_URL}${instance.getString('pageid')}/components`;
  return fetchData<Component[]>(url, instance.getString('token'));
};

export const fetchComponentGroups = async (
  name: string,
  config: Config,
): Promise<ComponentGroup[]> => {
  const instance = getInstance(config, name);
  const url = `${BASE_URL}${instance.getString('pageid')}/component-groups`;
  return fetchData(url, instance.getString('token'));
};

export const getLink = (name: string, config: Config): string | undefined => {
  const instance = getInstance(config, name);
  return instance.getOptionalString('link');
};
