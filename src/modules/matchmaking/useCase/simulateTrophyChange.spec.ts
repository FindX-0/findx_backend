import { randomInt } from 'crypto';
import { writeFile } from 'fs/promises';

import { MatchResultOutcome } from '../../../shared/type/matchResultOutcome';
import { randomNumber, uuidV4 } from '../../../shared/util/random';

type Strs = {
  winChange: number;
  loseChange: number;
  fromTrophy: number;
};

const strsList: Strs[] = [
  { fromTrophy: 0, loseChange: -1, winChange: 10 },
  { fromTrophy: 50, loseChange: -2, winChange: 10 },
  { fromTrophy: 100, loseChange: -3, winChange: 10 },
  { fromTrophy: 125, loseChange: -4, winChange: 10 },
  { fromTrophy: 150, loseChange: -5, winChange: 10 },
  { fromTrophy: 200, loseChange: -6, winChange: 10 },
  { fromTrophy: 250, loseChange: -7, winChange: 10 },
  { fromTrophy: 300, loseChange: -8, winChange: 10 },
  { fromTrophy: 350, loseChange: -9, winChange: 10 },
  { fromTrophy: 400, loseChange: -10, winChange: 10 },
  { fromTrophy: 2000, loseChange: -10, winChange: 9 },
  { fromTrophy: 2200, loseChange: -10, winChange: 8 },
  { fromTrophy: 2400, loseChange: -10, winChange: 7 },
  { fromTrophy: 2600, loseChange: -10, winChange: 6 },
  { fromTrophy: 2800, loseChange: -10, winChange: 5 },
  { fromTrophy: 3000, loseChange: -10, winChange: 4 },
];

const calculateTrophyChange = ({
  userId,
  userTrophies,
  matchResultOutcome,
}: {
  userId: string;
  userTrophies: { userId: string; trophy: number }[];
  matchResultOutcome: MatchResultOutcome;
}) => {
  const trophyDiff = Math.abs(
    userTrophies[0]!.trophy - userTrophies[1]!.trophy,
  );

  const userMeta = userTrophies.find((e) => e.userId === userId);

  const strs = strsList.find((e) => e.fromTrophy <= userMeta!.trophy);

  if (!strs) {
    console.log('strs not found', userMeta!.trophy);
  }

  switch (matchResultOutcome) {
    case MatchResultOutcome.WIN:
      return Math.max(1, strs!.winChange - Math.floor(trophyDiff / 10));
    case MatchResultOutcome.LOSE:
      return Math.min(-1, strs!.winChange + Math.floor(trophyDiff / 10));
    default:
      return 0;
  }
};

describe('Simulate trophy change', () => {
  it('simulate', () => {
    const users: { userId: string; trophy: number }[] = Array.from(
      { length: 4000 },
      () => ({ userId: uuidV4(), trophy: 0 }),
    );

    const n = 100_000;
    for (let i = 0; i < n; i++) {
      const user1Index = randomInt(0, users.length - 1);
      const user1 = users[user1Index];

      let user2Index = 0;
      let trophyDiffToUser = Number.MAX_VALUE;

      for (let j = 0; j < users.length; j++) {
        const user = users[j]!;

        if (user.userId === user1!.userId) {
          continue;
        }

        const trophyDiff = Math.abs(user1!.trophy - user.trophy);
        if (trophyDiffToUser <= trophyDiff) {
          continue;
        }

        trophyDiffToUser = trophyDiff;
        user2Index = j;
      }
      const user2 = users[user2Index!];

      const matchResultOutcome =
        randomNumber(0, 1) > 0.4
          ? MatchResultOutcome.WIN
          : MatchResultOutcome.LOSE;

      const trophyChangeForUser1 = calculateTrophyChange({
        matchResultOutcome,
        userId: user1!.userId,
        userTrophies: [user1!, user2!],
      });

      const trophyChangeForUser2 = calculateTrophyChange({
        matchResultOutcome:
          matchResultOutcome === MatchResultOutcome.WIN
            ? MatchResultOutcome.LOSE
            : MatchResultOutcome.WIN,
        userId: user2!.userId,
        userTrophies: [user1!, user2!],
      });

      users[user1Index]!.trophy = Math.max(
        0,
        user1!.trophy + trophyChangeForUser1,
      );
      users[user2Index]!.trophy = Math.max(
        0,
        user2!.trophy + trophyChangeForUser2,
      );
    }

    console.log('writing file');
    writeFile(
      'trophy.json',
      JSON.stringify(
        users.map((e) => e.trophy).filter((e) => e > 0),
        null,
        2,
      ),
    );
  });
});
