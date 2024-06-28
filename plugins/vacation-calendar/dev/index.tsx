import { createDevApp } from '@backstage/dev-utils';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
} from '@backstage/plugin-catalog-react';
import React from 'react';
import { vacationCalendarPlugin } from '../src/plugin';
import { fetchApiRef, microsoftAuthApiRef } from '@backstage/core-plugin-api';
import { GetEntitiesResponse } from '@backstage/catalog-client';
import { UserEntity } from '@backstage/catalog-model';
import { VacationCalendarPage } from '@axis-backstage/plugin-vacation-calendar';
import mockEntity from './__fixtures__/mockEntity.json';
import mockEntities from './__fixtures__/mockEntities.json';
import { vacationCalendarApiRef } from '../src/api';
import { mockVacationCalendarApi } from './__fixtures__/mockVacationCalendarApi';

const catalogApi: Partial<CatalogApi> = {
  async getEntities(): Promise<GetEntitiesResponse> {
    return { items: mockEntities as UserEntity[] };
  },
};

createDevApp()
  .registerPlugin(vacationCalendarPlugin)
  .registerApi({
    api: vacationCalendarApiRef,
    deps: { fetchApi: fetchApiRef },
    factory: () => mockVacationCalendarApi,
  })
  .registerApi({
    api: microsoftAuthApiRef,
    deps: {},
    factory: () =>
      ({
        async getAccessToken() {
          return Promise.resolve('token');
        },
      } as unknown as typeof microsoftAuthApiRef.T),
  })
  .registerApi({
    api: catalogApiRef,
    deps: {},
    factory: () => catalogApi as CatalogApi,
  })
  .addPage({
    element: (
      <EntityProvider entity={mockEntity}>
        <VacationCalendarPage />
      </EntityProvider>
    ),
    title: 'Root Page',
    path: '/vacation-calender',
  })
  .render();
