import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomGenerator {
  private static readonly ASCII =
    '!"#$%&\'()*+,-./:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz0123456789{|}~';
  private static readonly HEX = 'abcdefghijklmnopqrstuvwxyz0123456789';

  ascii(length: number): string {
    return this.string(
      length,
      RandomGenerator.ASCII,
      RandomGenerator.ASCII.length,
    );
  }

  hex(length: number): string {
    return this.string(length, RandomGenerator.HEX, RandomGenerator.HEX.length);
  }

  /**
   * @returns generated random integer from min to max inclusive
   */
  int(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  intAsString(min: number, max: number): string {
    const number = Math.floor(Math.random() * (max - min + 1)) + min;

    return number.toString();
  }

  number(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private string(
    length: number,
    charset: string,
    charsetLength: number,
  ): string {
    let s = '';
    for (let i = 0; i < length; i++) {
      s += charset.charAt(Math.floor(Math.random() * charsetLength));
    }

    return s;
  }
}
