import { useCallback, useState } from 'react';
import { microsoftAuthApiRef, useApi } from '@backstage/core-plugin-api';

export const useSignIn = () => {
  const [isSignedIn, setSignedIn] = useState(false);
  const [isInitialized, setInitialized] = useState(false);
  const authApi = useApi(microsoftAuthApiRef);

  const signIn = useCallback(
    async (optional = false) => {
      const token = await authApi.getAccessToken('Calendars.Read', {
        optional,
        instantPopup: !optional,
      });

      setSignedIn(!!token);
      setInitialized(true);
    },
    [authApi, setSignedIn],
  );

  return { isSignedIn, isInitialized, signIn };
};
