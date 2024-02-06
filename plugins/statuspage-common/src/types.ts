/**
 * Represents the detailed status of a page, including various timestamps,
 * status information, and related metadata.
 *
 * @public
 */
export type Incident = {
  name: string;
  status: IncidentStatus;
  created_at: Date;
  updated_at: Date;
  monitoring_at: Date | null;
  resolved_at: Date;
  impact: string;
  shortlink: string;
  scheduled_for: Date | null;
  scheduled_until: Date | null;
  scheduled_remind_prior: boolean;
  scheduled_reminded_at: Date | null;
  impact_override: null;
  scheduled_auto_in_progress: boolean;
  scheduled_auto_completed: boolean;
  metadata: any;
  started_at: Date;
  reminder_intervals: null;
  id: string;
  page_id: string;
  incident_updates: IncidentUpdate[];
  postmortem_body: null | string;
  postmortem_body_last_updated_at: Date | null;
  postmortem_ignored: boolean;
  postmortem_published_at: Date | null;
  postmortem_notified_subscribers: boolean;
  postmortem_notified_twitter: boolean;
  components: Component[];
};

/**
 * Describes a component within a Statuspage, including its status,
 * descriptive information, and related timestamps.
 *
 * @public
 */
export type Component = {
  id: string;
  page_id: string;
  group_id: null | string;
  created_at: Date;
  updated_at: Date;
  group: boolean;
  name: string;
  description: null | string;
  position: number;
  status: ComponentStatus;
  showcase: boolean;
  only_show_if_degraded: boolean;
  automation_email: string;
  start_date: Date | null;
};

/**
 * Enumerates the possible status values for a component or service,
 * indicating its operational state.
 *
 * @public
 */
export type ComponentStatus =
  | 'under_maintenance'
  | 'operational'
  | 'degraded_performance'
  | 'partial_outage'
  | 'major_outage';

/**
 * Contains information about an update to an incident, including
 * the update's status, content, and relevant timestamps.
 *
 * @public
 */
export type IncidentUpdate = {
  status: string;
  body: string;
  created_at: Date;
  wants_twitter_update: boolean;
  twitter_updated_at: null;
  updated_at: Date;
  display_at: Date | null;
  deliver_notifications: boolean;
  tweet_id: null;
  id: string;
  incident_id: string;
  custom_tweet: null;
  affected_components: AffectedComponent[] | null;
};

/**
 * Details a component affected by an incident, including its status
 * before and after the incident.
 *
 * @public
 */
export type AffectedComponent = {
  code: string;
  name: string;
  old_status: ComponentStatus;
  new_status: ComponentStatus;
};

/**
 * Status of an incident.
 *
 * @public
 */
export type IncidentStatus = 'completed' | 'resolved' | 'postmortem';

/**
 * Type that describes an ComponentGroup.
 *
 * @public
 */
export type ComponentGroup = {
  id: string;
  page_id: string;
  name: string;
  description: null | string;
  components: string[];
  position: number;
  created_at: Date;
  updated_at: Date;
};
