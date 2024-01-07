export type GroupStatus = "NotEmpty" | "Empty";

export interface Group {
  status: GroupStatus;
  name: string;
  groupId: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  group?: Group;
  groupId?: string;
}
