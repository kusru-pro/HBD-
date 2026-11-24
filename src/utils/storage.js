// Storage and persistence layer for dynamic config and user replies
// Supports both localStorage and central server API (/api/replies) for cross-device sync!

import { CONFIG as DEFAULT_CONFIG } from '../config';

const STORAGE_KEYS = {
  CONFIG: 'birthday_app_data_v1',
  REPLIES: 'birthday_app_replies_v1',
  ADMIN_PIN: 'birthday_app_admin_pin',
};

// 1. Config Management
export function getStoredConfig() {
  try {
    let raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) {
      raw = localStorage.getItem('hbd_surprise_config');
      if (raw) {
        localStorage.setItem(STORAGE_KEYS.CONFIG, raw);
      }
    }
    if (!raw) return { ...DEFAULT_CONFIG };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
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

// 2. Replies Inbox Management (Cross-device synced via server API + localStorage fallback)
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

// Fetch latest replies from central server and sync with localStorage
export async function fetchLatestReplies() {
  try {
    const res = await fetch('/api/replies');
    if (res.ok) {
      const serverReplies = await res.json();
      const localReplies = getStoredReplies();

      // Merge unique by id
      const replyMap = new Map();
      serverReplies.forEach(r => replyMap.set(r.id, r));
      localReplies.forEach(r => {
        if (!replyMap.has(r.id)) replyMap.set(r.id, r);
      });

      const merged = Array.from(replyMap.values()).sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      localStorage.setItem(STORAGE_KEYS.REPLIES, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('hbd_replies_updated', { detail: merged }));
      return merged;
    }
  } catch (e) {
    // Server fetch not available (offline or static host), return local
  }
  return getStoredReplies();
}

export async function saveNewReply({ mood, message }) {
  const newEntry = {
    id: `reply_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    mood: mood || '💖',
    message: message.trim(),
    timestamp: new Date().toISOString(),
  };

  try {
    // 1. Immediately store in localStorage
    const currentReplies = getStoredReplies();
    const updated = [newEntry, ...currentReplies];
    localStorage.setItem(STORAGE_KEYS.REPLIES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('hbd_replies_updated', { detail: updated }));

    // 2. Sync to Central Server so ANY device (phone/laptop) sees it in Admin Inbox!
    fetch('/api/replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry)
    }).catch(err => console.log('Server sync pending:', err));

    return newEntry;
  } catch (e) {
    console.error("Failed to save reply:", e);
    return newEntry;
  }
}

export async function deleteStoredReply(id) {
  try {
    const currentReplies = getStoredReplies();
    const updated = currentReplies.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REPLIES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('hbd_replies_updated', { detail: updated }));

    fetch(`/api/replies/${id}`, { method: 'DELETE' }).catch(() => {});
    return true;
  } catch (e) {
    console.error("Failed to delete reply:", e);
    return false;
  }
}

export async function clearAllReplies() {
  try {
    localStorage.removeItem(STORAGE_KEYS.REPLIES);
    window.dispatchEvent(new CustomEvent('hbd_replies_updated', { detail: [] }));

    fetch('/api/replies', { method: 'DELETE' }).catch(() => {});
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
    replies: getStoredReplies(),
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
    if (Array.isArray(parsed.replies)) {
      localStorage.setItem(STORAGE_KEYS.REPLIES, JSON.stringify(parsed.replies));
      window.dispatchEvent(new CustomEvent('hbd_replies_updated', { detail: parsed.replies }));
    }
    return true;
  } catch (e) {
    console.error("Import failed:", e);
    throw e;
  }
}
