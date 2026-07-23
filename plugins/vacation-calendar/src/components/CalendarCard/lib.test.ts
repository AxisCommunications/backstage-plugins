import { UserEntityV1alpha1 } from '@backstage/catalog-model';
import { InfiniteData } from '@tanstack/react-query';
import { ScheduleInformation } from '@microsoft/microsoft-graph-types';
import { getGroups, getScheduleItems } from './lib';

const makeAvailability = (
  schedules: ScheduleInformation[],
): InfiniteData<ScheduleInformation[], unknown> => ({
  pages: [schedules],
  pageParams: [0],
});

const makeUser = (
  name: string,
  displayName: string,
  email: string = `${name}@example.com`,
): UserEntityV1alpha1 => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: { name },
  spec: { profile: { displayName, email }, memberOf: [] },
});

describe('getGroups', () => {
  describe('when availability is undefined', () => {
    it('returns empty groups and an empty map', () => {
      const [groups, groupIndexMap] = getGroups(undefined, false, []);

      expect(groups).toEqual([]);
      expect(groupIndexMap.size).toBe(0);
    });
  });

  describe('sorting', () => {
    it('sorts groups alphabetically by display name', () => {
      const availability = makeAvailability([
        { scheduleId: 'charlie@example.com' },
        { scheduleId: 'alice@example.com' },
        { scheduleId: 'bob@example.com' },
      ]);
      const users = [
        makeUser('charlie', 'Charlie'),
        makeUser('alice', 'Alice'),
        makeUser('bob', 'Bob'),
      ];

      const [groups] = getGroups(availability, false, users);

      expect(groups.map(g => g.title)).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('assigns sequential ids starting from 0 after sorting', () => {
      const availability = makeAvailability([
        { scheduleId: 'zara@example.com' },
        { scheduleId: 'anna@example.com' },
      ]);
      const users = [makeUser('zara', 'Zara'), makeUser('anna', 'Anna')];

      const [groups] = getGroups(availability, false, users);

      expect(groups[0].id).toBe(0);
      expect(groups[1].id).toBe(1);
      expect(groups[0].title).toBe('Anna');
    });

    it('returns a groupIndexMap that maps original index to sorted index', () => {
      // Original order: Charlie(0), Alice(1), Bob(2)
      // Sorted order:   Alice(0),   Bob(1),   Charlie(2)
      const availability = makeAvailability([
        { scheduleId: 'charlie@example.com' },
        { scheduleId: 'alice@example.com' },
        { scheduleId: 'bob@example.com' },
      ]);
      const users = [
        makeUser('charlie', 'Charlie'),
        makeUser('alice', 'Alice'),
        makeUser('bob', 'Bob'),
      ];

      const [, groupIndexMap] = getGroups(availability, false, users);

      expect(groupIndexMap.get(0)).toBe(2); // Charlie was 0, now 2
      expect(groupIndexMap.get(1)).toBe(0); // Alice was 1, now 0
      expect(groupIndexMap.get(2)).toBe(1); // Bob was 2, now 1
    });

    it('handles users with no matching entity by falling back to scheduleId', () => {
      const availability = makeAvailability([
        { scheduleId: 'unknown@example.com' },
        { scheduleId: 'alice@example.com' },
      ]);
      const users = [makeUser('alice', 'Alice')];

      const [groups] = getGroups(availability, false, users);

      expect(groups[0].title).toBe('Alice');
      expect(groups[1].title).toBe('unknown@example.com');
    });

    it('resolves the entity by email even when metadata.name differs from the email local part', () => {
      const availability = makeAvailability([
        { scheduleId: 'Niklas.Aronsson@axis.com' },
      ]);
      const users = [
        makeUser('niklasar', 'Niklas Aronsson', 'Niklas.Aronsson@axis.com'),
      ];

      const [groups] = getGroups(availability, false, users);

      expect(groups[0].entity?.metadata.name).toBe('niklasar');
    });

    it('is case-insensitive when sorting', () => {
      const availability = makeAvailability([
        { scheduleId: 'bob@example.com' },
        { scheduleId: 'alice@example.com' },
        { scheduleId: 'charlie@example.com' },
      ]);
      const users = [
        makeUser('bob', 'bob'),
        makeUser('alice', 'ALICE'),
        makeUser('charlie', 'Charlie'),
      ];

      const [groups] = getGroups(availability, false, users);

      // localeCompare is locale-aware and case-insensitive by default in most environments
      expect(groups.map(g => g.title)).toEqual(['ALICE', 'bob', 'Charlie']);
    });
  });

  describe('highlight', () => {
    it('highlights the group matching the current user', () => {
      const availability = makeAvailability([
        { scheduleId: 'alice@example.com' },
        { scheduleId: 'bob@example.com' },
      ]);
      const users = [makeUser('alice', 'Alice'), makeUser('bob', 'Bob')];

      const [groups] = getGroups(availability, 'alice@example.com', users);

      const alice = groups.find(g => g.title === 'Alice');
      const bob = groups.find(g => g.title === 'Bob');

      expect(alice?.highlight).toBe(true);
      expect(bob?.highlight).toBe(false);
    });

    it('does not highlight any group when isUserEntity is false', () => {
      const availability = makeAvailability([
        { scheduleId: 'alice@example.com' },
      ]);
      const users = [makeUser('alice', 'Alice')];

      const [groups] = getGroups(availability, false, users);

      expect(groups.every(g => !g.highlight)).toBe(true);
    });
  });
});

describe('getScheduleItems', () => {
  it('returns empty array when availability is undefined', () => {
    expect(getScheduleItems(undefined)).toEqual([]);
  });

  it('returns only out-of-office items', () => {
    const availability = makeAvailability([
      {
        scheduleId: 'alice@example.com',
        scheduleItems: [
          {
            status: 'oof',
            start: { dateTime: '2025-07-01T00:00:00' },
            end: { dateTime: '2025-07-05T00:00:00' },
          },
          {
            status: 'busy',
            start: { dateTime: '2025-07-06T00:00:00' },
            end: { dateTime: '2025-07-07T00:00:00' },
          },
        ],
      },
    ]);

    const items = getScheduleItems(availability);

    expect(items).toHaveLength(1);
    expect(items[0]?.group).toBe(0);
  });

  it('remaps group id using groupIndexMap', () => {
    const availability = makeAvailability([
      {
        scheduleId: 'alice@example.com',
        scheduleItems: [
          {
            status: 'oof',
            start: { dateTime: '2025-07-01T00:00:00' },
            end: { dateTime: '2025-07-05T00:00:00' },
          },
        ],
      },
    ]);
    const groupIndexMap = new Map([[0, 2]]);

    const items = getScheduleItems(availability, groupIndexMap);

    expect(items[0]?.group).toBe(2);
  });
});
