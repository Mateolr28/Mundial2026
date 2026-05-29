/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SimulatorProvider, useSimulator } from './store/SimulatorContext';
import { Dashboard } from './components/Dashboard';
import { GroupStage } from './components/GroupStage';
import { ThirdPlaces } from './components/ThirdPlaces';
import { BracketView } from './components/BracketView';
import { StatsView } from './components/StatsView';
import {
  Trophy,
  LayoutDashboard,
  Shield,
  Award,
  Calendar,
  Grid3X3,
  BarChart,
  Github,
  Globe,
  Globe2,
} from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'GROUPS' | 'THIRDS' | 'BRACKET' | 'STATS'>('DASHBOARD');
  const { groupMatches, knockoutMatches, loadSimulation, teams } = useSimulator();
  const [sharedBanner, setSharedBanner] = useState(false);

  // Parse shared URL on boot
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const simParam = params.get('sim');
    if (simParam) {
      try {
        const decoded = JSON.parse(atob(decodeURIComponent(simParam)));
        if (decoded && (decoded.gm || decoded.ko)) {
          // Reconstruct matching schema
          const mappedGroupMatches = groupMatches.map((m) => {
            const found = decoded.gm.find((x: any) => x.id === m.id);
            if (found) {
              return {
                ...m,
                homeGoals: found.hg,
                awayGoals: found.ag,
                played: found.p,
              };
            }
            return m;
          });

          const mappedKnockoutMatches = knockoutMatches.map((m) => {
            const found = decoded.ko.find((x: any) => x.id === m.id);
            if (found) {
              return {
                ...m,
                homeGoals: found.hg,
                awayGoals: found.ag,
                homePenalties: found.hp,
                awayPenalties: found.ap,
                played: found.p,
                winnerId: found.w,
              };
            }
            return m;
          });

          // Create standard fields
          const fairPlayScores: { [teamId: string]: number } = {};
          const randomSeeds: { [teamId: string]: number } = {};
          teams.forEach((t) => {
            fairPlayScores[t.id] = 100 - Math.floor(Math.random() * 8);
            randomSeeds[t.id] = Math.random();
          });

          const loaded = loadSimulation({
            groupMatches: mappedGroupMatches,
            knockoutMatches: mappedKnockoutMatches,
            fairPlayScores,
            randomSeeds,
            manualGoldenBoot: '',
          });

          if (loaded) {
            setSharedBanner(true);
            // Clean browser URL query params without reloading
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        }
      } catch (e) {
        console.error('Failed to parse URL simulation query string', e);
      }
    }
  }, [groupMatches, knockoutMatches, loadSimulation, teams]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white antialiased">
      
      {/* Top Banner for Shared URL Load Success */}
      {sharedBanner && (
        <div className="bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold p-3 text-center text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg">
          <Globe2 className="w-5 h-5 animate-bounce" />
          <span>¡Simulación importada con éxito desde el enlace compartido! Disfruta de la predicción.</span>
          <button
            onClick={() => setSharedBanner(false)}
            className="ml-4 bg-black/20 hover:bg-black/40 text-white font-black px-2 py-0.5 rounded cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Primary Header/Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-slate-950 shadow-xl font-black">
              <Trophy className="w-4 h-4 text-slate-950 fill-current" />
            </span>
            <div>
              <span className="font-extrabold uppercase text-[10px] tracking-wider text-indigo-400 block -mb-0.5">SIMULADOR</span>
              <span className="font-black text-sm tracking-tight text-white flex items-center gap-1.5">
                MUNDIAL FIFA 2026
                <span className="bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-[9px] font-black tracking-widest uppercase py-0.5 px-1.5 rounded-md">
                  USA • MEX • CAN
                </span>
              </span>
            </div>
          </div>

          {/* Social icons or generic labels */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-bold bg-slate-900 px-3 py-1.5 border border-slate-800 rounded-full">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Fórmula Oficial de 48 Selecciones</span>
          </div>
        </div>
      </header>

      {/* Responsive Tab Selector Navigation */}
      <nav className="border-b border-slate-900 bg-slate-950/40 sticky top-16 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
            
            {/* Nav: Dashboard */}
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'DASHBOARD'
                  ? 'bg-slate-900 border border-slate-800 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Info & Control
            </button>

            {/* Nav: Groups */}
            <button
              onClick={() => setActiveTab('GROUPS')}
              className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'GROUPS'
                  ? 'bg-slate-900 border border-slate-800 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              Grupos (A-L)
            </button>

            {/* Nav: Third places */}
            <button
              onClick={() => setActiveTab('THIRDS')}
              className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'THIRDS'
                  ? 'bg-slate-900 border border-slate-800 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4" />
              Ranking 3°
            </button>

            {/* Nav: Bracket */}
            <button
              onClick={() => setActiveTab('BRACKET')}
              className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'BRACKET'
                  ? 'bg-slate-900 border border-slate-800 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              Eliminatorias
            </button>

            {/* Nav: Stats */}
            <button
              onClick={() => setActiveTab('STATS')}
              className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'STATS'
                  ? 'bg-slate-900 border border-slate-800 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart className="w-4 h-4" />
              Récords Podio
            </button>

          </div>
        </div>
      </nav>

      {/* Main Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'DASHBOARD' && <Dashboard />}
        {activeTab === 'GROUPS' && <GroupStage />}
        {activeTab === 'THIRDS' && <ThirdPlaces />}
        {activeTab === 'BRACKET' && <BracketView />}
        {activeTab === 'STATS' && <StatsView />}
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="font-semibold text-slate-400">
            Simulador de la Copa Mundial de la FIFA 2026™ — Elaborado con fines de entretenimiento y predicciones deportivas.
          </p>
          <p>
            Mundial 2026 oficial con 48 selecciones clasificadas y formato completo de 104 partidos.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <SimulatorProvider>
      <AppContent />
    </SimulatorProvider>
  );
}
