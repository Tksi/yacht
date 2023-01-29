export type UserId = `USER-${string}`;

export type UserState = {
  userName: string;
  score: number[];
};

export type GameState = {
  publicState: {
    turn: UserId | null;
  };
  userStates: Map<UserId, UserState>;
};
