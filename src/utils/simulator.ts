/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Team, GroupMatch, GroupStanding, KnockoutMatch } from '../types';
import { TEAMS } from '../data/teams';

// Generates the initial list of group matches (72 matches)
export function generateInitialGroupMatches(): GroupMatch[] {
  const matches: GroupMatch[] = [];
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  const groupPairings: { [group: string]: [string, string][] } = {
    A: [
      ['MEX', 'RSA'],
      ['KOR', 'CZE'],
      ['CZE', 'RSA'],
      ['MEX', 'KOR'],
      ['CZE', 'MEX'],
      ['RSA', 'KOR']
    ],
    B: [
      ['CAN', 'BIH'],
      ['QAT', 'SUI'],
      ['SUI', 'BIH'],
      ['CAN', 'QAT'],
      ['SUI', 'CAN'],
      ['BIH', 'QAT']
    ],
    C: [
      ['BRA', 'MAR'],
      ['HAI', 'SCO'],
      ['SCO', 'MAR'],
      ['BRA', 'HAI'],
      ['SCO', 'BRA'],
      ['MAR', 'HAI']
    ],
    D: [
      ['USA', 'PAR'],
      ['AUS', 'TUR'],
      ['USA', 'AUS'],
      ['TUR', 'PAR'],
      ['TUR', 'USA'],
      ['PAR', 'AUS']
    ],
    E: [
      ['GER', 'CUW'],
      ['CIV', 'ECU'],
      ['GER', 'CIV'],
      ['ECU', 'CUW'],
      ['CUW', 'CIV'],
      ['ECU', 'GER']
    ],
    F: [
      ['NED', 'JPN'],
      ['SUE', 'TUN'],
      ['NED', 'SUE'],
      ['TUN', 'JPN'],
      ['JPN', 'SUE'],
      ['TUN', 'NED']
    ],
    G: [
      ['BEL', 'EGY'],
      ['IRN', 'NZL'],
      ['BEL', 'IRN'],
      ['NZL', 'EGY'],
      ['EGY', 'IRN'],
      ['NZL', 'BEL']
    ],
    H: [
      ['ESP', 'CPV'],
      ['KSA', 'URU'],
      ['ESP', 'KSA'],
      ['URU', 'CPV'],
      ['CPV', 'KSA'],
      ['URU', 'ESP']
    ],
    I: [
      ['FRA', 'SEN'],
      ['IRQ', 'NOR'],
      ['FRA', 'IRQ'],
      ['NOR', 'SEN'],
      ['NOR', 'FRA'],
      ['SEN', 'IRQ']
    ],
    J: [
      ['ARG', 'ALG'],
      ['AUT', 'JOR'],
      ['ARG', 'AUT'],
      ['JOR', 'ALG'],
      ['ALG', 'AUT'],
      ['JOR', 'ARG']
    ],
    K: [
      ['POR', 'COD'],
      ['UZB', 'COL'],
      ['POR', 'UZB'],
      ['COL', 'COD'],
      ['COL', 'POR'],
      ['COD', 'UZB']
    ],
    L: [
      ['ENG', 'CRO'],
      ['GHA', 'PAN'],
      ['ENG', 'GHA'],
      ['PAN', 'CRO'],
      ['PAN', 'ENG'],
      ['CRO', 'GHA']
    ]
  };

  for (const group of groups) {
    const pairings = groupPairings[group];
    if (!pairings) continue;

    pairings.forEach((pairing, idx) => {
      matches.push({
        id: `match-${group}-${idx + 1}`,
        group,
        homeTeamId: pairing[0],
        awayTeamId: pairing[1],
        homeGoals: null,
        awayGoals: null,
        played: false,
      });
    });
  }

  return matches;
}

