import { writeFile } from 'fs/promises';

import { MatchResultOutcome } from '../../../shared/type/matchResultOutcome';
import { randomNumber, uuidV4 } from '../../../shared/util/random';

const writeTrophies = false;
const writeTrophyChanges = false;
const userCount = 10;
const numberOfMatches = 10;

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
  const userMeta = userTrophies.find((e) => e.userId === userId);
  const otherUserMeta = userTrophies.find((e) => e.userId !== userId);

  const trophyDiff = otherUserMeta!.trophy - userMeta!.trophy;

  const strs = [...strsList]
    .reverse()
    .find((e) => e.fromTrophy <= userMeta!.trophy);

  if (!strs) {
    console.log('strs not found', userMeta!.trophy);
  }

  const modifier =
    trophyDiff > 0 ? Math.floor(trophyDiff / 10) : Math.ceil(trophyDiff / 10);

  switch (matchResultOutcome) {
    case MatchResultOutcome.WIN:
      return Math.max(1, strs!.winChange + modifier);
    case MatchResultOutcome.LOSE:
      return Math.min(-1, strs!.loseChange + modifier);
    default:
      return 0;
  }
};

const calculateWinrate = (total: number, index: number): number => {
  const thresholds = [
    total * 0.0168,
    total * 0.0612,
    total * 0.1546,
    total * 0.3046,
    total * 0.4997,
    total * 0.694,
    total * 0.8457,
    total * 0.9385,
    total * 0.9831,
  ];

  const winRates = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95];

  for (let i = 0; i < thresholds.length; i++) {
    if (index < thresholds[i]!) {
      return winRates[i]!;
    }
  }

  return winRates[winRates.length - 1]!;
};

describe('Simulate trophy change', () => {
  it('simulate', async () => {
    const users: { userId: string; trophy: number; winRate: number }[] =
      Array.from({ length: userCount }, (_, i) => ({
        userId: uuidV4(),
        trophy: 0,
        winRate: calculateWinrate(userCount, i),
      }));

    const changes = [];

    for (let i = 0; i < numberOfMatches; i++) {
      for (let userIndex = 0; userIndex < users.length - 1; userIndex += 2) {
        const userAIndex = userIndex;
        const userBIndex = userIndex + 1;
        const userA = users[userAIndex];
        const userB = users[userBIndex];
        if (!userA || !userB) {
          continue;
        }

        const matchResultOutcome =
          randomNumber(0, 1) < userA.winRate / (userA.winRate + userB.winRate)
            ? MatchResultOutcome.WIN
            : MatchResultOutcome.LOSE;

        const trophyChangeForUserB = calculateTrophyChange({
          matchResultOutcome:
            matchResultOutcome === MatchResultOutcome.WIN
              ? MatchResultOutcome.LOSE
              : MatchResultOutcome.WIN,
          userId: userB!.userId,
          userTrophies: [userA!, userB!],
        });
        const trophyChangeForUserA = calculateTrophyChange({
          matchResultOutcome,
          userId: userA!.userId,
          userTrophies: [userA!, userB!],
        });

        if (writeTrophyChanges) {
          changes.push({
            userATrophy: userA.trophy,
            userBTrophy: userB.trophy,
            trophyChangeForUserA,
            trophyChangeForUserB,
          });
        }

        users[userAIndex]!.trophy = Math.max(
          0,
          userA!.trophy + trophyChangeForUserA,
        );
        users[userBIndex]!.trophy = Math.max(
          0,
          userB!.trophy + trophyChangeForUserB,
        );
      }
      users.sort((a, b) => (a.trophy < b.trophy ? -1 : 1));
    }

    if (writeTrophies) {
      writeFile(
        'trophy.json',
        JSON.stringify(
          users.map((e) => `${e.trophy} ${e.winRate}`),
          null,
          2,
        ),
      );
    }

    if (writeTrophyChanges) {
      writeFile('changes.json', JSON.stringify(changes, null, 2));
    }
  });
});
