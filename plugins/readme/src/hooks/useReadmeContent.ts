import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  stringifyEntityRef,
  getEntitySourceLocation,
} from '@backstage/catalog-model';
import useAsync from 'react-use/lib/useAsync';
import { readmeApiRef } from '../api/ReadmeApi';

export type UseReadmeContentResult = {
  content: string[] | undefined;
  loading: boolean;
  error: Error | undefined;
  location: string;
};

export const useReadmeContent = (): UseReadmeContentResult => {
  const { entity } = useEntity();
  const readmeApi = useApi(readmeApiRef);

  let location: string;
  try {
    const { target } = getEntitySourceLocation(entity);
    location = target;
  } catch {
    location = ': Unknown';
  }

  const {
    value: content,
    loading,
    error,
  } = useAsync(
    async (): Promise<string[]> =>
      await readmeApi.getReadmeContent(stringifyEntityRef(entity)),
    [entity],
  );

  return { content, loading, error, location };
};
