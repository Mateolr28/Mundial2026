/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Team } from '../types';

export const TEAMS: Team[] = [
  // Grupo A
  { id: 'MEX', name: 'México', group: 'A', fifaRanking: 15, flag: '🇲🇽' },
  { id: 'RSA', name: 'Sudáfrica', group: 'A', fifaRanking: 59, flag: '🇿🇦' },
  { id: 'KOR', name: 'Corea del Sur', group: 'A', fifaRanking: 22, flag: '🇰🇷' },
  { id: 'CZE', name: 'República Checa', group: 'A', fifaRanking: 35, flag: '🇨🇿' },

  // Grupo B
  { id: 'CAN', name: 'Canadá', group: 'B', fifaRanking: 49, flag: '🇨🇦' },
  { id: 'BIH', name: 'Bosnia y Herzegovina', group: 'B', fifaRanking: 74, flag: '🇧🇦' },
  { id: 'QAT', name: 'Catar', group: 'B', fifaRanking: 34, flag: '🇶🇦' },
  { id: 'SUI', name: 'Suiza', group: 'B', fifaRanking: 19, flag: '🇨🇭' },

  // Grupo C
  { id: 'BRA', name: 'Brasil', group: 'C', fifaRanking: 5, flag: '🇧🇷' },
  { id: 'MAR', name: 'Marruecos', group: 'C', fifaRanking: 12, flag: '🇲🇦' },
  { id: 'HAI', name: 'Haití', group: 'C', fifaRanking: 86, flag: '🇭🇹' },
  { id: 'SCO', name: 'Escocia', group: 'C', fifaRanking: 39, flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },

  // Grupo D
  { id: 'USA', name: 'Estados Unidos', group: 'D', fifaRanking: 14, flag: '🇺🇸' },
  { id: 'PAR', name: 'Paraguay', group: 'D', fifaRanking: 56, flag: '🇵🇾' },
  { id: 'AUS', name: 'Australia', group: 'D', fifaRanking: 23, flag: '🇦🇺' },
  { id: 'TUR', name: 'Turquía', group: 'D', fifaRanking: 27, flag: '🇹🇷' },

  // Grupo E
  { id: 'GER', name: 'Alemania', group: 'E', fifaRanking: 16, flag: '🇩🇪' },
  { id: 'CUW', name: 'Curazao', group: 'E', fifaRanking: 90, flag: '🇨🇼' },
  { id: 'CIV', name: 'Costa de Marfil', group: 'E', fifaRanking: 39, flag: '🇨🇮' },
  { id: 'ECU', name: 'Ecuador', group: 'E', fifaRanking: 31, flag: '🇪🇨' },

  // Grupo F
  { id: 'NED', name: 'Países Bajos', group: 'F', fifaRanking: 7, flag: '🇳🇱' },
  { id: 'SUE', name: 'Suecia', group: 'F', fifaRanking: 26, flag: '🇸🇪' },
  { id: 'TUN', name: 'Túnez', group: 'F', fifaRanking: 41, flag: '🇹🇳' },
  { id: 'JPN', name: 'Japón', group: 'F', fifaRanking: 18, flag: '🇯🇵' },

  // Grupo G
  { id: 'BEL', name: 'Bélgica', group: 'G', fifaRanking: 4, flag: '🇧🇪' },
  { id: 'EGY', name: 'Egipto', group: 'G', fifaRanking: 36, flag: '🇪🇬' },
  { id: 'IRN', name: 'Irán', group: 'G', fifaRanking: 20, flag: '🇮🇷' },
  { id: 'NZL', name: 'Nueva Zelanda', group: 'G', fifaRanking: 85, flag: '🇳🇿' },

  // Grupo H
  { id: 'ESP', name: 'España', group: 'H', fifaRanking: 8, flag: '🇪🇸' },
  { id: 'CPV', name: 'Cabo Verde', group: 'H', fifaRanking: 65, flag: '🇨🇻' },
  { id: 'KSA', name: 'Arabia Saudita', group: 'H', fifaRanking: 56, flag: '🇸🇦' },
  { id: 'URU', name: 'Uruguay', group: 'H', fifaRanking: 16, flag: '🇺🇾' },

  // Grupo I
  { id: 'FRA', name: 'Francia', group: 'I', fifaRanking: 2, flag: '🇫🇷' },
  { id: 'IRQ', name: 'Irak', group: 'I', fifaRanking: 58, flag: '🇮🇶' },
  { id: 'NOR', name: 'Noruega', group: 'I', fifaRanking: 47, flag: '🇳🇴' },
  { id: 'SEN', name: 'Senegal', group: 'I', fifaRanking: 17, flag: '🇸🇳' },

  // Grupo J
  { id: 'ARG', name: 'Argentina', group: 'J', fifaRanking: 1, flag: '🇦🇷' },
  { id: 'AUT', name: 'Austria', group: 'J', fifaRanking: 25, flag: '🇦🇹' },
  { id: 'JOR', name: 'Jordania', group: 'J', fifaRanking: 71, flag: '🇯🇴' },
  { id: 'ALG', name: 'Argelia', group: 'J', fifaRanking: 43, flag: '🇩🇿' },

  // Grupo K
  { id: 'POR', name: 'Portugal', group: 'K', fifaRanking: 6, flag: '🇵🇹' },
  { id: 'UZB', name: 'Uzbekistán', group: 'K', fifaRanking: 64, flag: '🇺🇿' },
  { id: 'COL', name: 'Colombia', group: 'K', fifaRanking: 11, flag: '🇨🇴' },
  { id: 'COD', name: 'Congo RD', group: 'K', fifaRanking: 62, flag: '🇨🇩' },

  // Grupo L
  { id: 'ENG', name: 'Inglaterra', group: 'L', fifaRanking: 3, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'GHA', name: 'Ghana', group: 'L', fifaRanking: 60, flag: '🇬🇭' },
  { id: 'PAN', name: 'Panamá', group: 'L', fifaRanking: 44, flag: '🇵🇦' },
  { id: 'CRO', name: 'Croacia', group: 'L', fifaRanking: 10, flag: '🇭🇷' },
];

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
