// Comprehensive IAAP Bodies of Knowledge Learning Modules Registry
// Modularized by certification track under ./academy/

import { ACADEMY_TRACKS } from './academy/tracks.js';
import { CPACC_MODULES } from './academy/cpaccModules.js';
import { WAS_MODULES } from './academy/wasModules.js';
import { ADS_MODULES } from './academy/adsModules.js';

export { ACADEMY_TRACKS, CPACC_MODULES, WAS_MODULES, ADS_MODULES };

export const LEARNING_MODULES = [
  ...CPACC_MODULES,
  ...WAS_MODULES,
  ...ADS_MODULES
];

export function getModulesByTrack(track = 'all') {
  if (!track || track === 'all') return LEARNING_MODULES;
  return LEARNING_MODULES.filter(m => m.cert.toLowerCase() === track.toLowerCase());
}

export function getModuleById(id) {
  return LEARNING_MODULES.find(m => m.id === id) || null;
}
