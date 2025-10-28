export interface User {
  id: string;
  login: string;
  name: string;
  $type: string;
}

export interface Project {
  id: string;
  name: string;
  shortName: string;
  description: string;
  createdBy?: User;
  leader?: User;
}