// Generate the initial list of knockout matches (32 total)
export function generateInitialKnockoutMatches(): KnockoutMatch[] {
  const matches: KnockoutMatch[] = [];

  // Round of 32 (16 matches: match-r32-1 to match-r32-16)
  for (let i = 1; i <= 16; i++) {
    matches.push({
      id: `match-r32-${i}`,
      stage: 'R32',
      homeTeamId: null,
      awayTeamId: null,
      homeGoals: null,
      awayGoals: null,
      homePenalties: null,
      awayPenalties: null,
      winnerId: null,
      played: false,
      label: `Dieciseisavo ${i}`,
    });
  }

  // Round of 16 (8 matches: match-r16-1 to match-r16-8)
  for (let i = 1; i <= 8; i++) {
    matches.push({
      id: `match-r16-${i}`,
      stage: 'R16',
      homeTeamId: null,
      awayTeamId: null,
      homeGoals: null,
      awayGoals: null,
      homePenalties: null,
      awayPenalties: null,
      winnerId: null,
      played: false,
      label: `Octavo ${i}`,
    });
  }

  // Quarter-Finals (4 matches: match-qf-1 to match-qf-4)
  for (let i = 1; i <= 4; i++) {
    matches.push({
      id: `match-qf-${i}`,
      stage: 'QF',
      homeTeamId: null,
      awayTeamId: null,
      homeGoals: null,
      awayGoals: null,
      homePenalties: null,
      awayPenalties: null,
      winnerId: null,
      played: false,
      label: `Cuarto ${i}`,
    });
  }

  // Semi-Finals (2 matches: match-sf-1 to match-sf-2)
  for (let i = 1; i <= 2; i++) {
    matches.push({
      id: `match-sf-${i}`,
      stage: 'SF',
      homeTeamId: null,
      awayTeamId: null,
      homeGoals: null,
      awayGoals: null,
      homePenalties: null,
      awayPenalties: null,
      winnerId: null,
      played: false,
      label: `Semifinal ${i}`,
    });
  }

  // 3rd Place Match
  matches.push({
    id: 'match-t3rd',
    stage: 'T3RD',
    homeTeamId: null,
    awayTeamId: null,
    homeGoals: null,
    awayGoals: null,
    homePenalties: null,
    awayPenalties: null,
    winnerId: null,
    played: false,
    label: 'Tercer Puesto',
  });

  // Final Match
  matches.push({
    id: 'match-final',
    stage: 'FINAL',
    homeTeamId: null,
    awayTeamId: null,
    homeGoals: null,
    awayGoals: null,
    homePenalties: null,
    awayPenalties: null,
    winnerId: null,
    played: false,
    label: 'Gran Final',
  });

  return matches;
}

// Calculate standings for a specific group A-L
export function calculateGroupStandings(
  group: string,
  matches: GroupMatch[],
  teams: Team[],
  randomSeeds: { [teamId: string]: number },
  fairPlayScores: { [teamId: string]: number }
): GroupStanding[] {
  const groupTeams = teams.filter((t) => t.group === group);
  const groupMatches = matches.filter((m) => m.group === group);

  // Initialize standings map
  const standingsMap: { [teamId: string]: GroupStanding } = {};
  for (const team of groupTeams) {
    standingsMap[team.id] = {
      teamId: team.id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      gc: 0,
      gd: 0,
      points: 0,
      fairPlayPoints: fairPlayScores[team.id] ?? 0,
      randomId: randomSeeds[team.id] ?? Math.random(),
    };
  }

  // Aggregate matches
  for (const match of groupMatches) {
    if (!match.played || match.homeGoals === null || match.awayGoals === null) {
      continue;
    }

    const home = standingsMap[match.homeTeamId];
    const away = standingsMap[match.awayTeamId];

    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;

    home.gf += match.homeGoals;
    home.gc += match.awayGoals;
    away.gf += match.awayGoals;
    away.gc += match.homeGoals;

    if (match.homeGoals > match.awayGoals) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (match.homeGoals < match.awayGoals) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      home.points += 1;
      away.drawn += 1;
      away.points += 1;
    }
  }

  // Set goal differences
  const standings = Object.values(standingsMap);
  for (const s of standings) {
    s.gd = s.gf - s.gc;
  }

  // Sort standings based on official tiebreakers:
  // 1. Points
  // 2. Goal Difference
  // 3. Goals Scored
  // 4. Head-to-head match (direct duel results among tied teams)
  // 5. Fair Play score (fewer penalty cards / higher rating is better)
  // 6. Sorteo (Drawing of lots - simulated via unique stable randomId seed)
  standings.sort((a, b) => {
    // 1. Points
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // 2. Goal Difference
    if (b.gd !== a.gd) {
      return b.gd - a.gd;
    }
    // 3. Goals for
    if (b.gf !== a.gf) {
      return b.gf - a.gf;
    }

    // 4. Head-to-Head
    const directMatch = groupMatches.find(
      (m) =>
        m.played &&
        m.homeGoals !== null &&
        m.awayGoals !== null &&
        ((m.homeTeamId === a.teamId && m.awayTeamId === b.teamId) ||
          (m.homeTeamId === b.teamId && m.awayTeamId === a.teamId))
    );

    if (directMatch) {
      const isAHome = directMatch.homeTeamId === a.teamId;
      const goalsA = isAHome ? (directMatch.homeGoals ?? 0) : (directMatch.awayGoals ?? 0);
      const goalsB = isAHome ? (directMatch.awayGoals ?? 0) : (directMatch.homeGoals ?? 0);
      if (goalsA !== goalsB) {
        return goalsB - goalsA; // whoever scored more in the direct match wins
      }
    }

    // 5. Fair Play rating (higher rating / fewer cards is better)
    if (b.fairPlayPoints !== a.fairPlayPoints) {
      return b.fairPlayPoints - a.fairPlayPoints;
    }

    // 6. stable random seeds
    return a.randomId - b.randomId;
  });

  return standings;
}

