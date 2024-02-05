import { useApi } from '@backstage/core-plugin-api';
import { statuspageApiRef } from '../api/StatuspageApi';
import useAsync from 'react-use/lib/useAsync';
import {
  Component,
  ComponentGroup,
} from '@axis-backstage/plugin-statuspage-common';

export const useComponents = (name: string) => {
  const statuspageApi = useApi(statuspageApiRef);

  return useAsync(async (): Promise<{
    components: Component[];
    componentGroups: ComponentGroup[];
    url?: string;
  }> => {
    const components = await statuspageApi.getComponents(name);
    const componentGroups = await statuspageApi.getComponentGroups(name);
    const { url } = await statuspageApi.getLink(name);
    return {
      components,
      componentGroups,
      url,
    };
  }, [name]);
};
