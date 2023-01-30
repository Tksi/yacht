const checkStraight = (arr: readonly number[]): boolean => {
  const sortedArr = [...arr].sort();

  return sortedArr.every((v, i) =>
    i === 0 ? true : v === sortedArr[i - 1] + 1
  );
};

const checkSmallStraight = (diceArr: readonly number[]): boolean => {
  const diceSet = new Set(diceArr);
  const sortedDiceArr = [...diceArr].sort();

  if (diceSet.size === 4 && checkStraight([...diceSet])) {
    return true;
  }

  if (
    diceSet.size === 5 &&
    (checkStraight(sortedDiceArr.slice(0, 4)) ||
      checkStraight(sortedDiceArr.slice(1, 5)))
  ) {
    return true;
  }

  return false;
};

console.log(checkSmallStraight([1, 3, 4, 5, 6]));
console.log(checkSmallStraight([3, 4, 5, 5, 6]));
console.log(checkSmallStraight([2, 3, 4, 5, 6]));
console.log(checkSmallStraight([1, 2, 4, 5, 6]));
