/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSimulator } from '../store/SimulatorContext';
import { Award, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const ThirdPlaces: React.FC = () => {
  const { teams, thirdPlaceStandings } = useSimulator();

  return (
    <div id="third-places-container" className="space-y-6">
      {/* Top Description Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            Tabla de Mejores Terceros
          </h2>
          <p className="text-xs text-slate-400">
            Reglas de desempate oficial del Mundial: los 12 equipos que terminaron en 3º lugar en sus respectivos grupos (A-L) se comparan. Los primeros 8 avanzan a Dieciseisavos.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <motion.div
        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 select-none">
                <th className="py-3 px-4 text-center w-14">#</th>
                <th className="py-3 px-2">Selección</th>
                <th className="py-3 px-3 text-center w-16">Grupo</th>
                <th className="py-3 px-3 text-center w-14">PJ</th>
                <th className="py-3 px-3 text-center w-14">G</th>
                <th className="py-3 px-3 text-center w-14">E</th>
                <th className="py-3 px-3 text-center w-14">P</th>
                <th className="py-3 px-4 text-center w-16">Goles</th>
                <th className="py-3 px-3 text-center w-16">DG</th>
                <th className="py-3 px-4 text-center w-20 font-extrabold text-white">Pts</th>
                <th className="py-3 px-4 text-center w-36">Estado</th>
              </tr>
            </thead>
            <tbody>
              {thirdPlaceStandings.map((row, idx) => {
                const team = teams.find((t) => t.id === row.teamId);
                const isQualified = idx < 8; // Top 8 classify

                return (
                  <tr
                    key={row.teamId}
                    className={`border-b border-slate-800/60 hover:bg-slate-850/30 transition-colors ${
                      isQualified ? 'bg-emerald-950/5' : 'bg-rose-950/5'
                    }`}
                  >
                    {/* Index Rank */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-bold text-xs ${
                          isQualified
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>

                    {/* Team Info */}
                    <td className="py-3.5 px-2 font-semibold">
                      <div className="flex items-center gap-2 text-slate-100">
                        <span className="text-xl select-none">{team?.flag}</span>
                        <span>{team?.name || row.teamId}</span>
                      </div>
                    </td>

                    {/* Source Group */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="bg-slate-950 border border-slate-800 text-slate-400 font-extrabold px-2.5 py-0.5 rounded text-[11px] tracking-wider">
                        Grupo {team?.group || '?'}
                      </span>
                    </td>

                    {/* Stats columns */}
                    <td className="py-3.5 px-3 text-center text-slate-300">{row.played}</td>
                    <td className="py-3.5 px-3 text-center text-slate-400">{row.won}</td>
                    <td className="py-3.5 px-3 text-center text-slate-400">{row.drawn}</td>
                    <td className="py-3.5 px-3 text-center text-slate-400">{row.lost}</td>

                    <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                      {row.gf}:{row.gc}
                    </td>

                    <td
                      className={`py-3.5 px-3 text-center font-bold ${
                        row.gd > 0
                          ? 'text-emerald-400'
                          : row.gd < 0
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {row.gd > 0 ? `+${row.gd}` : row.gd}
                    </td>

                    <td className="py-3.5 px-4 text-center font-extrabold text-white text-base">
                      {row.points}
                    </td>

                    {/* Qualification Badges */}
                    <td className="py-3.5 px-4 text-center">
                      {isQualified ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Clasifica (R32)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <XCircle className="w-3.5 h-3.5" />
                          Eliminado
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
