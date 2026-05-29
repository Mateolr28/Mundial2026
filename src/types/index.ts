/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Team {
  id: string; // e.g. "ARG"
  name: string; // e.g. "Argentina"
  group: string; // "A" - "L"
  fifaRanking: number; // 1 - 100+
  flag: string; // Emoji representing the flag, e.g. "🇦🇷"
}

export interface GroupMatch {
  id: string; // e.g. "match-A-1"
  group: string; // "A" - "L"
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number | null;
  awayGoals: number | null;
  played: boolean;
}

export interface GroupStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number; // Goles a favor
  gc: number; // Goles en contra
  gd: number; // Diferencia de goles
  points: number;
  fairPlayPoints: number; // Cumulative Fair Play points (lower cards is better, let's represent as points starting at 0 or a score)
  randomId: number; // Assigned once for drawing of lots tiebreaker
}

export interface KnockoutMatch {
  id: string; // e.g. "match-r32-1" to "match-r32-16", then match-r16-1 to r16-8, qf-1 to qf-4, sf-1 to sf-2, t3rd, final
  stage: 'R32' | 'R16' | 'QF' | 'SF' | 'T3RD' | 'FINAL';
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeGoals: number | null;
  awayGoals: number | null;
  homePenalties: number | null;
  awayPenalties: number | null;
  winnerId: string | null;
  played: boolean;
  label: string; // e.g., "Match 73"
}

export interface SimulationStats {
  totalMatches: number;
  playedMatches: number;
  totalGoals: number;
  mostScoringTeam: string | null;
  bestDefenseTeam: string | null;
  mostWinsTeam: string | null;
  mostLossesTeam: string | null;
  mostDrawsTeam: string | null;
}
