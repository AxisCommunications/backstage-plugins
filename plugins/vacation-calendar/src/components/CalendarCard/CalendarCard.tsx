import React, { useState } from 'react';
import 'react-calendar-timeline/lib/Timeline.css';
import styles from './style.css';
import useAsync from 'react-use/lib/useAsync';
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from 'react-calendar-timeline';
import { DateTime } from 'luxon';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity, catalogApiRef } from '@backstage/plugin-catalog-react';
import {
  Content,
  ContentHeader,
  SupportButton,
  Link,
  ErrorPanel,
  Progress,
  Avatar,
} from '@backstage/core-components';
import { DateSelector } from '../DateSelector';
import { getGroups, getScheduleItems } from './lib';
import { fetchGroupEntities, fetchUserEntities } from './fetch';
import { useAvailability } from '../../hooks/useAvailibility';
import { useSignIn } from '../../hooks';
import { SignInContent } from '../SignInContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@material-ui/core/styles';

const DEFAULT_NUM_DAYS = 60;

const useStyles = makeStyles({
  avatar: {
    width: 30,
    height: 30,
  },
});

export const CalendarCard = () => {
  const { entity } = useEntity();
  const catalogApi = useApi(catalogApiRef);
  const classes = useStyles();

  const [startDate, setStartDate] = useState(DateTime.now());
  const [endDate, setEndDate] = useState(
    DateTime.now().endOf('day').plus({ days: DEFAULT_NUM_DAYS }),
  );

  const { isSignedIn, isInitialized, signIn } = useSignIn();

  useAsync(async () => signIn(true), [signIn]);

  const isUserEntity =
    entity.kind.toLowerCase() === 'user' && entity.metadata.name;

  const { value: users } = useAsync(async () => {
    return isUserEntity
      ? fetchUserEntities(catalogApi, entity)
      : fetchGroupEntities(catalogApi, entity);
  }, [catalogApi, entity]);

  const {
    availablity,
    error,
    isLoading: isAvailabilityLoading,
    isFetching: isAvailabilityFetching,
    hasNextPage,
    fetchNextPage,
  } = useAvailability(users, startDate, endDate, isSignedIn);

  const showLoader =
    isAvailabilityLoading || isAvailabilityFetching || !isInitialized;

  const groups = getGroups(availablity, isUserEntity, users);
  const scheduleItems = getScheduleItems(availablity);

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
        <Stack direction="row" gap={3} alignItems="center">
          <Box>
            <DateSelector
              onDateChange={d => {
                if (d instanceof DateTime) {
                  const { days } = endDate.diff(d, 'days').toObject();
                  if (days && Math.abs(days) > DEFAULT_NUM_DAYS) {
                    setEndDate(d.endOf('day').plus({ days: DEFAULT_NUM_DAYS }));
                  }
                  setStartDate(d);
                }
              }}
              initalDate={startDate}
              label="Start Date"
            />
          </Box>
          <Box>
            <DateSelector
              onDateChange={d => {
                if (d instanceof DateTime) {
                  const { days } = startDate.diff(d, 'days').toObject();
                  if (days && Math.abs(days) > DEFAULT_NUM_DAYS) {
                    setStartDate(
                      d.endOf('day').minus({ days: DEFAULT_NUM_DAYS }),
                    );
                  }
                  setEndDate(d as DateTime);
                }
              }}
              initalDate={endDate}
              label="End Date"
            />
          </Box>
          <Box>
            <Button
              onClick={() => {
                fetchNextPage();
              }}
              disabled={showLoader || !hasNextPage}
              variant="contained"
              color="primary"
            >
              Show more Users
            </Button>
          </Box>
        </Stack>

        {showLoader && (
          <Box py={2}>
            <Progress variant="query" />
          </Box>
        )}
        {!isSignedIn && isInitialized && (
          <Box p={1} pb={0} minHeight={200} maxHeight={602} overflow="auto">
            <SignInContent handleAuthClick={() => signIn(false)} />
          </Box>
        )}
        {!isAvailabilityLoading && isSignedIn && (
          <Box mt={3} pb={0} minHeight={200} overflow="auto">
            <Timeline
              groups={groups}
              sidebarWidth={250}
              groupRenderer={({ group }) => {
                return (
                  <Link
                    to={`/catalog/default/user/${group.entity?.metadata.name}`}
                  >
                    <div
                      className="custom-group"
                      style={{
                        background: group.highlight
                          ? 'linear-gradient(90deg, #FFCC33A0, transparent 100%)'
                          : '',
                        marginLeft: '-4px',
                        paddingLeft: '4px',
                        display: 'flex',
                        whiteSpace: 'nowrap',
                        flexWrap: 'nowrap',
                        flexDirection: 'row',
                        gap: '5px',
                      }}
                    >
                      <div>
                        <Avatar
                          displayName={
                            group.entity?.metadata.displayName as string
                          }
                          picture={group.entity?.spec.profile?.picture}
                          classes={classes}
                        />
                      </div>
                      <div>
                        <span className="title">{group.title}</span>
                      </div>
                    </div>
                  </Link>
                );
              }}
              items={scheduleItems as any}
              itemTouchSendsClick={false}
              defaultTimeStart={startDate.toJSDate()}
              defaultTimeEnd={endDate.toJSDate()}
            >
              <TimelineHeaders style={styles}>
                <SidebarHeader>
                  {({ getRootProps }) => {
                    return <div {...getRootProps()} />;
                  }}
                </SidebarHeader>
                <DateHeader unit="primaryHeader" />
                <DateHeader />
              </TimelineHeaders>
            </Timeline>
          </Box>
        )}
      </Box>
    </Content>
  );
};