// Calculate table rankings for all 12 groups
export function calculateAllGroupStandings(
  matches: GroupMatch[],
  teams: Team[],
  randomSeeds: { [teamId: string]: number },
  fairPlayScores: { [teamId: string]: number }
): { [group: string]: GroupStanding[] } {
  const standings: { [group: string]: GroupStanding[] } = {};
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  for (const group of groups) {
    standings[group] = calculateGroupStandings(group, matches, teams, randomSeeds, fairPlayScores);
  }
  return standings;
}

// Extract and rank the 12 third-place teams
export function calculateThirdPlaceStandings(
  allGroupStandings: { [group: string]: GroupStanding[] },
  teams: Team[]
): GroupStanding[] {
  const thirds: GroupStanding[] = [];
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  for (const group of groups) {
    const list = allGroupStandings[group];
    if (list && list.length >= 3) {
      thirds.push(list[2]); // The 3rd placed team is at index 2
    }
  }

  // Sort them to find the 8 best
  // 1. Points
  // 2. Goal Difference
  // 3. Goals For
  // 4. Fair Play
  // 5. Drawing of lots (stable randomId values)
  thirds.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    if (b.gd !== a.gd) {
      return b.gd - a.gd;
    }
    if (b.gf !== a.gf) {
      return b.gf - a.gf;
    }
    if (b.fairPlayPoints !== a.fairPlayPoints) {
      return b.fairPlayPoints - a.fairPlayPoints;
    }
    return a.randomId - b.randomId;
  });

  return thirds;
}

// Simulate goals between two teams based on FIFA Ranking
export function simulateGoals(teamA: Team, teamB: Team): { homeG: number; awayG: number } {
  // Let's create a realistic strength rating: lower rank (e.g., 1) is better.
  const rA = teamA.fifaRanking;
  const rB = teamB.fifaRanking;

  // Let's base expected goals on hierarchy:
  // Best teams score slightly more and concede less.
  let lambdaA = 1.35; // base expected goals
  let lambdaB = 1.35;

  const rankDiff = rB - rA; // Positive if A is better ranked than B

  if (rankDiff > 0) {
    // Team A is better ranked
    const strengthBonus = Math.min(2.5, rankDiff / 18);
    lambdaA += strengthBonus * 0.70;
    lambdaB -= strengthBonus * 0.15;
  } else {
    // Team B is better ranked
    const strengthBonus = Math.min(2.5, -rankDiff / 18);
    lambdaB += strengthBonus * 0.70;
    lambdaA -= strengthBonus * 0.15;
  }

  lambdaA = Math.max(0.4, lambdaA);
  lambdaB = Math.max(0.4, lambdaB);

  // Generate scores using Poisson-like simple approximation with random spreads
  const randomPoisson = (lambda: number): number => {
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= Math.random();
    } while (p > L && k < 10);
    return k - 1;
  };

  let homeG = randomPoisson(lambdaA);
  let awayG = randomPoisson(lambdaB);

  // Check for crazy outliers to keep scores realistic (max 7-8 goals per team)
  homeG = Math.min(7, homeG);
  awayG = Math.min(7, awayG);

  return { homeG, awayG };
}

