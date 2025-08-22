import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

export const useFullViewParam = (): [boolean, (open: boolean) => void] => {
  const location = useLocation();
  const navigate = useNavigate();

  const isFullView = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('fullView') === 'true';
  }, [location.search]);

  const setFullView = (open: boolean) => {
    const params = new URLSearchParams(location.search);
    if (open) {
      params.set('fullView', 'true');
    } else {
      params.delete('fullView');
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  return [isFullView, setFullView];
};
