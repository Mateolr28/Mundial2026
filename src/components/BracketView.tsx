/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSimulator } from '../store/SimulatorContext';
import { KnockoutMatch, Team } from '../types';
import { GitCommit, Sparkles, RefreshCw, Trophy, AlertTriangle, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { simulateGoals } from '../utils/simulator';

export const BracketView: React.FC = () => {
  const {
    teams,
    knockoutMatches,
    updateKnockoutMatchScore,
    simulateKnockoutsOnly,
  } = useSimulator();

  const [activeSegment, setActiveSegment] = useState<'LIST' | 'TREE'>('LIST');
  const [activeStageTab, setActiveStageTab] = useState<'R32' | 'R16' | 'QF' | 'SF' | 'FINAL'>('R32');

  // Helper: Find team by ID
  const findTeam = (id: string | null): Team | null => {
    if (!id) return null;
    return teams.find((t) => t.id === id) || null;
  };

  // Helper: Simulate single knockout match live
  const simulateSingleMatch = (m: KnockoutMatch) => {
    if (!m.homeTeamId || !m.awayTeamId) return;
    const home = findTeam(m.homeTeamId);
    const away = findTeam(m.awayTeamId);
    if (!home || !away) return;

    const res = simulateGoals(home, away);
    let hp: number | null = null;
    let ap: number | null = null;

    if (res.homeG === res.awayG) {
      // Simulate shootout
      const biasHome = home.fifaRanking < away.fifaRanking;
      const baseShootout = 3 + Math.floor(Math.random() * 3);
      const otherShootout = baseShootout === 3 ? 4 : baseShootout - 1;
      if (biasHome) {
        hp = Math.max(baseShootout, otherShootout + 1);
        ap = otherShootout;
      } else {
        ap = Math.max(baseShootout, otherShootout + 1);
        hp = otherShootout;
      }
    }

    updateKnockoutMatchScore(m.id, res.homeG, res.awayG, hp, ap);
  };

  // Stage details mapper
  const getStageName = (s: string) => {
    switch (s) {
      case 'R32': return 'Dieciseisavos (Round of 32)';
      case 'R16': return 'Octavos de Final';
      case 'QF': return 'Cuartos de Final';
      case 'SF': return 'Semifinales';
      case 'T3RD': return 'Tercer Puesto';
      case 'FINAL': return 'Gran Final';
      default: return '';
    }
  };

  // Render a match block for both tree and list views
  const RenderMatchCard = ({ match, index, isTreeView = false }: { match: KnockoutMatch; index: number; isTreeView?: boolean }) => {
    const home = findTeam(match.homeTeamId);
    const away = findTeam(match.awayTeamId);
    const isTied = match.played && match.homeGoals !== null && match.awayGoals !== null && match.homeGoals === match.awayGoals;
    
    const isHomeWinner = match.winnerId === match.homeTeamId && match.played;
    const isAwayWinner = match.winnerId === match.awayTeamId && match.played;

    const isDisabled = !match.homeTeamId || !match.awayTeamId;

    return (
      <div
        className={`bg-slate-900 border ${
          match.played ? 'border-slate-800' : 'border-indigo-950/40 bg-slate-900/60'
        } rounded-xl shadow-lg hover:border-indigo-800/60 transition-all overflow-hidden ${
          isTreeView ? 'w-64 flex-shrink-0' : 'w-full'
        }`}
      >
        {/* Match Header */}
        <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-800/60 flex justify-between items-center text-[10px]">
          <span className="font-extrabold text-indigo-400 uppercase tracking-widest">
            {match.label || `Partido ${index + 1}`}
          </span>
          {match.played ? (
            <span className="text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.2 rounded">
              Finalizado
            </span>
          ) : !isDisabled ? (
            <button
              onClick={() => simulateSingleMatch(match)}
              className="text-slate-400 hover:text-indigo-300 font-semibold flex items-center gap-1 bg-slate-900 px-1 border border-slate-800 rounded transition-all cursor-pointer"
            >
              <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
              Simular
            </button>
          ) : (
            <span className="text-slate-500 font-medium">Por definir</span>
          )}
        </div>

        {/* Match Body */}
        <div className="p-3 space-y-2">
          {isDisabled ? (
            <div className="py-4 text-center text-xs text-slate-500 italic select-none">
              Esperando equipos clasificados...
            </div>
          ) : (
            <div className="space-y-2 text-xs sm:text-sm">
              {/* Home Row */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1.5 overflow-hidden ${isHomeWinner ? 'font-bold text-white' : 'text-slate-300'}`}>
                  <span className="text-lg select-none">{home?.flag}</span>
                  <span className="truncate">{home?.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Penalty box if tied */}
                  {isTied && (
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Pen"
                      value={match.homePenalties !== null ? match.homePenalties : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        updateKnockoutMatchScore(
                          match.id,
                          match.homeGoals,
                          match.awayGoals,
                          val === '' ? null : Number(val),
                          match.awayPenalties
                        );
                      }}
                      className="w-8 h-6 text-center text-[10px] bg-emerald-950/40 text-emerald-400 font-extrabold border border-emerald-900/60 rounded focus:outline-none"
                    />
                  )}
                  {/* Goals Box */}
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="-"
                    value={match.homeGoals !== null ? match.homeGoals : ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      updateKnockoutMatchScore(match.id, val === '' ? null : Number(val), match.awayGoals);
                    }}
                    className={`w-10 h-8 text-center bg-slate-950 border ${
                      isHomeWinner ? 'border-emerald-600 text-white font-black' : 'border-slate-800 text-slate-300'
                    } rounded font-semibold text-sm focus:outline-none focus:border-indigo-500`}
                  />
                </div>
              </div>

              {/* Away Row */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1.5 overflow-hidden ${isAwayWinner ? 'font-bold text-white' : 'text-slate-300'}`}>
                  <span className="text-lg select-none">{away?.flag}</span>
                  <span className="truncate">{away?.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Penalty box if tied */}
                  {isTied && (
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Pen"
                      value={match.awayPenalties !== null ? match.awayPenalties : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        updateKnockoutMatchScore(
                          match.id,
                          match.homeGoals,
                          match.awayGoals,
                          match.homePenalties,
                          val === '' ? null : Number(val)
                        );
                      }}
                      className="w-8 h-6 text-center text-[10px] bg-emerald-950/40 text-emerald-400 font-extrabold border border-emerald-900/60 rounded focus:outline-none"
                    />
                  )}
                  {/* Goals Box */}
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="-"
                    value={match.awayGoals !== null ? match.awayGoals : ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      updateKnockoutMatchScore(match.id, match.homeGoals, val === '' ? null : Number(val));
                    }}
                    className={`w-10 h-8 text-center bg-slate-950 border ${
                      isAwayWinner ? 'border-emerald-600 text-white font-black' : 'border-slate-800 text-slate-300'
                    } rounded font-semibold text-sm focus:outline-none focus:border-indigo-500`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Filter current stage matches in List mode
  const getStageMatches = (stg: string): KnockoutMatch[] => {
    if (stg === 'FINAL') {
      return knockoutMatches.filter((m) => m.stage === 'FINAL' || m.stage === 'T3RD');
    }
    return knockoutMatches.filter((m) => m.stage === stg);
  };

  const stageMatches = getStageMatches(activeStageTab);

  // --- TREE BRACKET BUILDER ---
  // Returns sorted knockout indices for correct left/right side alignments
  const getTreeStructure = () => {
    // Stage lists
    const r32 = knockoutMatches.filter(m => m.stage === 'R32');
    const r16 = knockoutMatches.filter(m => m.stage === 'R16');
    const qf = knockoutMatches.filter(m => m.stage === 'QF');
    const sf = knockoutMatches.filter(m => m.stage === 'SF');
    const t3rd = knockoutMatches.filter(m => m.stage === 'T3RD')[0];
    const final = knockoutMatches.filter(m => m.stage === 'FINAL')[0];

    return { r32, r16, qf, sf, t3rd, final };
  };

  const tree = getTreeStructure();

  return (
    <div id="bracket-container" className="space-y-6">
      {/* Top Banner Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-400" />
            Cruces de Eliminación Directa
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Resultados partido a partido de la fase eliminatoria. Si hay empate, ingresa los resultados de los penales.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => simulateKnockoutsOnly()}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-slate-950 font-bold text-xs sm:text-sm py-2 px-4 rounded-lg shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Simular Eliminatorias
          </button>
        </div>
      </div>

      {/* Segment Selector: Tree Graphic vs List density */}
      <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 w-full sm:w-80">
        <button
          onClick={() => setActiveSegment('LIST')}
          className={`flex-1 text-center font-black text-xs py-2 rounded-md transition-all cursor-pointer ${
            activeSegment === 'LIST'
              ? 'bg-indigo-600 text-slate-950 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Lista de Cruces
        </button>
        <button
          onClick={() => setActiveSegment('TREE')}
          className={`flex-1 text-center font-black text-xs py-2 rounded-md transition-all cursor-pointer ${
            activeSegment === 'TREE'
              ? 'bg-indigo-600 text-slate-950 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Árbol Visual (Bracket)
        </button>
      </div>

      {/* RENDER VIEW: LIST */}
      {activeSegment === 'LIST' && (
        <div className="space-y-6">
          {/* Stage Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-900/50 p-1 border border-slate-800 rounded-lg overflow-x-auto">
            {(['R32', 'R16', 'QF', 'SF', 'FINAL'] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => setActiveStageTab(stage)}
                className={`py-2 px-4 rounded-md text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  activeStageTab === stage
                    ? 'bg-indigo-600 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {stage === 'FINAL'
                  ? 'Finales (🏆 & 🥉)'
                  : stage === 'R32'
                  ? 'Dieciseisavos'
                  : stage === 'R16'
                  ? 'Octavos'
                  : stage === 'QF'
                  ? 'Cuartos'
                  : 'Semifinales'}
              </button>
            ))}
          </div>

          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">
            {getStageName(activeStageTab)}
          </h3>

          {/* Matches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stageMatches.map((m, idx) => (
              <div key={m.id} className="w-full">
                <RenderMatchCard match={m} index={idx} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RENDER VIEW: TREE */}
      {activeSegment === 'TREE' && (
        <div className="w-full overflow-x-auto bg-slate-950/20 rounded-2xl border border-slate-800/40 p-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {/* Visual Horizontal Bracket Graph */}
          <div className="flex gap-8 justify-between min-w-[1300px]">
            {/* COLUMN 1: R32 */}
            <div className="flex flex-col justify-around gap-4 py-2">
              <div className="text-center font-bold text-xs text-indigo-400 tracking-wider mb-2 select-none uppercase">
                Dieciseisavos (Match 73-88)
              </div>
              {tree.r32.map((m, idx) => (
                <div key={m.id} className="relative py-1">
                  <RenderMatchCard match={m} index={idx} isTreeView={true} />
                  {/* Connection Line to right */}
                  <div className="absolute right-0 top-1/2 w-4 h-[1px] bg-slate-800 translate-x-full"></div>
                </div>
              ))}
            </div>

            {/* COLUMN 2: R16 */}
            <div className="flex flex-col justify-around gap-8 py-2">
              <div className="text-center font-bold text-xs text-indigo-400 tracking-wider mb-2 select-none uppercase">
                Octavos de Final
              </div>
              {tree.r16.map((m, idx) => (
                <div key={m.id} className="relative py-1">
                  <RenderMatchCard match={m} index={idx} isTreeView={true} />
                  {/* Connection line helper */}
                  <div className="absolute left-0 top-1/2 w-4 h-[1px] bg-slate-800 -translate-x-full"></div>
                  <div className="absolute right-0 top-1/2 w-4 h-[1px] bg-slate-800 translate-x-full"></div>
                </div>
              ))}
            </div>

            {/* COLUMN 3: QF */}
            <div className="flex flex-col justify-around gap-16 py-2">
              <div className="text-center font-bold text-xs text-indigo-400 tracking-wider mb-2 select-none uppercase">
                Cuartos de Final
              </div>
              {tree.qf.map((m, idx) => (
                <div key={m.id} className="relative py-1">
                  <RenderMatchCard match={m} index={idx} isTreeView={true} />
                  {/* Connection line helper */}
                  <div className="absolute left-0 top-1/2 w-4 h-[1px] bg-slate-800 -translate-x-full"></div>
                  <div className="absolute right-0 top-1/2 w-4 h-[1px] bg-slate-800 translate-x-full"></div>
                </div>
              ))}
            </div>

            {/* COLUMN 4: SF */}
            <div className="flex flex-col justify-around gap-20 py-2">
              <div className="text-center font-bold text-xs text-indigo-400 tracking-wider mb-2 select-none uppercase">
                Semifinales
              </div>
              {tree.sf.map((m, idx) => (
                <div key={m.id} className="relative py-1">
                  <RenderMatchCard match={m} index={idx} isTreeView={true} />
                  {/* Connection line helper */}
                  <div className="absolute left-0 top-1/2 w-4 h-[1px] bg-slate-800 -translate-x-full"></div>
                  <div className="absolute right-0 top-1/2 w-4 h-[1px] bg-slate-800 translate-x-full"></div>
                </div>
              ))}
            </div>

            {/* COLUMN 5: FINALS (Champion & Third Place) */}
            <div className="flex flex-col justify-center gap-12 py-2">
              <div className="text-center font-bold text-xs text-amber-400 tracking-wider mb-2 select-none uppercase">
                Final & Tercer Puesto
              </div>
              
              {/* Grand Final Card */}
              {tree.final && (
                <div className="space-y-2 relative border border-amber-500/20 p-2.5 rounded-2xl bg-amber-950/5">
                  <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> Gran Final (🏆 Campeón)
                  </div>
                  <RenderMatchCard match={tree.final} index={0} isTreeView={true} />
                  <div className="absolute left-0 top-1/2 w-4 h-[1px] bg-slate-800 -translate-x-full"></div>
                </div>
              )}

              {/* 3rd Place Card */}
              {tree.t3rd && (
                <div className="space-y-2 relative border border-slate-700/30 p-2.5 rounded-2xl bg-slate-900/40">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <GitCommit className="w-3.5 h-3.5 text-slate-400" /> Partido por Tercer Puesto (🥉)
                  </div>
                  <RenderMatchCard match={tree.t3rd} index={0} isTreeView={true} />
                  <div className="absolute left-0 top-1/2 w-4 h-[1px] bg-slate-800 -translate-x-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
