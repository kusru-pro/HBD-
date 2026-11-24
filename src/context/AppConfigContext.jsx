import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CONFIG as DEFAULT_CONFIG } from '../config';
import { db } from '../firebase';
import { 
  collection, doc, getDoc, setDoc, deleteDoc, onSnapshot, getDocs 
} from 'firebase/firestore';

const AppConfigContext = createContext(null);

export function AppConfigProvider({ children }) {
  // Config state (defaults to DEFAULT_CONFIG in memory until Firestore loads)
  const [config, setConfig] = useState({ ...DEFAULT_CONFIG });
  const [adminPin, setAdminPin] = useState('0000');
  const [replies, setReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firestoreError, setFirestoreError] = useState(null);

  // 1. On App Load: Fetch config directly from Firestore (`app_data/config`) & set up real-time listener
  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return;
    }

    const configDocRef = doc(db, 'app_data', 'config');

    // Initial direct fetch
    getDoc(configDocRef)
      .then((snap) => {
        if (snap.exists()) {
          const remoteData = snap.data();
          setConfig((prev) => ({ ...prev, ...remoteData }));
          if (remoteData.adminPin) {
            setAdminPin(remoteData.adminPin);
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Firestore initial config fetch error:', err);
        setFirestoreError(err?.message || 'Failed to fetch config from Firestore');
        setIsLoading(false);
      });

    // Real-time live listener for config updates
    const unsubConfig = onSnapshot(
      configDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data();
          setConfig((prev) => ({ ...prev, ...remoteData }));
          if (remoteData.adminPin) {
            setAdminPin(remoteData.adminPin);
          }
        }
      },
      (err) => {
        console.error('Firestore config live sync error:', err);
      }
    );

    // Real-time live listener for replies collection
    const repliesColRef = collection(db, 'replies');
    const unsubReplies = onSnapshot(
      repliesColRef,
      (snapshot) => {
        const list = [];
        snapshot.forEach((d) => list.push(d.data()));
        list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setReplies(list);
      },
      (err) => {
        console.error('Firestore replies live sync error:', err);
      }
    );

    return () => {
      unsubConfig();
      unsubReplies();
    };
  }, []);

  // 2. Write Config directly to Firestore (`app_data/config`)
  const saveConfig = useCallback(
    async (newConfig) => {
      const configDocRef = doc(db, 'app_data', 'config');
      const updated = {
        ...config,
        ...newConfig,
        updatedAt: new Date().toISOString(),
      };

      // Write directly to Firestore using setDoc (will throw error to caller if failed)
      await setDoc(configDocRef, updated);
      setConfig(updated);
      return updated;
    },
    [config]
  );

  // 3. Reset Config to DEFAULT_CONFIG directly in Firestore
  const resetConfig = useCallback(async () => {
    const configDocRef = doc(db, 'app_data', 'config');
    const resetData = {
      ...DEFAULT_CONFIG,
      adminPin: '0000',
      updatedAt: new Date().toISOString(),
    };

    await setDoc(configDocRef, resetData);
    setConfig({ ...DEFAULT_CONFIG });
    setAdminPin('0000');
    return { ...DEFAULT_CONFIG };
  }, []);

  // 4. Save Admin PIN directly to Firestore
  const saveAdminPin = useCallback(async (newPin) => {
    setAdminPin(newPin);
    const configDocRef = doc(db, 'app_data', 'config');
    await setDoc(configDocRef, { adminPin: newPin }, { merge: true });
  }, []);

  // 5. Add Reply: Writes directly to Firestore collection `replies`
  const addReply = useCallback(async ({ message, mood, timestamp }) => {
    const newEntry = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      mood: mood || '💖',
      message: (message || '').trim(),
      timestamp: timestamp || new Date().toISOString(),
    };

    const replyDocRef = doc(db, 'replies', newEntry.id);
    await setDoc(replyDocRef, newEntry);
    return newEntry;
  }, []);

  // 6. Delete Reply directly from Firestore
  const deleteReply = useCallback(async (id) => {
    const replyDocRef = doc(db, 'replies', id);
    await deleteDoc(replyDocRef);
  }, []);

  // 7. Clear All Replies directly from Firestore
  const clearReplies = useCallback(async () => {
    const repliesColRef = collection(db, 'replies');
    const snapshot = await getDocs(repliesColRef);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
    setReplies([]);
  }, []);

  // 8. Refresh replies (re-triggers query if needed)
  const refreshReplies = useCallback(async () => {
    try {
      const repliesColRef = collection(db, 'replies');
      const snapshot = await getDocs(repliesColRef);
      const list = [];
      snapshot.forEach((d) => list.push(d.data()));
      list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setReplies(list);
    } catch (err) {
      console.error('Refresh replies error:', err);
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
    isLoading,
    firestoreError,
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
