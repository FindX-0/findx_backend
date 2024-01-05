import { generateNumRange } from './number';

describe('number utils', () => {
  it('should generate num range from 1 to 30 step 4', () => {
    const numRange = generateNumRange(1, 30, 4);

    expect(numRange).toStrictEqual([1, 5, 9, 13, 17, 21, 25, 29]);
  });

  it('should generate float step num range from 5 to 10', () => {
    const numRange = generateNumRange(5, 6.2, 0.2);

    expect(numRange).toStrictEqual([5, 5.2, 5.4, 5.6, 5.8, 6, 6.2]);
  });
});
