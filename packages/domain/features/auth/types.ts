export type User = { id: string };

export type Session = { id: string };

export type Auth = {
  user: User;
  session: Session;
};
