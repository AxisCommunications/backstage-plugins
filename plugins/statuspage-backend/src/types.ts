export type StatuspageInstance = {
  name: string;
  pageid: string;
  token: string;
  link?: string;
};

export type StatuspageConfig = {
  instances: StatuspageInstance[];
};
