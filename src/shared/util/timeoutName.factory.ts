export class TimeoutNameFactory {
  static finishMatchTimeoutName(matchId: string): string {
    return `finish_match_timeout_${matchId}`;
  }
}
