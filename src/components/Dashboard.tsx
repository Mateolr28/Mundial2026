/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { useSimulator } from '../store/SimulatorContext';
import { exportSimulationToExcel, importSimulationFromExcel } from '../exports/excelUtility';
import {
  Trophy,
  Sparkles,
  RefreshCw,
  Share2,
  FileSpreadsheet,
  Upload,
  Check,
  Zap,
  Calendar,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
  const {
    teams,
    groupMatches,
    knockoutMatches,
    groupStandings,
    thirdPlaceStandings,
    stats,
    resetSimulation,
    simulateCompleteTournament,
    loadSimulation,
    getChampion,
    getRunnerUp,
    getThirdPlace,
  } = useSimulator();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copyingLink, setCopyingLink] = useState(false);
  const [copyingJson, setCopyingJson] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const triggerStatusMessage = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  const champ = getChampion();
  const runner = getRunnerUp();
  const third = getThirdPlace();

  // Excel Trigger
  const handleExportExcel = () => {
    exportSimulationToExcel({
      groupMatches,
      knockoutMatches,
      groupStandings,
      thirdPlaceStandings,
      champion: champ,
      runnerUp: runner,
      thirdPlace: third,
    });
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importSimulationFromExcel(
      file,
      (res) => {
        if (res) {
          const fairPlayScores: { [teamId: string]: number } = {};
          const randomSeeds: { [teamId: string]: number } = {};
          teams.forEach((t) => {
            fairPlayScores[t.id] = 100 - Math.floor(Math.random() * 8);
            randomSeeds[t.id] = Math.random();
          });

          const success = loadSimulation({
            groupMatches: res.groupMatches,
            knockoutMatches: res.knockoutMatches,
            fairPlayScores,
            randomSeeds,
            manualGoldenBoot: '',
          });

          if (success) {
            triggerStatusMessage('¡Simulación de Excel importada con éxito!', 'success');
          }
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      (errorMsg) => {
        triggerStatusMessage(`Error al importar Excel: ${errorMsg}`, 'error');
      }
    );
  };

  // Compressed link sharing
  const handleCopyLink = () => {
    setCopyingLink(true);
    try {
      const stateObj = {
        gm: groupMatches.map((m) => ({ id: m.id, hg: m.homeGoals, ag: m.awayGoals, p: m.played })),
        ko: knockoutMatches.map((m) => ({
          id: m.id,
          hg: m.homeGoals,
          ag: m.awayGoals,
          hp: m.homePenalties,
          ap: m.awayPenalties,
          p: m.played,
          w: m.winnerId,
        })),
      };

      const compressed = btoa(JSON.stringify(stateObj));
      const shareUrl = `${window.location.origin}${window.location.pathname}?sim=${encodeURIComponent(compressed)}`;
      
      navigator.clipboard.writeText(shareUrl);
      setTimeout(() => setCopyingLink(false), 2000);
    } catch (err) {
      console.error(err);
      setCopyingLink(false);
    }
  };

  // Copy JSON Code
  const handleCopyJson = () => {
    setCopyingJson(true);
    try {
      const stateObj = {
        groupMatches,
        knockoutMatches,
      };
      navigator.clipboard.writeText(JSON.stringify(stateObj, null, 2));
      setTimeout(() => setCopyingJson(false), 2000);
    } catch (err) {
      console.error(err);
      setCopyingJson(false);
    }
  };

  return (
    <div id="dashboard-container" className="space-y-6">
      {statusMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-4 rounded-xl border flex items-center gap-3 shadow-md ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-rose-950/40 border-rose-500/20 text-rose-300'
              : 'bg-indigo-950/40 border-indigo-500/20 text-indigo-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <span className="p-1 px-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-extrabold text-xs">✓</span>
          ) : statusMessage.type === 'error' ? (
            <span className="p-1 px-1.5 rounded-lg bg-rose-500/10 text-rose-400 font-extrabold text-xs">✗</span>
          ) : (
            <span className="p-1 px-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-extrabold text-xs">i</span>
          )}
          <span className="text-xs sm:text-sm font-semibold">{statusMessage.text}</span>
        </motion.div>
      )}

      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/20 rounded-2xl overflow-hidden p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-85 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>

        <div className="space-y-3 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 font-bold text-xs rounded-full uppercase tracking-widest border border-indigo-400/20">
            <Calendar className="w-3.5 h-3.5" />
            Mayo 2026 - Road to 2026
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Simulador Mundial <span className="text-indigo-400 bg-indigo-500/10 px-2 rounded-md">FIFA 2026</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Simula de extremo a extremo todos los partidos de la Copa del Mundo de Norteamérica 2026. Calcula mejores terceros, ordena automáticamente las tablas y visualiza los cruces oficiales de llaves de eliminación directa hasta encontrar el campeón.
          </p>
        </div>

        {/* Big Quick Simulation Trigger Badge */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-2xl border border-slate-800 shadow-inner w-full md:w-auto flex-shrink-0 min-w-[240px]">
          <Trophy className="w-12 h-12 text-amber-400 animate-pulse mb-3" />
          <button
            onClick={() => simulateCompleteTournament()}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-slate-950 font-black text-sm py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-600/35 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current text-slate-950" />
            Simulación Completa
          </button>
          <div className="text-[10px] text-slate-500 mt-2 font-semibold">
            Predicción automática basada en Ranking FIFA
          </div>
        </div>
      </div>

      {/* Metrics Summary Blocks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">
            Selecciones
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-100 mt-1">48</div>
          <span className="text-[10px] text-slate-500 mt-0.5">12 Grupos (A-L) x 4</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">
            Progreso General
          </span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-400 mt-1">
            {stats.playedMatches} <span className="text-slate-500 text-sm font-medium">/ 104</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5">Partidos completados</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">
            Goles Convertidos
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
            {stats.totalGoals}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5">
            Avg {stats.playedMatches > 0 ? (stats.totalGoals / stats.playedMatches).toFixed(1) : 0} por partido
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">
            Líder del Podio
          </span>
          <div className="text-md sm:text-lg font-extrabold text-slate-100 truncate mt-1">
            {champ ? `${champ.flag} ${champ.name}` : 'En juego...'}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5">Actual Campeón</span>
        </div>
      </div>

      {/* Control Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Block: Export Import Data */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            Integración con Excel (XLSX)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Puedes exportar los resultados y tablas a un archivo Excel con múltiples hojas para análisis local o importarlo de vuelta para restaurar tu simulación sin pérdida de datos.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            {/* Export */}
            <button
              onClick={handleExportExcel}
              className="flex-1 bg-slate-950 hover:bg-slate-850/80 border border-slate-800 text-slate-200 font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              Exportar Excel (XLSX)
            </button>

            {/* Import Button */}
            <div className="flex-1 relative">
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx"
                onChange={handleImportExcel}
                className="hidden"
                id="excel-file-uploader"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-slate-950 hover:bg-slate-850/80 border border-slate-800 text-slate-200 font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-indigo-400" />
                Importar Excel (XLSX)
              </button>
            </div>
          </div>
        </div>

        {/* Block: Share Simulation */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Share2 className="w-4 h-4 text-indigo-400" />
            Compartir y Almacenar Simulación
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Genera un enlace único codificado que guarda toda tu predicción actual en la URL, o copia el código JSON completo para cargarlo manualmente.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            {/* Copy link */}
            <button
              onClick={handleCopyLink}
              className="flex-1 bg-slate-950 hover:bg-slate-850/80 border border-slate-800 text-slate-200 font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copyingLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  ¡Link Copiado!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-indigo-400" />
                  Copiar Link Único
                </>
              )}
            </button>

            {/* Copy JSON */}
            <button
              onClick={handleCopyJson}
              className="flex-1 bg-slate-950 hover:bg-slate-850/80 border border-slate-800 text-slate-200 font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copyingJson ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  ¡JSON Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-400" />
                  Copiar Código JSON
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Warning Danger Zone Block */}
      <div className="border border-red-500/20 bg-red-500/5 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-red-400 uppercase tracking-wide">
            Zona de reinicio
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Si deseas comenzar de cero y limpiar todos los goles cargados manualmente en los grupos y etapas de playoffs, puedes presionar el botón de abajo.
          </p>
          <div className="pt-2">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-[11px] py-1.5 px-3 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer animate-fade-in"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reiniciar Todo
              </button>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-red-400 font-bold bg-red-500/5 px-2 py-1 rounded border border-red-500/10">¿Confirmas reiniciar todo la simulación?</span>
                <button
                  onClick={() => {
                    resetSimulation();
                    setShowResetConfirm(false);
                    triggerStatusMessage('La simulación ha sido reiniciada con éxito.', 'info');
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-[11px] py-1.5 px-3 rounded-lg transition-all cursor-pointer"
                >
                  Sí, reiniciar
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] py-1.5 px-3 rounded-lg transition-all cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
