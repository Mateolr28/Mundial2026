/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { GroupMatch, KnockoutMatch, GroupStanding, Team, SimulationStats } from '../types';
import { TEAMS } from '../data/teams';
import {
  generateInitialGroupMatches,
  generateInitialKnockoutMatches,
  calculateAllGroupStandings,
  calculateThirdPlaceStandings,
  updateKnockoutStage,
  simulateGoals,
} from '../utils/simulator';

// Store structure
interface SimulatorContextType {
  teams: Team[];
  groupMatches: GroupMatch[];
  knockoutMatches: KnockoutMatch[];
  fairPlayScores: { [teamId: string]: number };
  randomSeeds: { [teamId: string]: number };
  manualGoldenBoot: string;
  updateGroupMatchScore: (matchId: string, homeGoals: number | null, awayGoals: number | null) => void;
  updateKnockoutMatchScore: (
    matchId: string,
    homeGoals: number | null,
    awayGoals: number | null,
    homePenalties?: number | null,
    awayPenalties?: number | null
  ) => void;
  simulateCompleteTournament: () => void;
  simulateGroupStageOnly: () => void;
  simulateKnockoutsOnly: () => void;
  resetSimulation: () => void;
  loadSimulation: (data: {
    groupMatches: GroupMatch[];
    knockoutMatches: KnockoutMatch[];
    fairPlayScores: { [teamId: string]: number };
    randomSeeds: { [teamId: string]: number };
    manualGoldenBoot: string;
  }) => boolean;
  groupStandings: { [group: string]: GroupStanding[] };
  thirdPlaceStandings: GroupStanding[];
  stats: SimulationStats;
  getChampion: () => Team | null;
  getRunnerUp: () => Team | null;
  getThirdPlace: () => Team | null;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'fifa_2026_simulator_state_v1';

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groupMatches, setGroupMatches] = useState<GroupMatch[]>([]);
  const [knockoutMatches, setKnockoutMatches] = useState<KnockoutMatch[]>([]);
  const [fairPlayScores, setFairPlayScores] = useState<{ [teamId: string]: number }>({});
  const [randomSeeds, setRandomSeeds] = useState<{ [teamId: string]: number }>({});
  const [manualGoldenBoot, setManualGoldenBoot] = useState<string>('');

  // Initial load
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.groupMatches && parsed.knockoutMatches) {
          setGroupMatches(parsed.groupMatches);
          setKnockoutMatches(parsed.knockoutMatches);
          setFairPlayScores(parsed.fairPlayScores || {});
          setRandomSeeds(parsed.randomSeeds || {});
          setManualGoldenBoot(parsed.manualGoldenBoot || '');
          return;
        }
      } catch (e) {
        console.error('Error loading saved state, initializing fresh state', e);
      }
    }
    initFreshState();
  }, []);

  // Save changes to localStorage automatically
  useEffect(() => {
    if (groupMatches.length > 0 && knockoutMatches.length > 0) {
      const stateToSave = {
        groupMatches,
        knockoutMatches,
        fairPlayScores,
        randomSeeds,
        manualGoldenBoot,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [groupMatches, knockoutMatches, fairPlayScores, randomSeeds, manualGoldenBoot]);

  const initFreshState = (forceNewSeeds = false) => {
    const initialMatches = generateInitialGroupMatches();
    const initialKO = generateInitialKnockoutMatches();

    const seeds: { [teamId: string]: number } = {};
    const fairPlays: { [teamId: string]: number } = {};
    for (const team of TEAMS) {
      seeds[team.id] = forceNewSeeds ? Math.random() : (randomSeeds[team.id] ?? Math.random());
      fairPlays[team.id] = 100 - Math.floor(Math.random() * 8); // Fair Play points, 100 is max (cleanest)
    }

    setGroupMatches(initialMatches);
    setKnockoutMatches(initialKO);
    setRandomSeeds(seeds);
    setFairPlayScores(fairPlays);
    setManualGoldenBoot('');
  };

  // 1. UPDATE GROUP MATCH SCORE
  const updateGroupMatchScore = (matchId: string, homeGoals: number | null, awayGoals: number | null) => {
    setGroupMatches((prevMatches) => {
      return prevMatches.map((m) => {
        if (m.id === matchId) {
          const played = homeGoals !== null && awayGoals !== null;
          return {
            ...m,
            homeGoals,
            awayGoals,
            played,
          };
        }
        return m;
      });
    });
  };

  // 2. UPDATE KNOCKOUT MATCH SCORE
  const updateKnockoutMatchScore = (
    matchId: string,
    homeGoals: number | null,
    awayGoals: number | null,
    homePenalties?: number | null,
    awayPenalties?: number | null
  ) => {
    setKnockoutMatches((prevMatches) => {
      return prevMatches.map((m) => {
        if (m.id === matchId) {
          const played = homeGoals !== null && awayGoals !== null;
          let winnerId: string | null = null;

          if (played && homeGoals !== null && awayGoals !== null) {
            if (homeGoals > awayGoals) {
              winnerId = m.homeTeamId;
            } else if (awayGoals > homeGoals) {
              winnerId = m.awayTeamId;
            } else {
              // Ties in knockout require penalties!
              const hp = homePenalties !== undefined ? homePenalties : m.homePenalties;
              const ap = awayPenalties !== undefined ? awayPenalties : m.awayPenalties;
              if (hp !== null && ap !== null) {
                winnerId = hp > ap ? m.homeTeamId : m.awayTeamId;
              }
            }
          }

          return {
            ...m,
            homeGoals,
            awayGoals,
            homePenalties: homeGoals === awayGoals && homeGoals !== null ? (homePenalties ?? m.homePenalties) : null,
            awayPenalties: homeGoals === awayGoals && homeGoals !== null ? (awayPenalties ?? m.awayPenalties) : null,
            winnerId,
            played,
          };
        }
        return m;
      });
    });
  };

  // Derived state: Standings
  const groupStandings = calculateAllGroupStandings(groupMatches, TEAMS, randomSeeds, fairPlayScores);
  const thirdPlaceStandings = calculateThirdPlaceStandings(groupStandings, TEAMS);

  // Sync / update knockout bracket whenever standings or knockout matches change
  const currentKnockouts = updateKnockoutStage(groupStandings, thirdPlaceStandings, knockoutMatches);

  // If the computed knockouts differ in teams from current state, update it (prevents React infinite loops by doing simple structural equality if teamIds changed)
  let changed = false;
  const mergedKnockouts = knockoutMatches.map((m, idx) => {
    const computed = currentKnockouts[idx];
    if (!computed) return m;
    if (
      m.homeTeamId !== computed.homeTeamId ||
      m.awayTeamId !== computed.awayTeamId ||
      m.winnerId !== computed.winnerId ||
      m.homeGoals !== computed.homeGoals ||
      m.awayGoals !== computed.awayGoals
    ) {
      changed = true;
      return computed;
    }
    return m;
  });

  if (changed && groupMatches.length > 0) {
    setKnockoutMatches(mergedKnockouts);
  }

  // --- AUTO PREDICTIONS ---

  // Predict Group Stage matches
  const simulateGroupStageOnly = (
    customMatches?: GroupMatch[],
    customSeeds?: { [teamId: string]: number },
    customFairPlays?: { [teamId: string]: number }
  ) => {
    const targetMatches = customMatches || groupMatches;
    const targetSeeds = customSeeds || randomSeeds;
    const targetFairPlays = customFairPlays || fairPlayScores;

    const updatedGroupMatches = targetMatches.map((m) => {
      const homeTeam = TEAMS.find((t) => t.id === m.homeTeamId);
      const awayTeam = TEAMS.find((t) => t.id === m.awayTeamId);
      if (!homeTeam || !awayTeam) return m;

      const score = simulateGoals(homeTeam, awayTeam);
      return {
        ...m,
        homeGoals: score.homeG,
        awayGoals: score.awayG,
        played: true,
      };
    });

    // We must calculate the standings from this newly simulated values to accurately propagate the teams before simulating knockouts
    const newGroupStandings = calculateAllGroupStandings(updatedGroupMatches, TEAMS, targetSeeds, targetFairPlays);
    const newThirdPlaceStandings = calculateThirdPlaceStandings(newGroupStandings, TEAMS);
    const initialBlankKnockouts = generateInitialKnockoutMatches();
    const updatedKnockouts = updateKnockoutStage(newGroupStandings, newThirdPlaceStandings, initialBlankKnockouts);

    setGroupMatches(updatedGroupMatches);
    setKnockoutMatches(updatedKnockouts);

    return {
      updatedGroupMatches,
      updatedKnockouts,
      newGroupStandings,
      newThirdPlaceStandings,
    };
  };

  // Predict Knockout matches sequentially based on who propagates
  const simulateKnockoutsOnly = (
    customGroupMatches?: GroupMatch[],
    customKnockoutMatches?: KnockoutMatch[],
    customSeeds?: { [teamId: string]: number },
    customFairPlays?: { [teamId: string]: number }
  ) => {
    const targetGroupMatches = customGroupMatches || groupMatches;
    const targetKnockoutMatches = customKnockoutMatches || knockoutMatches;
    const targetSeeds = customSeeds || randomSeeds;
    const targetFairPlays = customFairPlays || fairPlayScores;

    const stages: ('R32' | 'R16' | 'QF' | 'SF' | 'T3RD' | 'FINAL')[] = ['R32', 'R16', 'QF', 'SF', 'T3RD', 'FINAL'];
    let stateKnockouts = targetKnockoutMatches.map((m) => ({ ...m }));

    for (const stage of stages) {
      // Refresh bracket states so winners of previous stages are correctly loaded
      const currentStandings = calculateAllGroupStandings(targetGroupMatches, TEAMS, targetSeeds, targetFairPlays);
      const currentThirds = calculateThirdPlaceStandings(currentStandings, TEAMS);
      stateKnockouts = updateKnockoutStage(currentStandings, currentThirds, stateKnockouts);

      // Simulate matches in this stage
      stateKnockouts = stateKnockouts.map((match) => {
        if (match.stage !== stage) return match;
        if (!match.homeTeamId || !match.awayTeamId) return match;

        // Simulate score
        const homeTeam = TEAMS.find((t) => t.id === match.homeTeamId);
        const awayTeam = TEAMS.find((t) => t.id === match.awayTeamId);
        if (!homeTeam || !awayTeam) return match;

        const score = simulateGoals(homeTeam, awayTeam);
        let winnerId = null;
        let hp: number | null = null;
        let ap: number | null = null;

        if (score.homeG > score.awayG) {
          winnerId = match.homeTeamId;
        } else if (score.awayG > score.homeG) {
          winnerId = match.awayTeamId;
        } else {
          // penalty shootout simulator
          const biasHome = homeTeam.fifaRanking < awayTeam.fifaRanking; // higher ranking has slight penalty edge
          const p1 = 3 + Math.floor(Math.random() * 3);
          const p2 = p1 === 5 ? 4 : (p1 === 3 ? 4 : p1); // standard shootout scores
          if (biasHome) {
            hp = Math.max(p1, p2 + 1);
            ap = p2;
            winnerId = match.homeTeamId;
          } else {
            ap = Math.max(p1, p2 + 1);
            hp = p2;
            winnerId = match.awayTeamId;
          }
        }

        return {
          ...match,
          homeGoals: score.homeG,
          awayGoals: score.awayG,
          homePenalties: hp,
          awayPenalties: ap,
          winnerId,
          played: true,
        };
      });
    }

    setKnockoutMatches(stateKnockouts);
    return stateKnockouts;
  };

  // Simulate Complete Tournament
  const simulateCompleteTournament = () => {
    // 1. Generate clean fresh starting points
    const initialMatches = generateInitialGroupMatches();
    const initialKO = generateInitialKnockoutMatches();

    const seeds: { [teamId: string]: number } = {};
    const fairPlays: { [teamId: string]: number } = {};
    for (const team of TEAMS) {
      seeds[team.id] = Math.random();
      fairPlays[team.id] = 100 - Math.floor(Math.random() * 8);
    }

    // Set state immediately inside transaction
    setRandomSeeds(seeds);
    setFairPlayScores(fairPlays);
    setManualGoldenBoot('');

    const groupSim = simulateGroupStageOnly(initialMatches, seeds, fairPlays);
    simulateKnockoutsOnly(groupSim.updatedGroupMatches, groupSim.updatedKnockouts, seeds, fairPlays);
  };

  // Reset simulation back to empty state
  const resetSimulation = () => {
    initFreshState(true);
  };

  // Import a simulation from JSON schema
  const loadSimulation = (data: {
    groupMatches: GroupMatch[];
    knockoutMatches: KnockoutMatch[];
    fairPlayScores: { [teamId: string]: number };
    randomSeeds: { [teamId: string]: number };
    manualGoldenBoot: string;
  }): boolean => {
    if (data && Array.isArray(data.groupMatches) && Array.isArray(data.knockoutMatches)) {
      setGroupMatches(data.groupMatches);
      setKnockoutMatches(data.knockoutMatches);
      setFairPlayScores(data.fairPlayScores || {});
      setRandomSeeds(data.randomSeeds || {});
      setManualGoldenBoot(data.manualGoldenBoot || '');
      return true;
    }
    return false;
  };

  // Calculate generic statistics
  const calculateStats = (): SimulationStats => {
    let playedMatches = 0;
    let totalGoals = 0;

    const teamScored: { [id: string]: number } = {};
    const teamConceded: { [id: string]: number } = {};
    const teamWins: { [id: string]: number } = {};
    const teamLosses: { [id: string]: number } = {};
    const teamDraws: { [id: string]: number } = {};

    for (const t of TEAMS) {
      teamScored[t.id] = 0;
      teamConceded[t.id] = 0;
      teamWins[t.id] = 0;
      teamLosses[t.id] = 0;
      teamDraws[t.id] = 0;
    }

    // Process Group Matches
    for (const m of groupMatches) {
      if (m.played && m.homeGoals !== null && m.awayGoals !== null) {
        playedMatches++;
        totalGoals += m.homeGoals + m.awayGoals;

        teamScored[m.homeTeamId] = (teamScored[m.homeTeamId] || 0) + m.homeGoals;
        teamScored[m.awayTeamId] = (teamScored[m.awayTeamId] || 0) + m.awayGoals;

        teamConceded[m.homeTeamId] = (teamConceded[m.homeTeamId] || 0) + m.awayGoals;
        teamConceded[m.awayTeamId] = (teamConceded[m.awayTeamId] || 0) + m.homeGoals;

        if (m.homeGoals > m.awayGoals) {
          teamWins[m.homeTeamId] = (teamWins[m.homeTeamId] || 0) + 1;
          teamLosses[m.awayTeamId] = (teamLosses[m.awayTeamId] || 0) + 1;
        } else if (m.homeGoals < m.awayGoals) {
          teamWins[m.awayTeamId] = (teamWins[m.awayTeamId] || 0) + 1;
          teamLosses[m.homeTeamId] = (teamLosses[m.homeTeamId] || 0) + 1;
        } else {
          teamDraws[m.homeTeamId] = (teamDraws[m.homeTeamId] || 0) + 1;
          teamDraws[m.awayTeamId] = (teamDraws[m.awayTeamId] || 0) + 1;
        }
      }
    }

    // Process Knockouts
    for (const m of knockoutMatches) {
      if (m.played && m.homeGoals !== null && m.awayGoals !== null && m.homeTeamId && m.awayTeamId) {
        playedMatches++;
        totalGoals += m.homeGoals + m.awayGoals;

        teamScored[m.homeTeamId] = (teamScored[m.homeTeamId] || 0) + m.homeGoals;
        teamScored[m.awayTeamId] = (teamScored[m.awayTeamId] || 0) + m.awayGoals;

        teamConceded[m.homeTeamId] = (teamConceded[m.homeTeamId] || 0) + m.awayGoals;
        teamConceded[m.awayTeamId] = (teamConceded[m.awayTeamId] || 0) + m.homeGoals;

        if (m.homeGoals > m.awayGoals) {
          teamWins[m.homeTeamId] = (teamWins[m.homeTeamId] || 0) + 1;
          teamLosses[m.awayTeamId] = (teamLosses[m.awayTeamId] || 0) + 1;
        } else if (m.homeGoals < m.awayGoals) {
          teamWins[m.awayTeamId] = (teamWins[m.awayTeamId] || 0) + 1;
          teamLosses[m.homeTeamId] = (teamLosses[m.homeTeamId] || 0) + 1;
        } else {
          // penalties don't count as standard rules, let's treat draw as a draw + who won
          teamDraws[m.homeTeamId] = (teamDraws[m.homeTeamId] || 0) + 1;
          teamDraws[m.awayTeamId] = (teamDraws[m.awayTeamId] || 0) + 1;
          if (m.winnerId) {
            teamWins[m.winnerId] = (teamWins[m.winnerId] || 0) + 1;
            const loserId = m.winnerId === m.homeTeamId ? m.awayTeamId : m.homeTeamId;
            teamLosses[loserId] = (teamLosses[loserId] || 0) + 1;
          }
        }
      }
    }

    // Identify top scoring, best defense etc
    let maxScored = -1;
    let mostScoringTeam: string | null = null;
    let minConceded = 9999;
    let bestDefenseTeam: string | null = null;
    let maxWins = -1;
    let mostWinsTeam: string | null = null;
    let maxLosses = -1;
    let mostLossesTeam: string | null = null;
    let maxDraws = -1;
    let mostDrawsTeam: string | null = null;

    if (playedMatches > 0) {
      for (const t of TEAMS) {
        // Must have played at least 1 match to count
        const matchesCountOnRecord =
          groupMatches.filter((m) => m.played && (m.homeTeamId === t.id || m.awayTeamId === t.id)).length +
          knockoutMatches.filter((m) => m.played && (m.homeTeamId === t.id || m.awayTeamId === t.id)).length;

        if (matchesCountOnRecord === 0) continue;

        if (teamScored[t.id] > maxScored) {
          maxScored = teamScored[t.id];
          mostScoringTeam = t.id;
        }
        if (teamConceded[t.id] < minConceded) {
          minConceded = teamConceded[t.id];
          bestDefenseTeam = t.id;
        }
        if (teamWins[t.id] > maxWins) {
          maxWins = teamWins[t.id];
          mostWinsTeam = t.id;
        }
        if (teamLosses[t.id] > maxLosses) {
          maxLosses = teamLosses[t.id];
          mostLossesTeam = t.id;
        }
        if (teamDraws[t.id] > maxDraws) {
          maxDraws = teamDraws[t.id];
          mostDrawsTeam = t.id;
        }
      }
    }

    return {
      totalMatches: groupMatches.length + knockoutMatches.length,
      playedMatches,
      totalGoals,
      mostScoringTeam,
      bestDefenseTeam,
      mostWinsTeam,
      mostLossesTeam,
      mostDrawsTeam,
    };
  };

  const getChampion = (): Team | null => {
    const final = knockoutMatches.find((m) => m.id === 'match-final');
    if (final && final.played && final.winnerId) {
      return TEAMS.find((t) => t.id === final.winnerId) || null;
    }
    return null;
  };

  const getRunnerUp = (): Team | null => {
    const final = knockoutMatches.find((m) => m.id === 'match-final');
    if (final && final.played && final.winnerId) {
      const runnerUpId = final.winnerId === final.homeTeamId ? final.awayTeamId : final.homeTeamId;
      return TEAMS.find((t) => t.id === runnerUpId) || null;
    }
    return null;
  };

  const getThirdPlace = (): Team | null => {
    const t3rd = knockoutMatches.find((m) => m.id === 'match-t3rd');
    if (t3rd && t3rd.played && t3rd.winnerId) {
      return TEAMS.find((t) => t.id === t3rd.winnerId) || null;
    }
    return null;
  };

  const stats = calculateStats();

  return (
    <SimulatorContext.Provider
      value={{
        teams: TEAMS,
        groupMatches,
        knockoutMatches,
        fairPlayScores,
        randomSeeds,
        manualGoldenBoot,
        updateGroupMatchScore,
        updateKnockoutMatchScore,
        simulateCompleteTournament,
        simulateGroupStageOnly,
        simulateKnockoutsOnly,
        resetSimulation,
        loadSimulation,
        groupStandings,
        thirdPlaceStandings,
        stats,
        getChampion,
        getRunnerUp,
        getThirdPlace,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
};
