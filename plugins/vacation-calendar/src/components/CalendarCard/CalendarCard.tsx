import './CalendarCard.css';
import { useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from 'react-calendar-timeline';
import dayjs from 'dayjs';
import { UserEntity } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import {
  useEntity,
  catalogApiRef,
  EntityRefLink,
} from '@backstage/plugin-catalog-react';
import {
  Content,
  ContentHeader,
  SupportButton,
  ErrorPanel,
  Progress,
  Avatar,
} from '@backstage/core-components';
import { Box, Button, Flex } from '@backstage/ui';
import { DateSelector } from '../DateSelector';
import { getGroups, getScheduleItems } from './lib';
import { fetchGroupEntities, fetchUserEntities } from './fetch';
import { useAvailability } from '../../hooks/useAvailibility';
import { useSignIn } from '../../hooks';
import { SignInContent } from '../SignInContent';
import Typography from '@mui/material/Typography';

const DEFAULT_NUM_DAYS = 60;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const DAY_HEADER_MAX_ZOOM = DEFAULT_NUM_DAYS * DAY_IN_MILLISECONDS;

export const CalendarCard = () => {
  const { entity } = useEntity();
  const catalogApi = useApi(catalogApiRef);

  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(
    dayjs().endOf('day').add(DEFAULT_NUM_DAYS, 'day'),
  );
  const [headerUnit, setHeaderUnit] = useState<'day' | 'month'>('day');

  const { isSignedIn, isInitialized, signIn } = useSignIn();

  useAsync(async () => signIn(true), [signIn]);

  const isUserEntity =
    entity.kind.toLowerCase() === 'user' && entity.metadata.name;
  const currentUserEmail =
    (isUserEntity && (entity as UserEntity).spec?.profile?.email) || false;

  const { value: users } = useAsync(async () => {
    return isUserEntity
      ? fetchUserEntities(catalogApi, entity)
      : fetchGroupEntities(catalogApi, entity);
  }, [catalogApi, entity]);

  const {
    availability,
    error,
    isLoading: isAvailabilityLoading,
    isFetching: isAvailabilityFetching,
    hasNextPage,
    fetchNextPage,
  } = useAvailability(users, startDate, endDate, isSignedIn);

  const showLoader =
    isAvailabilityLoading || isAvailabilityFetching || !isInitialized;

  const [groups, groupIndexMap] = getGroups(
    availability,
    currentUserEmail,
    users,
  );
  const scheduleItems = getScheduleItems(availability, groupIndexMap);

  if (users?.length === 0) {
    return (
      <ErrorPanel
        title="No users found."
        defaultExpanded
        error={Error('No users found for current entity.')}
      />
    );
  }
  if (error instanceof Error) {
    return (
      <ErrorPanel
        title="Microsoft Graph Error."
        defaultExpanded
        error={error as any}
      />
    );
  }

  return (
    <Content>
      <ContentHeader title="Out of Office Calendar">
        <SupportButton title="Backstage Out Of Office Calendar">
          <Box>
            <Typography variant="h6">How it works</Typography>
            <Typography>
              The "Out of Office"-calendar shows Away events. If you want your
              calendar events to be seen in the "Out of Office"-calendar, be
              sure to mark your presence as "Away" in outlook.
            </Typography>
            <Typography variant="h6">Limitations</Typography>
            <Typography>
              Due to limitations in the Microsoft Graph API the maximum range of
              the dates is {DEFAULT_NUM_DAYS} days.
            </Typography>
          </Box>
        </SupportButton>
      </ContentHeader>

      <Box>
        <Flex direction="row" gap="3" align="end">
          <Box>
            <DateSelector
              onDateChange={d => {
                if (d) {
                  const days = endDate.diff(d, 'day');
                  if (days && Math.abs(days) > DEFAULT_NUM_DAYS) {
                    setEndDate(d.endOf('day').add(DEFAULT_NUM_DAYS, 'day'));
                  }
                  setHeaderUnit('day');
                  setStartDate(d);
                }
              }}
              initialDate={startDate}
              label="Start Date"
            />
          </Box>
          <Box>
            <DateSelector
              onDateChange={d => {
                if (d) {
                  const days = startDate.diff(d, 'day');
                  if (days && Math.abs(days) > DEFAULT_NUM_DAYS) {
                    setStartDate(
                      d.endOf('day').subtract(DEFAULT_NUM_DAYS, 'day'),
                    );
                  }
                  setHeaderUnit('day');
                  setEndDate(d);
                }
              }}
              initialDate={endDate}
              label="End Date"
            />
          </Box>
          <Button
            onClick={() => {
              fetchNextPage();
            }}
            isDisabled={showLoader || !hasNextPage}
            variant="secondary"
          >
            Show more Users
          </Button>
        </Flex>
        {showLoader && (
          <Box py="2">
            <Progress variant="query" />
          </Box>
        )}
        {!isSignedIn && isInitialized && (
          <Box
            p="1"
            pb="0"
            minHeight="200px"
            maxHeight="602px"
            style={{ overflow: 'auto' }}
          >
            <SignInContent handleAuthClick={() => signIn(false)} />
          </Box>
        )}
        {!isAvailabilityLoading && isSignedIn && (
          <div
            style={{
              marginTop: 'var(--bui-space-3)',
              minHeight: '200px',
              overflow: 'auto',
            }}
          >
            <Timeline
              key={`${startDate.valueOf()}-${endDate.valueOf()}`}
              groups={groups}
              sidebarWidth={250}
              groupRenderer={({ group }) => {
                const groupContent = (
                  <div className="custom-group">
                    <Avatar
                      displayName={group.entity?.metadata.displayName as string}
                      picture={group.entity?.spec.profile?.picture}
                      customStyles={{
                        width: 30,
                        height: 30,
                      }}
                    />
                    <span className="title">{group.title}</span>
                  </div>
                );

                return group.entity ? (
                  <EntityRefLink entityRef={group.entity}>
                    {groupContent}
                  </EntityRefLink>
                ) : (
                  groupContent
                );
              }}
              items={scheduleItems as any}
              itemTouchSendsClick={false}
              defaultTimeStart={startDate.valueOf()}
              defaultTimeEnd={endDate.valueOf()}
              onZoom={({ visibleTimeStart, visibleTimeEnd }) => {
                setHeaderUnit(
                  visibleTimeEnd - visibleTimeStart <= DAY_HEADER_MAX_ZOOM
                    ? 'day'
                    : 'month',
                );
              }}
            >
              <TimelineHeaders>
                <SidebarHeader>
                  {({ getRootProps }) => {
                    return (
                      <div
                        {...getRootProps()}
                        className="timeline-sidebar-header"
                      />
                    );
                  }}
                </SidebarHeader>
                <DateHeader unit={headerUnit === 'day' ? 'month' : 'year'} />
                <DateHeader unit={headerUnit} />
              </TimelineHeaders>
            </Timeline>
          </div>
        )}
      </Box>
    </Content>
  );
};
