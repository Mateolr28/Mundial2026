/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from 'xlsx';
import { GroupMatch, KnockoutMatch, GroupStanding, Team } from '../types';
import { TEAMS } from '../data/teams';

interface ExportData {
  groupMatches: GroupMatch[];
  knockoutMatches: KnockoutMatch[];
  groupStandings: { [group: string]: GroupStanding[] };
  thirdPlaceStandings: GroupStanding[];
  champion: Team | null;
  runnerUp: Team | null;
  thirdPlace: Team | null;
}

export function exportSimulationToExcel(data: ExportData) {
  const wb = XLSX.utils.book_new();

  // ----- 1. SHEETS: GRUPOS -----
  const groupsRows: any[] = [];
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  
  groups.forEach((g) => {
    groupsRows.push([`GRUPO ${g}`]);
    groupsRows.push(['Pos', 'Equipo', 'ID', 'PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DG', 'PTS']);
    
    const standings = data.groupStandings[g] || [];
    standings.forEach((s, idx) => {
      const team = TEAMS.find((t) => t.id === s.teamId);
      groupsRows.push([
        idx + 1,
        team ? `${team.flag} ${team.name}` : s.teamId,
        s.teamId,
        s.played,
        s.won,
        s.drawn,
        s.lost,
        s.gf,
        s.gc,
        s.gd,
        s.points,
      ]);
    });
    groupsRows.push([]); // empty margin row
  });

  const wsGrupos = XLSX.utils.aoa_to_sheet(groupsRows);
  XLSX.utils.book_append_sheet(wb, wsGrupos, 'Grupos');

  // ----- 2. SHEETS: PARTIDOS (Todos los Resultados) -----
  const matchesRows: any[] = [['FASE DE GRUPOS']];
  matchesRows.push(['ID Partido', 'Grupo', 'Equipo Local', 'Goles Local', 'VS', 'Goles Visitante', 'Equipo Visitante', 'Estado']);
  
  data.groupMatches.forEach((m) => {
    const homeTeam = TEAMS.find((t) => t.id === m.homeTeamId);
    const awayTeam = TEAMS.find((t) => t.id === m.awayTeamId);
    matchesRows.push([
      m.id,
      m.group,
      homeTeam ? `${homeTeam.flag} ${homeTeam.name}` : m.homeTeamId,
      m.homeGoals ?? '-',
      'x',
      m.awayGoals ?? '-',
      awayTeam ? `${awayTeam.flag} ${awayTeam.name}` : m.awayTeamId,
      m.played ? 'Jugado' : 'Pendiente',
    ]);
  });

  matchesRows.push([]);
  matchesRows.push(['FASE DE ELIMINATORIAS']);
  matchesRows.push(['ID Partido', 'Etapa', 'Equipo Local', 'Goles Local', 'Penales Local', 'VS', 'Penales Visitante', 'Goles Visitante', 'Equipo Visitante', 'Ganador', 'Estado']);

  data.knockoutMatches.forEach((m) => {
    const homeTeam = TEAMS.find((t) => t.id === m.homeTeamId);
    const awayTeam = TEAMS.find((t) => t.id === m.awayTeamId);
    const winnerTeam = TEAMS.find((t) => t.id === m.winnerId);
    matchesRows.push([
      m.id,
      m.stage,
      homeTeam ? `${homeTeam.flag} ${homeTeam.name}` : (m.homeTeamId || 'Por determinar'),
      m.homeGoals ?? '-',
      m.homePenalties ?? '-',
      'x',
      m.awayPenalties ?? '-',
      m.awayGoals ?? '-',
      awayTeam ? `${awayTeam.flag} ${awayTeam.name}` : (m.awayTeamId || 'Por determinar'),
      winnerTeam ? `${winnerTeam.flag} ${winnerTeam.name}` : '-',
      m.played ? 'Jugado' : 'Pendiente',
    ]);
  });

  const wsPartidos = XLSX.utils.aoa_to_sheet(matchesRows);
  XLSX.utils.book_append_sheet(wb, wsPartidos, 'Partidos');

  // ----- 3. SHEETS: CLASIFICADOS -----
  const clasificadosRows: any[] = [['CLASIFICACIÓN DE GRUPOS']];
  clasificadosRows.push(['Grupo', 'Puesto', 'Equipo', 'ID', 'Puntos', 'DG']);
  
  groups.forEach((g) => {
    const s = data.groupStandings[g] || [];
    for (let idx = 0; idx < Math.min(2, s.length); idx++) {
      const team = TEAMS.find((t) => t.id === s[idx].teamId);
      clasificadosRows.push([
        g,
        idx === 0 ? '1º - Campeón de Grupo' : '2º - Subcampeón',
        team ? `${team.flag} ${team.name}` : s[idx].teamId,
        s[idx].teamId,
        s[idx].points,
        s[idx].gd,
      ]);
    }
  });

  clasificadosRows.push([]);
  clasificadosRows.push(['RANKING DE MEJORES TERCEROS']);
  clasificadosRows.push(['Posición', 'Grupo', 'Equipo', 'ID', 'Puntos', 'DG', 'GF', 'Acceso a R32']);
  
  data.thirdPlaceStandings.forEach((s, idx) => {
    const team = TEAMS.find((t) => t.id === s.teamId);
    const qualified = idx < 8;
    clasificadosRows.push([
      idx + 1,
      team ? team.group : '?',
      team ? `${team.flag} ${team.name}` : s.teamId,
      s.teamId,
      s.points,
      s.gd,
      s.gf,
      qualified ? 'CLASIFICADO' : 'ELIMINADO',
    ]);
  });

  const wsClasificados = XLSX.utils.aoa_to_sheet(clasificadosRows);
  XLSX.utils.book_append_sheet(wb, wsClasificados, 'Clasificados');

  // ----- 4. SHEETS: ELIMINATORIAS (Cruces detallados) -----
  const elRows: any[] = [['CRUCES DE ELIMINATORIA DIRECTA']];
  
  const stages = ['R32', 'R16', 'QF', 'SF', 'T3RD', 'FINAL'];
  stages.forEach((stg) => {
    elRows.push([]);
    elRows.push([`ETAPA: ${stg === 'R32' ? 'Dieciseisavos (Round of 32)' : stg === 'R16' ? 'Octavos de Final' : stg === 'QF' ? 'Cuartos de Final' : stg === 'SF' ? 'Semifinales' : stg === 'T3RD' ? 'Tercer Puesto' : 'Gran Final'}`]);
    elRows.push(['ID', 'Local', 'Goles L', 'Penales L', 'VS', 'Penales V', 'Goles V', 'Visitante', 'Ganador']);
    
    const stageMatches = data.knockoutMatches.filter((m) => m.stage === stg);
    stageMatches.forEach((m) => {
      const homeTeam = TEAMS.find((t) => t.id === m.homeTeamId);
      const awayTeam = TEAMS.find((t) => t.id === m.awayTeamId);
      const winnerTeam = TEAMS.find((t) => t.id === m.winnerId);
      elRows.push([
        m.id,
        homeTeam ? `${homeTeam.flag} ${homeTeam.name}` : 'Por determinar',
        m.homeGoals ?? '-',
        m.homePenalties ?? '-',
        'x',
        m.awayPenalties ?? '-',
        m.awayGoals ?? '-',
        awayTeam ? `${awayTeam.flag} ${awayTeam.name}` : 'Por determinar',
        winnerTeam ? `${winnerTeam.flag} ${winnerTeam.name}` : '-',
      ]);
    });
  });

  const wsEliminatorias = XLSX.utils.aoa_to_sheet(elRows);
  XLSX.utils.book_append_sheet(wb, wsEliminatorias, 'Eliminatorias');

  // ----- 5. SHEETS: CAMPEÓN -----
  const champRows: any[] = [
    ['CUADRO DE HONOR DEL MUNDIAL FIFA 2026'],
    [],
    ['Puesto', 'Selección', 'ID', 'Ranking FIFA'],
  ];

  if (data.champion) {
    champRows.push(['CAMPEÓN 🏆', `${data.champion.flag} ${data.champion.name}`, data.champion.id, data.champion.fifaRanking]);
  } else {
    champRows.push(['CAMPEÓN 🏆', 'Por jugar', '-', '-']);
  }

  if (data.runnerUp) {
    champRows.push(['Subcampeón 🥈', `${data.runnerUp.flag} ${data.runnerUp.name}`, data.runnerUp.id, data.runnerUp.fifaRanking]);
  } else {
    champRows.push(['Subcampeón 🥈', 'Por jugar', '-', '-']);
  }

  if (data.thirdPlace) {
    champRows.push(['Tercer Puesto 🥉', `${data.thirdPlace.flag} ${data.thirdPlace.name}`, data.thirdPlace.id, data.thirdPlace.fifaRanking]);
  } else {
    champRows.push(['Tercer Puesto 🥉', 'Por jugar', '-', '-']);
  }

  const wsCampeon = XLSX.utils.aoa_to_sheet(champRows);
  XLSX.utils.book_append_sheet(wb, wsCampeon, 'Podio');

  XLSX.writeFile(wb, 'Mundial2026_Simulacion.xlsx');
}

