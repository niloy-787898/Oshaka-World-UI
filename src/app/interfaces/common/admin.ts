import {AdminRole} from './admin-role';

export interface Admin {
  _id?: string;
  readOnly?: boolean;
  name: string;
  profileImg?: string;
  email?: string;
  username: string;
  phoneNo: string;
  role: string | AdminRole;
  hasAccess: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