// Populates and updates the Knockout Matches based on qualifiers and preceding stage results.
export function updateKnockoutStage(
  groupStandings: { [group: string]: GroupStanding[] },
  bestThirds: GroupStanding[],
  knockouts: KnockoutMatch[]
): KnockoutMatch[] {
  // Deep-copy to avoid mutations
  const updated = knockouts.map((k) => ({ ...k }));

  // Helper selectors
  const get1st = (g: string) => groupStandings[g]?.[0]?.teamId || null;
  const get2nd = (g: string) => groupStandings[g]?.[1]?.teamId || null;

  // 8 qualified thirds, sorted
  const t3 = bestThirds.slice(0, 8).map((s) => s.teamId);

  // --- 1. ROUND OF 32 PAIRINGS ---
  // R32 Matches mapper:
  // Match 1: 2A vs 2B
  // Match 2: 1C vs 2F
  // Match 3: 1E vs best 3rd #1
  // Match 4: 1I vs best 3rd #2
  // Match 5: 2E vs 2I
  // Match 6: 1F vs 2C
  // Match 7: 1A vs best 3rd #3
  // Match 8: 1L vs best 3rd #4
  // Match 9: 1G vs best 3rd #5
  // Match 10: 1D vs best 3rd #6
  // Match 11: 1H vs 2J
  // Match 12: 2K vs 2L
  // Match 13: 1B vs best 3rd #7
  // Match 14: 2D vs 2G
  // Match 15: 1J vs 2H
  // Match 16: 1K vs best 3rd #8

  const r32Schematic = [
    { home: get2nd('A'), away: get2nd('B') }, // R32-1
    { home: get1st('C'), away: get2nd('F') }, // R32-2
    { home: get1st('E'), away: t3[0] || null },  // R32-3
    { home: get1st('I'), away: t3[1] || null },  // R32-4
    { home: get2nd('E'), away: get2nd('I') }, // R32-5
    { home: get1st('F'), away: get2nd('C') }, // R32-6
    { home: get1st('A'), away: t3[2] || null },  // R32-7
    { home: get1st('L'), away: t3[3] || null },  // R32-8
    { home: get1st('G'), away: t3[4] || null },  // R32-9
    { home: get1st('D'), away: t3[5] || null },  // R32-10
    { home: get1st('H'), away: get2nd('J') }, // R32-11
    { home: get2nd('K'), away: get2nd('L') }, // R32-12
    { home: get1st('B'), away: t3[6] || null },  // R32-13
    { home: get2nd('D'), away: get2nd('G') }, // R32-14
    { home: get1st('J'), away: get2nd('H') }, // R32-15
    { home: get1st('K'), away: t3[7] || null },  // R32-16
  ];

  // Apply to R32
  for (let idx = 0; idx < 16; idx++) {
    const match = updated.find((m) => m.id === `match-r32-${idx + 1}`);
    if (match) {
      const scheme = r32Schematic[idx];
      // Keep existing scores but update home/away IDs
      const rawHomeChanged = match.homeTeamId !== scheme.home;
      const rawAwayChanged = match.awayTeamId !== scheme.away;

      match.homeTeamId = scheme.home;
      match.awayTeamId = scheme.away;

      // If teams shifted, clear result
      if (rawHomeChanged || rawAwayChanged) {
        match.homeGoals = null;
        match.awayGoals = null;
        match.homePenalties = null;
        match.awayPenalties = null;
        match.played = false;
        match.winnerId = null;
      } else if (match.played && match.homeGoals !== null && match.awayGoals !== null) {
        // Recalculate winner to be bulletproof
        if (match.homeGoals > match.awayGoals) {
          match.winnerId = match.homeTeamId;
        } else if (match.awayGoals > match.homeGoals) {
          match.winnerId = match.awayTeamId;
        } else {
          const hp = match.homePenalties ?? 0;
          const ap = match.awayPenalties ?? 0;
          match.winnerId = hp > ap ? match.homeTeamId : match.awayTeamId;
        }
      }
    }
  }

  // Helper to carry forward results from a specific matches pair
  const getWinner = (mId: string) => updated.find((m) => m.id === mId)?.winnerId || null;
  const getLoser = (mId: string) => {
    const match = updated.find((m) => m.id === mId);
    if (!match || !match.played || !match.winnerId) return null;
    return match.winnerId === match.homeTeamId ? match.awayTeamId : match.homeTeamId;
  };

  // --- 2. ROUND OF 16 (8 MATCHES) ---
  // match-r16-1: winner R32-1 vs winner R32-2
  // match-r16-2: winner R32-3 vs winner R32-4
  // match-r16-3: winner R32-5 vs winner R32-6
  // match-r16-4: winner R32-7 vs winner R32-8
  // match-r16-5: winner R32-9 vs winner R32-10
  // match-r16-6: winner R32-11 vs winner R32-12
  // match-r16-7: winner R32-13 vs winner R32-14
  // match-r16-8: winner R32-15 vs winner R32-16
  for (let idx = 0; idx < 8; idx++) {
    const match = updated.find((m) => m.id === `match-r16-${idx + 1}`);
    if (match) {
      const hId = getWinner(`match-r32-${idx * 2 + 1}`);
      const aId = getWinner(`match-r32-${idx * 2 + 2}`);

      const rawHomeChanged = match.homeTeamId !== hId;
      const rawAwayChanged = match.awayTeamId !== aId;

      match.homeTeamId = hId;
      match.awayTeamId = aId;

      if (rawHomeChanged || rawAwayChanged) {
        match.homeGoals = null;
        match.awayGoals = null;
        match.homePenalties = null;
        match.awayPenalties = null;
        match.played = false;
        match.winnerId = null;
      }
    }
  }

  // --- 3. QUARTER-FINALS (4 MATCHES) ---
  // match-qf-1: winner R16-1 vs winner R16-2
  // match-qf-2: winner R16-3 vs winner R16-4
  // match-qf-3: winner R16-5 vs winner R16-6
  // match-qf-4: winner R16-7 vs winner R16-8
  for (let idx = 0; idx < 4; idx++) {
    const match = updated.find((m) => m.id === `match-qf-${idx + 1}`);
    if (match) {
      const hId = getWinner(`match-r16-${idx * 2 + 1}`);
      const aId = getWinner(`match-r16-${idx * 2 + 2}`);

      const rawHomeChanged = match.homeTeamId !== hId;
      const rawAwayChanged = match.awayTeamId !== aId;

      match.homeTeamId = hId;
      match.awayTeamId = aId;

      if (rawHomeChanged || rawAwayChanged) {
        match.homeGoals = null;
        match.awayGoals = null;
        match.homePenalties = null;
        match.awayPenalties = null;
        match.played = false;
        match.winnerId = null;
      }
    }
  }

  // --- 4. SEMI-FINALS (2 MATCHES) ---
  // match-sf-1: winner QF-1 vs winner QF-2
  // match-sf-2: winner QF-3 vs winner QF-4
  for (let idx = 0; idx < 2; idx++) {
    const match = updated.find((m) => m.id === `match-sf-${idx + 1}`);
    if (match) {
      const hId = getWinner(`match-qf-${idx * 2 + 1}`);
      const aId = getWinner(`match-qf-${idx * 2 + 2}`);

      const rawHomeChanged = match.homeTeamId !== hId;
      const rawAwayChanged = match.awayTeamId !== aId;

      match.homeTeamId = hId;
      match.awayTeamId = aId;

      if (rawHomeChanged || rawAwayChanged) {
        match.homeGoals = null;
        match.awayGoals = null;
        match.homePenalties = null;
        match.awayPenalties = null;
        match.played = false;
        match.winnerId = null;
      }
    }
  }

  // --- 5. THIRD PLACE ---
  // match-t3rd: loser SF-1 vs loser SF-2
  const t3rdMatch = updated.find((m) => m.id === 'match-t3rd');
  if (t3rdMatch) {
    const hId = getLoser('match-sf-1');
    const aId = getLoser('match-sf-2');

    const rawHomeChanged = t3rdMatch.homeTeamId !== hId;
    const rawAwayChanged = t3rdMatch.awayTeamId !== aId;

    t3rdMatch.homeTeamId = hId;
    t3rdMatch.awayTeamId = aId;

    if (rawHomeChanged || rawAwayChanged) {
      t3rdMatch.homeGoals = null;
      t3rdMatch.awayGoals = null;
      t3rdMatch.homePenalties = null;
      t3rdMatch.awayPenalties = null;
      t3rdMatch.played = false;
      t3rdMatch.winnerId = null;
    }
  }

  // --- 6. GRAN FINAL ---
  // match-final: winner SF-1 vs winner SF-2
  const finalMatch = updated.find((m) => m.id === 'match-final');
  if (finalMatch) {
    const hId = getWinner('match-sf-1');
    const aId = getWinner('match-sf-2');

    const rawHomeChanged = finalMatch.homeTeamId !== hId;
    const rawAwayChanged = finalMatch.awayTeamId !== aId;

    finalMatch.homeTeamId = hId;
    finalMatch.awayTeamId = aId;

    if (rawHomeChanged || rawAwayChanged) {
      finalMatch.homeGoals = null;
      finalMatch.awayGoals = null;
      finalMatch.homePenalties = null;
      finalMatch.awayPenalties = null;
      finalMatch.played = false;
      finalMatch.winnerId = null;
    }
  }

  return updated;
}
