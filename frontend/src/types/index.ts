export type UserId = `USER-${string}`;

export type UserState<T> = T & {
  userName: string;
};

export type UserStates<T> = Map<UserId, UserState<T>>;

export type GameState<T, U> =
  | {
      publicState: T & {
        turnUserId: UserId | null;
      };
      userStates: UserStates<U>;
    }
  | { [key: string]: never };

export type GameId = `GAME-${string}`;

export type ReqMessage<T, U> =
  | {
      type: 'JOIN';
      gameId: GameId;
      userName: string;
    }
  | {
      type: 'SEND';
      gameId: GameId;
      gameState: GameState<T, U>;
    };

export type ResMessage<T, U> =
  | {
      type: 'GAMESTATE';
      body: GameState<T, U>;
    }
  | {
      type: 'USERID';
      body: UserId;
    };
