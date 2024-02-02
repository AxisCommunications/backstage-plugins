import fetch from 'cross-fetch';
import type {
  Component,
  ComponentGroup,
} from '@axis-backstage/plugin-statuspage-common';
import { StatuspageConfig } from '../types';

const BASE_URL = 'https://api.statuspage.io/v1/pages/';

const getInstance = (config: StatuspageConfig, name: string) => {
  const instance = config.instances.find(i => i.name === name);

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
  config: StatuspageConfig,
): Promise<Component[]> => {
  const instance = getInstance(config, name);
  const url = `${BASE_URL}${instance.pageid}/components`;
  return fetchData<Component[]>(url, instance.token);
};

export const fetchComponentGroups = async (
  name: string,
  config: StatuspageConfig,
): Promise<ComponentGroup[]> => {
  const instance = getInstance(config, name);
  const url = `${BASE_URL}${instance.pageid}/component-groups`;
  return fetchData(url, instance.token);
};

export const getLink = (
  name: string,
  config: StatuspageConfig,
): string | undefined => {
  const instance = getInstance(config, name);
  return instance.link;
};
