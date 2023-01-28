import { mainModule } from 'node:process';
import { WebSocketServer } from 'ws';

const color = {
  green: '\u001B[32m',
  red: '\u001B[31m',
  blue: '\u001B[34m',
  magenta: '\u001B[35m',
  reset: '\u001B[0m',
};

const port = Number(process.env.PORT ?? 4567);
const wss = new WebSocketServer({ port });
console.debug(`WebSocker Server Listen on ${port}`);

type GameId = `GAME-${string}`;

type UserId = 'PUBLIC' | `USER-${string}`;

type UserState =
  | {
      turn: UserId | null;
    }
  | {
      userName: string;
    };

type GameState = Map<UserId, UserState>;

const gameStates = new Map<GameId, GameState>();

type InMessage =
  | {
      type: 'JOIN' | 'LEAVE';
      gameId: GameId;
      userName: string;
    }
  | {
      type: 'NEXT';
    }
  | {
      type: 'START';
    };

type outMessage =
  | {
      type: 'GAMESTATE';
      body: GameState;
    }
  | {
      type: 'USERID';
      body: UserId;
    };

wss.on('connection', (ws, req) => {
  ws.on('message', (rawMessage) => {
    console.debug(
      `${color.blue}<-${color.reset} ${color.magenta}${req.socket.remoteAddress}:${req.socket.remotePort}${color.reset}`
    );
    console.debug(rawMessage.toString());

    try {
      const message = JSON.parse(rawMessage.toString()) as InMessage;
      const userId =
        `USER-${req.socket.remoteAddress}:${req.socket.remotePort}` as UserId;

      switch (message.type) {
        case 'JOIN': {
          if (gameStates.has(message.gameId)) {
            // @ts-ignore
            if (gameStates.get(message.gameId)!.get('PUBLIC')?.turn === null) {
              gameStates
                .get(message.gameId)!
                .set(userId, { userName: message.userName });
            }
          } else {
            const gameState: GameState = new Map();
            gameState.set('PUBLIC', { turn: null });
            gameState.set(userId, { userName: message.userName });
            gameStates.set(message.gameId, gameState);
          }

          unicast({ type: 'USERID', body: userId }, userId);
          broadcast(
            { type: 'GAMESTATE', body: gameStates.get(message.gameId)! },
            message.gameId
          );

          break;
        }

        case 'LEAVE': {
          if (gameStates.has(message.gameId)) {
            gameStates.get(message.gameId)!.delete(userId);

            // PUBLICのみになったとき、gameStatesから消去
            if (gameStates.get(message.gameId)!.size <= 1) {
              gameStates.delete(message.gameId);
            } else {
              broadcast(
                { type: 'GAMESTATE', body: gameStates.get(message.gameId)! },
                message.gameId
              );
            }
          }

          break;
        }

        // [] START
        case 'START': {
          break;
        }

        // [] NEXT
        case 'NEXT': {
          break;
        }

        default: {
          // @ts-ignore
          console.error(`unkown type ${message.type}`);
        }
      }
    } catch (err) {
      console.error(`❌ Error ${err}`);
    }
  });

  ws.on('close', () => {
    console.debug(
      `👋 ${color.magenta}${req.socket.remoteAddress}:${req.socket.remotePort}${color.reset} Disconnected`
    );
  });
});

const broadcast = (message: outMessage, gameId: GameId) => {
  for (const userId of gameStates.get(gameId)!.keys()) {
    if (userId.startsWith('USER-')) {
      unicast(message, userId);
    }
  }
};

const unicast = (message: outMessage, userId: UserId) => {
  for (const client of wss.clients) {
    if (
      // @ts-ignore
      `USER-${client._socket.remoteAddress}:${client._socket.remotePort}` ===
      userId
    ) {
      if (message.type === 'GAMESTATE') {
        client.send(
          JSON.stringify({ type: 'GAMESTATE', body: [...message.body] })
        );
      } else {
        client.send(JSON.stringify(message));
      }

      console.debug(
        // @ts-ignore
        `${color.green}->${color.reset} ${color.magenta}${client._socket.remoteAddress}:${client._socket.remotePort}${color.reset}`
      );
      console.debug(`${JSON.stringify(message, null, 2)}`);
    }
  }
};
