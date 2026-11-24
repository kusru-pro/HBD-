// DEPRECATED: This app relies 100% on Firebase Cloud Firestore (see src/context/AppConfigContext.jsx).
// All localStorage reading and writing has been eliminated.

import { CONFIG as DEFAULT_CONFIG } from '../config';

export function getStoredConfig() {
  return { ...DEFAULT_CONFIG };
}

export function saveStoredConfig() {
  console.warn("saveStoredConfig is deprecated. AppConfigContext writes directly to Firebase Firestore.");
  return true;
}

export function resetStoredConfig() {
  console.warn("resetStoredConfig is deprecated. AppConfigContext resets directly in Firebase Firestore.");
  return true;
}

export function getStoredReplies() {
  return [];
}

export function syncRepliesFromServer() {
  return Promise.resolve([]);
}

export function saveStoredReply() {
  console.warn("saveStoredReply is deprecated. AppConfigContext writes directly to Firebase Firestore.");
  return null;
}

export function deleteStoredReply() {
  return true;
}

export function clearStoredReplies() {
  return true;
}

export function getAdminPin() {
  return '0000';
}

export function saveAdminPin() {
  return true;
}

export function exportConfigAsJSON() {
  return JSON.stringify({ config: DEFAULT_CONFIG }, null, 2);
}

export function importConfigFromJSON() {
  return true;
}
