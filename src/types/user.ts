export type Role = 'admin' | 'manager' | 'agent' | 'requester';
export type AccountStatus = 'active' | 'invited' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  teamIds: string[];
  status: AccountStatus;
  title: string;
  organization: string;
  createdAt: string;
  lastActiveAt: string | null;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  leadId: string | null;
  memberIds: string[];
  active: boolean;
  createdAt: string;
}
