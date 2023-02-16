export interface AdminRole {
  _id?: string;
  readOnly?: boolean;
  name: string;
  slug: string;
  priority: number;
  pageId: string;
  access: PageAccess[];
  createdAt?: Date;
}

export interface PageAccess {
  page: string;
  modify: number[];
}
