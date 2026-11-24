import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CONFIG as DEFAULT_CONFIG } from '../config';
import { db } from '../firebase';
import { 
  collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy 
} from 'firebase/firestore';

export const STORAGE_KEYS = {
  DATA: 'birthday_app_data_v1',
  REPLIES: 'birthday_app_replies_v1',
  ADMIN_PIN: 'birthday_app_admin_pin',
};

const AppConfigContext = createContext(null);

export function AppConfigProvider({ children }) {
  // 1. Initial State Load with seamless migration from any legacy keys
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DATA);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_CONFIG, ...parsed };
      }
      // Check legacy key for migration
      const legacy = localStorage.getItem('hbd_surprise_config');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        const merged = { ...DEFAULT_CONFIG, ...parsed };
        localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(merged));
        return merged;
      }
    } catch (e) {
      console.error('Error loading config from localStorage:', e);
    }
    return { ...DEFAULT_CONFIG };
  });

  const [replies, setReplies] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPLIES);
      if (saved) return JSON.parse(saved);
      const legacy = localStorage.getItem('hbd_surprise_replies');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        localStorage.setItem(STORAGE_KEYS.REPLIES, JSON.stringify(parsed));
        return parsed;
      }
    } catch (e) {
      console.error('Error loading replies from localStorage:', e);
    }
    return [];
  });

  const [adminPin, setAdminPin] = useState(() => {
    try {
      return (
        localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) ||
        localStorage.getItem('hbd_surprise_admin_pin') ||
        '0000'
      );
    } catch (e) {
      return '0000';
    }
  });

  // 2. Real-Time Firebase Cloud Firestore Sync for Replies & Config
  useEffect(() => {
    if (!db) return;

    // A. Real-time Replies Listener from Firebase Firestore
    let unsubReplies = () => {};
    try {
      const repliesCol = collection(db, 'replies');
      unsubReplies = onSnapshot(
        repliesCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const cloudReplies = [];
            snapshot.forEach((d) => cloudReplies.push(d.data()));
            // Sort newest first
            cloudReplies.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setReplies(cloudReplies);
            try {
              localStorage.setItem(STORAGE_KEYS.REPLIES, JSON.stringify(cloudReplies));
            } catch (err) {}
          }
        },
        (err) => {
          // Graceful fallback if Firestore rules or offline
          console.log('Firebase Replies Firestore sync standby:', err.message);
        }
      );
    } catch (err) {
      console.log('Firebase Replies init note:', err);
    }

    // B. Real-time Config Listener from Firebase Firestore
    let unsubConfig = () => {};
    try {
      const configDoc = doc(db, 'app_config', 'main');
      unsubConfig = onSnapshot(
        configDoc,
        (docSnap) => {
          if (docSnap.exists()) {
            const remoteData = docSnap.data();
            setConfig((prev) => ({ ...prev, ...remoteData }));
            try {
              localStorage.setItem(
                STORAGE_KEYS.DATA,
                JSON.stringify({ ...DEFAULT_CONFIG, ...remoteData })
              );
            } catch (err) {}
          }
        },
        (err) => {
          console.log('Firebase Config Firestore sync standby:', err.message);
        }
      );
    } catch (err) {
      console.log('Firebase Config init note:', err);
    }

    return () => {
      unsubReplies();
      unsubConfig();
    };
  }, []);

  // 3. Fallback server API fetch on mount
  const refreshReplies = useCallback(async () => {
    try {
      const res = await fetch('/api/replies');
      if (res.ok) {
        const serverReplies = await res.json();
        setReplies((prev) => {
          const map = new Map();
          serverReplies.forEach((r) => map.set(r.id, r));
          prev.forEach((r) => {
            if (!map.has(r.id)) map.set(r.id, r);
          });
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          localStorage.setItem(STORAGE_KEYS.REPLIES, JSON.stringify(merged));
          return merged;
        });
      }
    } catch (e) {
      // Server not accessible or static host
    }
  }, []);

  useEffect(() => {
    refreshReplies();
  }, [refreshReplies]);

  // 4. Cross-Tab Sync via storage event
  useEffect(() => {
    const handleStorageEvent = (e) => {
      if (e.key === STORAGE_KEYS.DATA && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setConfig((prev) => ({ ...prev, ...parsed }));
        } catch (err) {
          console.error('Failed to parse cross-tab config update:', err);
        }
      } else if (e.key === STORAGE_KEYS.REPLIES && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setReplies(parsed);
        } catch (err) {
          console.error('Failed to parse cross-tab replies update:', err);
        }
      } else if (e.key === STORAGE_KEYS.ADMIN_PIN && e.newValue) {
        setAdminPin(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  // 5. Update and Save Config (LocalStorage + Firebase Firestore)
  const saveConfig = useCallback(
    (newConfig) => {
      const updated = { ...config, ...newConfig };
      setConfig(updated);
      try {
        localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('hbd_config_updated', { detail: updated }));
      } catch (e) {
        console.error('Failed to save config to localStorage:', e);
      }

      // Sync to Firebase Cloud Firestore
      if (db) {
        try {
          setDoc(doc(db, 'app_config', 'main'), updated, { merge: true }).catch((err) => {
            console.log('Firebase config cloud save note:', err.message);
          });
        } catch (err) {}
      }

      return updated;
    },
    [config]
  );

  // 6. Reset Config to DEFAULT_CONFIG
  const resetConfig = useCallback(() => {
    setConfig({ ...DEFAULT_CONFIG });
    try {
      localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(DEFAULT_CONFIG));
      window.dispatchEvent(new CustomEvent('hbd_config_updated', { detail: DEFAULT_CONFIG }));
    } catch (e) {
      console.error('Failed to reset config in localStorage:', e);
    }

    if (db) {
      try {
        setDoc(doc(db, 'app_config', 'main'), DEFAULT_CONFIG).catch(() => {});
      } catch (e) {}
    }

    return { ...DEFAULT_CONFIG };
  }, []);

  // 7. Add Reply (State + LocalStorage + Firebase Firestore + Server API)
  const addReply = useCallback(async ({ message, mood, timestamp }) => {
    const newEntry = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      mood: mood || '💖',
      message: (message || '').trim(),
      timestamp: timestamp || new Date().toISOString(),
    };

    setReplies((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.REPLIES, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('hbd_replies_updated', { detail: updated }));
      } catch (e) {
        console.error('Failed to save reply to localStorage:', e);
      }
      return updated;
    });

    // A. Sync to Firebase Firestore
    if (db) {
      try {
        setDoc(doc(db, 'replies', newEntry.id), newEntry).catch((err) => {
          console.log('Firebase Firestore save note:', err.message);
        });
      } catch (err) {}
    }

    // B. Background local server sync
    try {
      fetch('/api/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      }).catch((err) => console.log('Server reply sync pending:', err));
    } catch (e) {}

    return newEntry;
  }, []);

  // 8. Delete Reply
  const deleteReply = useCallback(async (id) => {
    setReplies((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.REPLIES, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('hbd_replies_updated', { detail: updated }));
      } catch (e) {
        console.error('Failed to delete reply in localStorage:', e);
      }
      return updated;
    });

    // Delete in Firebase
    if (db) {
      try {
        deleteDoc(doc(db, 'replies', id)).catch(() => {});
      } catch (e) {}
    }

    // Delete in local server
    try {
      fetch(`/api/replies/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
  }, []);

  // 9. Clear All Replies
  const clearReplies = useCallback(async () => {
    setReplies([]);
    try {
      localStorage.setItem(STORAGE_KEYS.REPLIES, JSON.stringify([]));
      window.dispatchEvent(new CustomEvent('hbd_replies_updated', { detail: [] }));
    } catch (e) {
      console.error('Failed to clear replies in localStorage:', e);
    }

    try {
      fetch('/api/replies', { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
  }, []);

  // 10. Save Admin PIN
  const saveAdminPin = useCallback((newPin) => {
    setAdminPin(newPin);
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPin);
    } catch (e) {
      console.error('Failed to save admin PIN:', e);
    }
  }, []);

  const value = {
    config,
    saveConfig,
    updateConfig: saveConfig,
    resetConfig,
    replies,
    addReply,
    deleteReply,
    clearReplies,
    refreshReplies,
    adminPin,
    saveAdminPin,
    STORAGE_KEYS,
  };

  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfig() {
  const ctx = useContext(AppConfigContext);
  if (!ctx) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }
  return ctx;
}
