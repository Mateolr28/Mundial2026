/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSimulator } from '../store/SimulatorContext';
import { BarChart, Trophy, Flame, Shield, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const StatsView: React.FC = () => {
  const {
    teams,
    stats,
    manualGoldenBoot,
    groupMatches,
    knockoutMatches,
    getChampion,
    getRunnerUp,
    getThirdPlace,
  } = useSimulator();

  const [bootText, setBootText] = useState(manualGoldenBoot);

  useEffect(() => {
    setBootText(manualGoldenBoot);
  }, [manualGoldenBoot]);

  const handleBootChange = (val: string) => {
    setBootText(val);
    // Directly save to localStorage variable since we have auto-saving for contextual state!
    const saved = localStorage.getItem('fifa_2026_simulator_state_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.manualGoldenBoot = val;
        localStorage.setItem('fifa_2026_simulator_state_v1', JSON.stringify(parsed));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getTeamNameWithFlag = (id: string | null) => {
    if (!id) return 'N/A';
    const t = teams.find((item) => item.id === id);
    if (!t) return id;
    return `${t.flag} ${t.name}`;
  };

  const champ = getChampion();
  const runner = getRunnerUp();
  const third = getThirdPlace();

  return (
    <div id="stats-container" className="space-y-6">
      {/* Overview stats */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart className="w-5 h-5 text-indigo-400" />
          Estadísticas y Premios del Torneo
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Visualización de datos acumulados sobre los goles, defensas y podio del Mundial 2026.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* PODIUM CARD */}
        <motion.div
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Podio del Mundial 2026
          </h3>

          <div className="space-y-3">
            {/* 1st Place */}
            <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <div>
                  <div className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wide">
                    CAMPEÓN
                  </div>
                  <div className="text-sm font-bold text-slate-100">
                    {champ ? `${champ.flag} ${champ.name}` : 'Por definir'}
                  </div>
                </div>
              </div>
            </div>

            {/* 2nd Place */}
            <div className="flex items-center justify-between p-3 bg-slate-400/5 border border-slate-400/10 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-xl">🥈</span>
                <div>
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                    SUBCAMPEÓN
                  </div>
                  <div className="text-sm font-bold text-slate-100">
                    {runner ? `${runner.flag} ${runner.name}` : 'Por definir'}
                  </div>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex items-center justify-between p-3 bg-amber-700/5 border border-amber-700/10 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-xl">🥉</span>
                <div>
                  <div className="text-[10px] text-amber-600 font-extrabold uppercase tracking-wide">
                    TERCER PUESTO
                  </div>
                  <div className="text-sm font-bold text-slate-100">
                    {third ? `${third.flag} ${third.name}` : 'Por definir'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* TOURNAMENT TOTALS AND GOLDEN BOOT */}
        <motion.div
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Totales del Torneo
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center">
              <div className="text-2xl font-black text-indigo-400">
                {stats.playedMatches}
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                Partidos Jugados
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center">
              <div className="text-2xl font-black text-emerald-400">
                {stats.totalGoals}
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                Goles Totales
              </div>
            </div>
          </div>

          {/* Golden boot Manual Input */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-slate-300 uppercase block tracking-wider">
              Bota de Oro (Goleador del Torneo)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Escribe el nombre del goleador ej. Erling Haaland"
                value={bootText}
                onChange={(e) => handleBootChange(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-600"
              />
              <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
            </div>
            <p className="text-[10px] text-slate-500 italic mt-1">
              *Se guarda automáticamente con la simulación.
            </p>
          </div>
        </motion.div>

        {/* TEAM RECORDS CARD */}
        <motion.div
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Flame className="w-4 h-4 text-purple-400" />
            Récords de Equipos
          </h3>

          <div className="space-y-3.5 text-xs sm:text-sm pt-1">
            {/* Most Goals */}
            <div className="flex justify-between items-center sm:gap-2">
              <span className="text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                Más Goleador
              </span>
              <span className="font-extrabold text-slate-200">
                {getTeamNameWithFlag(stats.mostScoringTeam)}
              </span>
            </div>

            {/* Best Defense */}
            <div className="flex justify-between items-center sm:gap-2">
              <span className="text-slate-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                Mejor Defensa
              </span>
              <span className="font-extrabold text-slate-200">
                {getTeamNameWithFlag(stats.bestDefenseTeam)}
              </span>
            </div>

            {/* Most Wins */}
            <div className="flex justify-between items-center sm:gap-2">
              <span className="text-slate-400">Más Victorias</span>
              <span className="font-extrabold text-slate-200">
                {getTeamNameWithFlag(stats.mostWinsTeam)}
              </span>
            </div>

            {/* Most Draws */}
            <div className="flex justify-between items-center sm:gap-2">
              <span className="text-slate-400 font-medium">Más Empates</span>
              <span className="font-extrabold text-slate-200">
                {getTeamNameWithFlag(stats.mostDrawsTeam)}
              </span>
            </div>

            {/* Most Losses */}
            <div className="flex justify-between items-center sm:gap-2">
              <span className="text-slate-400">Más Derrotas</span>
              <span className="font-extrabold text-slate-200">
                {getTeamNameWithFlag(stats.mostLossesTeam)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
