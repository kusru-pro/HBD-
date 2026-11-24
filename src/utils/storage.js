// Storage and persistence layer for dynamic config and user replies
// Easy to connect to Firebase Firestore or Supabase in the future

import { CONFIG as DEFAULT_CONFIG } from '../config';

const STORAGE_KEYS = {
  CONFIG: 'hbd_surprise_config',
  REPLIES: 'hbd_surprise_replies',
  ADMIN_PIN: 'hbd_surprise_admin_pin',
};

// 1. Config Management
export function getStoredConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) return { ...DEFAULT_CONFIG };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      // Ensure arrays merge cleanly
      hiddenMessageWords: parsed.hiddenMessageWords || DEFAULT_CONFIG.hiddenMessageWords,
      complimentsList: parsed.complimentsList || DEFAULT_CONFIG.complimentsList,
    };
  } catch (e) {
    console.error("Failed to parse stored config:", e);
    return { ...DEFAULT_CONFIG };
  }
}

export function saveStoredConfig(newConfig) {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(newConfig));
    // Dispatch a storage event or custom event for reactive updates
    window.dispatchEvent(new CustomEvent('hbd_config_updated', { detail: newConfig }));
    return true;
  } catch (e) {
    console.error("Failed to save config:", e);
    return false;
  }
}

export function resetStoredConfig() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    window.dispatchEvent(new CustomEvent('hbd_config_updated', { detail: DEFAULT_CONFIG }));
    return { ...DEFAULT_CONFIG };
  } catch (e) {
    console.error("Failed to reset config:", e);
    return { ...DEFAULT_CONFIG };
  }
}

// 2. Replies Inbox Management
export function getStoredReplies() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPLIES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse replies:", e);
    return [];
  }
}

export function saveNewReply({ mood, message }) {
  try {
    const currentReplies = getStoredReplies();
    const newEntry = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      mood: mood || '💖',
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...currentReplies];
    localStorage.setItem(STORAGE_KEYS.REPLIES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('hbd_replies_updated', { detail: updated }));
    return newEntry;
  } catch (e) {
    console.error("Failed to save reply:", e);
    return null;
  }
}

export function deleteStoredReply(id) {
  try {
    const currentReplies = getStoredReplies();
    const updated = currentReplies.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REPLIES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('hbd_replies_updated', { detail: updated }));
    return true;
  } catch (e) {
    console.error("Failed to delete reply:", e);
    return false;
  }
}

export function clearAllReplies() {
  try {
    localStorage.removeItem(STORAGE_KEYS.REPLIES);
    window.dispatchEvent(new CustomEvent('hbd_replies_updated', { detail: [] }));
    return true;
  } catch (e) {
    console.error("Failed to clear replies:", e);
    return false;
  }
}

// 3. Admin PIN Management (Default is "0000")
export function getAdminPin() {
  try {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || '0000';
  } catch (e) {
    return '0000';
  }
}

export function saveAdminPin(newPin) {
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPin.trim());
    return true;
  } catch (e) {
    return false;
  }
}

// 4. JSON Export / Import
export function exportConfigAsJSON() {
  const data = {
    config: getStoredConfig(),
    adminPin: getAdminPin(),
    exportedAt: new Date().toISOString(),
    version: "1.0"
  };
  return JSON.stringify(data, null, 2);
}

export function importConfigFromJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.config) {
      throw new Error("Invalid configuration file format.");
    }
    saveStoredConfig(parsed.config);
    if (parsed.adminPin) {
      saveAdminPin(parsed.adminPin);
    }
    return true;
  } catch (e) {
    console.error("Import failed:", e);
    throw e;
  }
}
