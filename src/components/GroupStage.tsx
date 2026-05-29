/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSimulator } from '../store/SimulatorContext';
import { GROUPS } from '../data/teams';
import { Shield, Eye, EyeOff, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const GroupStage: React.FC = () => {
  const {
    teams,
    groupMatches,
    groupStandings,
    updateGroupMatchScore,
    simulateGroupStageOnly,
  } = useSimulator();

  // Filter groups if search or active tab is chosen
  const [activeTab, setActiveTab] = useState<'ALL' | 'A-D' | 'E-H' | 'I-L'>('ALL');
  const [expandedMatches, setExpandedMatches] = useState<{ [group: string]: boolean }>({});

  const toggleGroupMatches = (group: string) => {
    setExpandedMatches(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const getFilteredGroups = () => {
    switch (activeTab) {
      case 'A-D':
        return ['A', 'B', 'C', 'D'];
      case 'E-H':
        return ['E', 'F', 'G', 'H'];
      case 'I-L':
        return ['I', 'J', 'K', 'L'];
      default:
        return GROUPS;
    }
  };

  const filteredGroups = getFilteredGroups();

  return (
    <div id="group-stage-container" className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            Fase de Grupos (48 Selecciones)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Los 2 primeros de cada grupo y los 8 mejores terceros clasifican a la Ronda de 32.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => simulateGroupStageOnly()}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-slate-950 font-bold text-sm py-2 px-4 rounded-lg shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Simular Grupos
          </button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap gap-1 bg-slate-900/50 p-1 border border-slate-800 rounded-lg max-w-md">
        {(['ALL', 'A-D', 'E-H', 'I-L'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-1.5 px-3 rounded-md text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-indigo-600 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'ALL' ? 'Todos los Grupos' : `Grupos ${tab}`}
          </button>
        ))}
      </div>

      {/* Grid of Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGroups.map((group) => {
          const standings = groupStandings[group] || [];
          const matches = groupMatches.filter((m) => m.group === group);
          const isExpanded = expandedMatches[group] !== false; // expanded by default

          return (
            <motion.div
              layout
              key={group}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                <span className="text-md font-bold text-white tracking-widest uppercase">
                  GRUPO {group}
                </span>
                <button
                  onClick={() => toggleGroupMatches(group)}
                  className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {isExpanded ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      Ocultar Partidos
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      Mostrar Partidos
                    </>
                  )}
                </button>
              </div>

              {/* Standings Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                      <th className="py-2 pl-3 select-none text-center">Pos</th>
                      <th className="py-2 pl-2">Selección</th>
                      <th className="py-2 text-center w-8">PJ</th>
                      <th className="py-2 text-center w-8 hidden sm:table-cell">G</th>
                      <th className="py-2 text-center w-8 hidden sm:table-cell">E</th>
                      <th className="py-2 text-center w-8 hidden sm:table-cell">P</th>
                      <th className="py-2 text-center w-10">Goles</th>
                      <th className="py-2 text-center w-8">DG</th>
                      <th className="py-2 pr-3 text-center font-extrabold text-white">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((row, idx) => {
                      const team = teams.find((t) => t.id === row.teamId);
                      const isQualifyingDirectly = idx < 2; // top 2
                      
                      return (
                        <tr
                          key={row.teamId}
                          className={`border-b border-slate-800/50 hover:bg-slate-850/40 transition-colors ${
                            isQualifyingDirectly ? 'bg-indigo-950/5' : ''
                          }`}
                        >
                          <td className="py-2.5 text-center font-bold">
                            <span
                              className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] ${
                                idx === 0
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : idx === 1
                                  ? 'bg-indigo-500/20 text-indigo-300'
                                  : idx === 2
                                  ? 'bg-emerald-500/10 text-emerald-300'
                                  : 'text-slate-400'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-2.5 pl-2 font-medium">
                            <div className="flex items-center gap-1.5 overflow-hidden text-slate-100">
                              <span className="text-base select-none">{team?.flag}</span>
                              <span className="truncate">{team?.name || row.teamId}</span>
                            </div>
                          </td>
                          <td className="py-2.5 text-center text-slate-300">{row.played}</td>
                          <td className="py-2.5 text-center text-slate-400 hidden sm:table-cell">{row.won}</td>
                          <td className="py-2.5 text-center text-slate-400 hidden sm:table-cell">{row.drawn}</td>
                          <td className="py-2.5 text-center text-slate-400 hidden sm:table-cell">{row.lost}</td>
                          <td className="py-2.5 text-center text-slate-400 text-[11px]">
                            {row.gf}:{row.gc}
                          </td>
                          <td
                            className={`py-2.5 text-center font-semibold text-[11px] ${
                              row.gd > 0
                                ? 'text-emerald-400'
                                : row.gd < 0
                                ? 'text-rose-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {row.gd > 0 ? `+${row.gd}` : row.gd}
                          </td>
                          <td className="py-2.5 pr-3 text-center font-bold text-white text-sm">
                            {row.points}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Matches List */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-slate-800 bg-slate-950/70"
                  >
                    <div className="p-3 space-y-2.5">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Partidos del Grupo
                      </div>
                      <div className="space-y-2">
                        {matches.map((m) => {
                          const home = teams.find((t) => t.id === m.homeTeamId);
                          const away = teams.find((t) => t.id === m.awayTeamId);
                          if (!home || !away) return null;

                          return (
                            <div
                              key={m.id}
                              className="flex items-center justify-between gap-2 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs"
                            >
                              {/* Home Team */}
                              <div className="flex-1 flex items-center gap-1.5 overflow-hidden">
                                <span className="text-md select-none">{home.flag}</span>
                                <span className="font-semibold text-slate-200 truncate pr-1">
                                  {home.name}
                                </span>
                              </div>

                              {/* Live Score Editors */}
                              <div className="flex items-center gap-1 shadow-inner bg-slate-950 p-1 rounded-md border border-slate-800">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  placeholder="-"
                                  value={m.homeGoals !== null ? m.homeGoals : ''}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    updateGroupMatchScore(m.id, val === '' ? null : Number(val), m.awayGoals);
                                  }}
                                  className="w-8 h-6 text-center bg-transparent text-white font-bold text-sm focus:outline-none placeholder-slate-600 rounded"
                                />
                                <span className="text-slate-600 font-extrabold select-none">:</span>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  placeholder="-"
                                  value={m.awayGoals !== null ? m.awayGoals : ''}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    updateGroupMatchScore(m.id, m.homeGoals, val === '' ? null : Number(val));
                                  }}
                                  className="w-8 h-6 text-center bg-transparent text-white font-bold text-sm focus:outline-none placeholder-slate-600 rounded"
                                />
                              </div>

                              {/* Away Team */}
                              <div className="flex-1 flex items-center justify-end gap-1.5 overflow-hidden">
                                <span className="font-semibold text-slate-200 truncate pl-1">
                                  {away.name}
                                </span>
                                <span className="text-md select-none">{away.flag}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
