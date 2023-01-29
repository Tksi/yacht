export type UserId = `USER-${string}`;

export type UserState = {
  userName: string;
  state: { [key: string]: any };
};

export type UserStates = Map<UserId, UserState>;

export type GameState =
  | {
      publicState: {
        turn: UserId | null;
        state: { [key: string]: any };
      };
      userStates: UserStates;
    }
  | { [key: string]: never };

export type GameId = `GAME-${string}`;

export type ReqMessage =
  | {
      type: 'JOIN';
      gameId: GameId;
      userName: string;
    }
  | {
      type: 'SEND';
      gameId: GameId;
      gameState: GameState;
    };

export type ResMessage =
  | {
      type: 'GAMESTATE';
      body: GameState;
    }
  | {
      type: 'USERID';
      body: UserId;
    };
