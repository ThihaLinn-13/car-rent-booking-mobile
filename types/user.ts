export type User = {
  id: string;
  name: string;
  email: string;
  img_url: string;
  role?: string[];
};

export type AddUser = {
  name: string;
  email: string;
  img_url: string;
};
