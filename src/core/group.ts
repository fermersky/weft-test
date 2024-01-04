export type GroupStatus = "NotEmpty" | "Empty";

export interface Group {
  status: string;
  name: string;
  groupId: string;
}
