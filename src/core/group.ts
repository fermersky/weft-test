export type GroupStatus = "NotEmpty" | "Empty";

export interface Group {
  status: GroupStatus;
  name: string;
  groupId: string;
}
