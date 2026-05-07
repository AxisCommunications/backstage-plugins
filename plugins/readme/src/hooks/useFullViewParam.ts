import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useFullViewParam = (): [boolean, (open: boolean) => void] => {
  const location = useLocation();
  const navigate = useNavigate();

  const isFullView =
    new URLSearchParams(location.search).get('fullView') === 'true';

  const setFullView = useCallback(
    (open: boolean) => {
      const params = new URLSearchParams(location.search);
      if (open) {
        params.set('fullView', 'true');
      } else {
        params.delete('fullView');
      }
      navigate({ search: params.toString() }, { replace: true });
    },
    [location.search, navigate],
  );

  return [isFullView, setFullView];
};