// Read an import file and retrieve group/knockout matches structured
export function importSimulationFromExcel(
  file: File,
  onParsed: (result: { groupMatches: GroupMatch[]; knockoutMatches: KnockoutMatch[] } | null) => void,
  onError?: (msg: string) => void
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      // Parse the 'Partidos' sheet representing matches
      const sheetPartidos = workbook.Sheets['Partidos'];
      if (!sheetPartidos) {
        throw new Error("No se encontró la pestaña 'Partidos' obligatoria en el Excel.");
      }

      const rows: any[][] = XLSX.utils.sheet_to_json(sheetPartidos, { header: 1 });
      
      const importedGroupMatches: GroupMatch[] = [];
      const importedKnockoutMatches: KnockoutMatch[] = [];

      let readingGroups = false;
      let readingElims = false;

      rows.forEach((row) => {
        if (!row || row.length === 0) return;

        const firstCell = String(row[0]).trim();
        if (firstCell === 'FASE DE GRUPOS') {
          readingGroups = true;
          readingElims = false;
          return;
        }
        if (firstCell === 'FASE DE ELIMINATORIAS') {
          readingGroups = false;
          readingElims = true;
          return;
        }

        if (firstCell === 'ID Partido' || firstCell === 'ID') return; // header bypass

        if (readingGroups) {
          const id = String(row[0]).trim();
          if (id.startsWith('match-')) {
            const group = String(row[1]).trim();
            // Determine home goals, away goals
            const homeG = row[3] !== undefined && row[3] !== '-' && row[3] !== '' ? Number(row[3]) : null;
            const awayG = row[5] !== undefined && row[5] !== '-' && row[5] !== '' ? Number(row[5]) : null;
            const played = homeG !== null && awayG !== null;
            
            // Reconstruct team IDs from names or use directly if row cells exist
            const homeStr = String(row[2]).trim();
            const awayStr = String(row[6]).trim();
            
            const homeTeamId = TEAMS.find(t => homeStr.includes(t.name) || homeStr.includes(t.id))?.id || homeStr;
            const awayTeamId = TEAMS.find(t => awayStr.includes(t.name) || awayStr.includes(t.id))?.id || awayStr;

            importedGroupMatches.push({
              id,
              group,
              homeTeamId,
              awayTeamId,
              homeGoals: homeG,
              awayGoals: awayG,
              played,
            });
          }
        }

        if (readingElims) {
          const id = String(row[0]).trim();
          if (id.startsWith('match-')) {
            const stage = String(row[1]).trim() as any;
            
            const homeStr = String(row[2]).trim();
            const awayStr = String(row[8]).trim();
            
            const homeTeamId = TEAMS.find(t => homeStr.includes(t.name) || homeStr.includes(t.id))?.id || (homeStr === '-' || homeStr === 'Por determinar' ? null : homeStr);
            const awayTeamId = TEAMS.find(t => awayStr.includes(t.name) || awayStr.includes(t.id))?.id || (awayStr === '-' || awayStr === 'Por determinar' ? null : awayStr);

            const homeG = row[3] !== undefined && row[3] !== '-' && row[3] !== '' ? Number(row[3]) : null;
            const homeP = row[4] !== undefined && row[4] !== '-' && row[4] !== '' ? Number(row[4]) : null;
            const awayP = row[6] !== undefined && row[6] !== '-' && row[6] !== '' ? Number(row[6]) : null;
            const awayG = row[7] !== undefined && row[7] !== '-' && row[7] !== '' ? Number(row[7]) : null;
            
            const played = homeG !== null && awayG !== null;
            let winnerId = null;

            if (played && homeG !== null && awayG !== null) {
              if (homeG > awayG) {
                winnerId = homeTeamId;
              } else if (awayG > homeG) {
                winnerId = awayTeamId;
              } else if (homeP !== null && awayP !== null) {
                winnerId = homeP > awayP ? homeTeamId : awayTeamId;
              }
            }

            importedKnockoutMatches.push({
              id,
              stage,
              homeTeamId,
              awayTeamId,
              homeGoals: homeG,
              homePenalties: homeP,
              awayPenalties: awayP,
              awayGoals: awayG,
              winnerId,
              played,
              label: id.includes('r32') ? `Dieciseisavo ${id.split('-').pop()}` :
                     id.includes('r16') ? `Octavo ${id.split('-').pop()}` :
                     id.includes('qf') ? `Cuarto ${id.split('-').pop()}` :
                     id.includes('sf') ? `Semifinal ${id.split('-').pop()}` :
                     id === 'match-t3rd' ? 'Tercer Puesto' : 'Gran Final',
            });
          }
        }
      });

      if (importedGroupMatches.length === 0) {
        throw new Error('No se cargaron resultados válidos. Verifica el formato del archivo.');
      }

      onParsed({
        groupMatches: importedGroupMatches,
        knockoutMatches: importedKnockoutMatches,
      });

    } catch (err: any) {
      console.error(err);
      if (onError) {
        onError(err.message || 'Formato inválido.');
      } else {
        console.error(`Error al importar Excel: ${err.message || 'Formato inválido.'}`);
      }
      onParsed(null);
    }
  };

  reader.onerror = () => {
    if (onError) {
      onError('Error de lectura de archivo.');
    } else {
      console.error('Error de lectura de archivo.');
    }
    onParsed(null);
  };

  reader.readAsArrayBuffer(file);
}
