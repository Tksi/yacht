import { replacer, reviver } from 'lib/jsonMap';
import { WebSocketServer } from 'ws';
import type {
  GameId,
  GameState,
  ReqMessage,
  ResMessage,
  UserId,
} from '../../frontend/src/types';

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

const gameStates = new Map<GameId, GameState>();

wss.on('connection', (ws, req) => {
  ws.on('message', (rawMessage) => {
    console.debug(
      `${color.blue}<-${color.reset} ${color.magenta}${req.socket.remoteAddress}:${req.socket.remotePort}${color.reset}`
    );
    // console.debug(rawMessage.toString());

    try {
      const message = JSON.parse(rawMessage.toString(), reviver) as ReqMessage;
      console.debug(message);
      const userId =
        `USER-${req.socket.remoteAddress}:${req.socket.remotePort}` as UserId;

      switch (message.type) {
        case 'JOIN': {
          // すでにgameStateがあるとき
          if (gameStates.has(message.gameId)) {
            gameStates.get(message.gameId)!.userStates.set(userId, {
              userName: message.userName,
              state: {},
            });
          } else {
            // gameState初期化
            const gameState: GameState = {
              publicState: { turn: null, state: {} },
              userStates: new Map(),
            };
            gameState.userStates.set(userId, {
              userName: message.userName,
              state: {},
            });
            gameStates.set(message.gameId, gameState);
          }

          unicast({ type: 'USERID', body: userId }, userId);
          broadcast(
            { type: 'GAMESTATE', body: gameStates.get(message.gameId)! },
            gameStates.get(message.gameId)!
          );

          break;
        }

        case 'SEND': {
          gameStates.delete(message.gameId);

          broadcast(
            { type: 'GAMESTATE', body: message.gameState },
            message.gameState
          );

          break;
        }

        default: {
          // @ts-ignore
          console.error(`unkown type ${message.type}`);
        }
      }
    } catch (err) {
      console.error(`❌ ${err}`);
    }
  });

  ws.on('close', () => {
    for (const [gameId, gameState] of gameStates) {
      for (const [userId] of gameState.userStates) {
        if (
          userId === `USER-${req.socket.remoteAddress}:${req.socket.remotePort}`
        ) {
          gameState!.userStates.delete(userId);

          // 誰もいなくなったときgameStateを消去
          if (gameState!.userStates.size === 0) {
            gameStates.delete(gameId);
          } else {
            broadcast({ type: 'GAMESTATE', body: gameState }, gameState);
          }
        }
      }
    }

    console.debug(
      `👋 ${color.magenta}${req.socket.remoteAddress}:${req.socket.remotePort}${color.reset} Disconnected`
    );
  });
});

const broadcast = (message: ResMessage, gameState: GameState) => {
  for (const userId of gameState.userStates.keys()) {
    unicast(message, userId);
  }
};

const unicast = (message: ResMessage, userId: UserId) => {
  for (const client of wss.clients) {
    if (
      // @ts-ignore
      `USER-${client._socket.remoteAddress}:${client._socket.remotePort}` ===
      userId
    ) {
      client.send(JSON.stringify(message, replacer));

      console.debug(
        // @ts-ignore
        `${color.green}->${color.reset} ${color.magenta}${client._socket.remoteAddress}:${client._socket.remotePort}${color.reset}`
      );
      // console.debug(`${JSON.stringify(message, replacer, 2)}`);
    }
  }
};
