import type { GameState, UserId } from '@/types';

export const isMyTurn = <T, U>({
  gameState,
  myUserId,
}: {
  gameState: GameState<T, U>;
  myUserId: UserId;
}): boolean => {
  console.log(gameState.publicState?.turnUserId, myUserId);

  if (gameState === undefined || myUserId === undefined) {
    return false;
  }

  return gameState.publicState?.turnUserId === myUserId;
};
