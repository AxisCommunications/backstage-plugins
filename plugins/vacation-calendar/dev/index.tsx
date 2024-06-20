import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { vacationCalendarPlugin, VacationCalendarPage } from '../src/plugin';

createDevApp()
  .registerPlugin(vacationCalendarPlugin)
  .addPage({
    element: <VacationCalendarPage />,
    title: 'Root Page',
    path: '/vacation-calendar',
  })
  .render();
