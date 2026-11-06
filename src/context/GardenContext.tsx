import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import {
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType
} from '../firebase';
import {
  Plot,
  Plant,
  Task,
  Harvest,
  JournalEntry
} from '../types/garden';
import { MOCK_INITIAL_PLOTS } from '../data/vegetableDatabase';

interface GardenContextType {
  user: User | null;
  authLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isFirebaseConnected: boolean;
  
  // Data
  plots: Plot[];
  plants: Plant[];
  tasks: Task[];
  harvests: Harvest[];
  journal: JournalEntry[];
  loadingData: boolean;

  // Actions
  addPlot: (plot: Omit<Plot, 'id' | 'userId' | 'createdAt'>) => Promise<string>;
  updatePlot: (id: string, updates: Partial<Plot>) => Promise<void>;
  deletePlot: (id: string) => Promise<void>;

  addPlant: (plant: Omit<Plant, 'id' | 'userId' | 'createdAt'>) => Promise<string>;
  updatePlant: (id: string, updates: Partial<Plant>) => Promise<void>;
  deletePlant: (id: string) => Promise<void>;
  waterPlant: (plantId: string) => Promise<void>;

  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => Promise<string>;
  toggleTask: (taskId: string, currentCompleted: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  addHarvest: (harvest: Omit<Harvest, 'id' | 'userId' | 'createdAt'>) => Promise<string>;
  deleteHarvest: (id: string) => Promise<void>;

  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>) => Promise<string>;
  deleteJournalEntry: (id: string) => Promise<void>;

  seedInitialGarden: () => Promise<void>;
}

const GardenContext = createContext<GardenContextType | undefined>(undefined);

// Local fallback storage keys for guest/demo browsing
const LOCAL_STORAGE_KEY = 'mon_jardinier_local_data_v1';

export const GardenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);

  const [plots, setPlots] = useState<Plot[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      setIsFirebaseConnected(true);
    }, (error) => {
      console.warn('Auth state error:', error);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync with Firestore when authenticated, or use local state
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // Load local demo/guest state
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setPlots(parsed.plots || []);
          setPlants(parsed.plants || []);
          setTasks(parsed.tasks || []);
          setHarvests(parsed.harvests || []);
          setJournal(parsed.journal || []);
        } else {
          // Default empty or starter data
          setPlots([]);
          setPlants([]);
          setTasks([]);
          setHarvests([]);
          setJournal([]);
        }
      } catch (e) {
        console.error('Failed to load local guest data', e);
      }
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    const userId = user.uid;

    // Plots listener
    const plotsQuery = query(collection(db, 'plots'), where('userId', '==', userId));
    const unsubPlots = onSnapshot(
      plotsQuery,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => doc.data() as Plot);
        setPlots(items);
        setLoadingData(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'plots');
      }
    );

    // Plants listener
    const plantsQuery = query(collection(db, 'plants'), where('userId', '==', userId));
    const unsubPlants = onSnapshot(
      plantsQuery,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => doc.data() as Plant);
        setPlants(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'plants');
      }
    );

    // Tasks listener
    const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', userId));
    const unsubTasks = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => doc.data() as Task);
        setTasks(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'tasks');
      }
    );

    // Harvests listener
    const harvestsQuery = query(collection(db, 'harvests'), where('userId', '==', userId));
    const unsubHarvests = onSnapshot(
      harvestsQuery,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => doc.data() as Harvest);
        setHarvests(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'harvests');
      }
    );

    // Journal listener
    const journalQuery = query(collection(db, 'journal'), where('userId', '==', userId));
    const unsubJournal = onSnapshot(
      journalQuery,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => doc.data() as JournalEntry);
        setJournal(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'journal');
      }
    );

    return () => {
      unsubPlots();
      unsubPlants();
      unsubTasks();
      unsubHarvests();
      unsubJournal();
    };
  }, [user, authLoading]);

  // Save guest data to local storage when not logged in
  useEffect(() => {
    if (!user && !authLoading) {
      try {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({ plots, plants, tasks, harvests, journal })
        );
      } catch (e) {
        console.warn('Could not cache guest data', e);
      }
    }
  }, [user, authLoading, plots, plants, tasks, harvests, journal]);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Helper ID generator adhering to regex ^[a-zA-Z0-9_\-]+$
  const generateId = (prefix: string) => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`;
  };

  // --- PLOTS ---
  const addPlot = async (plotData: Omit<Plot, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
    const id = generateId('plot');
    const now = new Date().toISOString();
    const currentUserId = user ? user.uid : 'guest';

    const newPlot: Plot = {
      ...plotData,
      id,
      userId: currentUserId,
      createdAt: now,
      updatedAt: now
    };

    if (user) {
      const docPath = `plots/${id}`;
      try {
        await setDoc(doc(db, 'plots', id), newPlot);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      setPlots((prev) => [newPlot, ...prev]);
    }
    return id;
  };

  const updatePlot = async (id: string, updates: Partial<Plot>) => {
    const now = new Date().toISOString();
    const cleanUpdates = { ...updates, updatedAt: now };

    if (user) {
      const docPath = `plots/${id}`;
      try {
        await updateDoc(doc(db, 'plots', id), cleanUpdates);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, docPath);
      }
    } else {
      setPlots((prev) => prev.map((p) => (p.id === id ? { ...p, ...cleanUpdates } : p)));
    }
  };

  const deletePlot = async (id: string) => {
    if (user) {
      const docPath = `plots/${id}`;
      try {
        await deleteDoc(doc(db, 'plots', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, docPath);
      }
    } else {
      setPlots((prev) => prev.filter((p) => p.id !== id));
      setPlants((prev) => prev.filter((p) => p.plotId !== id));
    }
  };

  // --- PLANTS ---
  const addPlant = async (plantData: Omit<Plant, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
    const id = generateId('plant');
    const now = new Date().toISOString();
    const currentUserId = user ? user.uid : 'guest';

    const newPlant: Plant = {
      ...plantData,
      id,
      userId: currentUserId,
      createdAt: now,
      updatedAt: now
    };

    if (user) {
      const docPath = `plants/${id}`;
      try {
        await setDoc(doc(db, 'plants', id), newPlant);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      setPlants((prev) => [newPlant, ...prev]);
    }
    return id;
  };

  const updatePlant = async (id: string, updates: Partial<Plant>) => {
    const now = new Date().toISOString();
    const cleanUpdates = { ...updates, updatedAt: now };

    if (user) {
      const docPath = `plants/${id}`;
      try {
        await updateDoc(doc(db, 'plants', id), cleanUpdates);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, docPath);
      }
    } else {
      setPlants((prev) => prev.map((p) => (p.id === id ? { ...p, ...cleanUpdates } : p)));
    }
  };

  const deletePlant = async (id: string) => {
    if (user) {
      const docPath = `plants/${id}`;
      try {
        await deleteDoc(doc(db, 'plants', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, docPath);
      }
    } else {
      setPlants((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const waterPlant = async (plantId: string) => {
    const today = new Date().toISOString().split('T')[0];
    await updatePlant(plantId, { lastWateredDate: today });
  };

  // --- TASKS ---
  const addTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
    const id = generateId('task');
    const now = new Date().toISOString();
    const currentUserId = user ? user.uid : 'guest';

    const newTask: Task = {
      ...taskData,
      id,
      userId: currentUserId,
      createdAt: now,
      updatedAt: now
    };

    if (user) {
      const docPath = `tasks/${id}`;
      try {
        await setDoc(doc(db, 'tasks', id), newTask);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      setTasks((prev) => [newTask, ...prev]);
    }
    return id;
  };

  const toggleTask = async (taskId: string, currentCompleted: boolean) => {
    const now = new Date().toISOString();
    const updates = {
      completed: !currentCompleted,
      completedAt: !currentCompleted ? now : undefined,
      updatedAt: now
    };

    if (user) {
      const docPath = `tasks/${taskId}`;
      try {
        await updateDoc(doc(db, 'tasks', taskId), updates);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, docPath);
      }
    } else {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
    }
  };

  const deleteTask = async (id: string) => {
    if (user) {
      const docPath = `tasks/${id}`;
      try {
        await deleteDoc(doc(db, 'tasks', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, docPath);
      }
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // --- HARVESTS ---
  const addHarvest = async (harvestData: Omit<Harvest, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
    const id = generateId('harvest');
    const now = new Date().toISOString();
    const currentUserId = user ? user.uid : 'guest';

    const newHarvest: Harvest = {
      ...harvestData,
      id,
      userId: currentUserId,
      createdAt: now,
      updatedAt: now
    };

    if (user) {
      const docPath = `harvests/${id}`;
      try {
        await setDoc(doc(db, 'harvests', id), newHarvest);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      setHarvests((prev) => [newHarvest, ...prev]);
    }
    return id;
  };

  const deleteHarvest = async (id: string) => {
    if (user) {
      const docPath = `harvests/${id}`;
      try {
        await deleteDoc(doc(db, 'harvests', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, docPath);
      }
    } else {
      setHarvests((prev) => prev.filter((h) => h.id !== id));
    }
  };

  // --- JOURNAL ---
  const addJournalEntry = async (entryData: Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
    const id = generateId('journal');
    const now = new Date().toISOString();
    const currentUserId = user ? user.uid : 'guest';

    const newEntry: JournalEntry = {
      ...entryData,
      id,
      userId: currentUserId,
      createdAt: now,
      updatedAt: now
    };

    if (user) {
      const docPath = `journal/${id}`;
      try {
        await setDoc(doc(db, 'journal', id), newEntry);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      setJournal((prev) => [newEntry, ...prev]);
    }
    return id;
  };

  const deleteJournalEntry = async (id: string) => {
    if (user) {
      const docPath = `journal/${id}`;
      try {
        await deleteDoc(doc(db, 'journal', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, docPath);
      }
    } else {
      setJournal((prev) => prev.filter((j) => j.id !== id));
    }
  };

  // Helper to pre-fill a realistic beautiful starter garden
  const seedInitialGarden = async () => {
    // Create 2 starter plots
    for (const plotDef of MOCK_INITIAL_PLOTS.slice(0, 2)) {
      const plotId = await addPlot({
        name: plotDef.name,
        description: plotDef.description,
        sunExposure: plotDef.sunExposure,
        soilType: plotDef.soilType,
        areaM2: plotDef.areaM2,
        color: plotDef.color
      });

      if (plotDef.name.includes('Sud')) {
        await addPlant({
          plotId,
          name: 'Tomates Cœur de Bœuf',
          variety: 'Variété ancienne bio',
          category: 'vegetable',
          status: 'growing',
          plantingDate: '2026-05-10',
          estimatedHarvestDate: '2026-08-15',
          wateringFrequencyDays: 3,
          lastWateredDate: new Date().toISOString().split('T')[0],
          quantity: 6,
          companionGood: 'Basilic, Œillet d’Inde',
          companionBad: 'Fenouil',
          notes: 'Très vigoureuses, tuteurs solides en place.'
        });

        await addPlant({
          plotId,
          name: 'Courgettes Rondes de Nice',
          variety: 'Ronde',
          category: 'vegetable',
          status: 'growing',
          plantingDate: '2026-05-15',
          estimatedHarvestDate: '2026-07-20',
          wateringFrequencyDays: 2,
          lastWateredDate: new Date().toISOString().split('T')[0],
          quantity: 3,
          companionGood: 'Bourrache, Haricot',
          companionBad: 'Pomme de terre',
          notes: 'Fleurs déjà visibles.'
        });
      } else {
        await addPlant({
          plotId,
          name: 'Fraisiers Mara des Bois',
          variety: 'Remontant',
          category: 'fruit',
          status: 'harvesting',
          plantingDate: '2026-04-05',
          estimatedHarvestDate: '2026-06-25',
          wateringFrequencyDays: 2,
          lastWateredDate: new Date().toISOString().split('T')[0],
          quantity: 12,
          companionGood: 'Ail, Épinard',
          companionBad: 'Chou',
          notes: 'Paillage de chanvre au pied, première floraison magnifique.'
        });
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    await addTask({
      title: 'Arroser les tomates et courgettes du carré sud',
      type: 'watering',
      dueDate: todayStr,
      completed: false,
      notes: 'Arroser au pied le matin pour éviter l’évaporation.'
    });

    await addTask({
      title: 'Vérifier la présence d’oïdium sous la serre',
      type: 'pest_control',
      dueDate: todayStr,
      completed: false,
      notes: 'Aérer la serre si la température dépasse 25°C.'
    });

    await addHarvest({
      plantName: 'Fraisiers Mara des Bois',
      plotName: 'Serre & Couche Chaude',
      harvestDate: todayStr,
      quantity: 1.2,
      unit: 'kg',
      quality: 'excellent',
      notes: 'Fraises parfumées et très sucrées !'
    });

    await addJournalEntry({
      date: todayStr,
      title: 'Belle journée ensoleillée au potager',
      content: 'Le potager profite bien du soleil de printemps. Les premiers boutons floraux sont apparus sur les courgettes.',
      weather: 'sunny',
      temperature: 22,
      tags: 'printemps, fleurs, potager'
    });
  };

  return (
    <GardenContext.Provider
      value={{
        user,
        authLoading,
        loginWithGoogle,
        logout,
        isFirebaseConnected,
        plots,
        plants,
        tasks,
        harvests,
        journal,
        loadingData,
        addPlot,
        updatePlot,
        deletePlot,
        addPlant,
        updatePlant,
        deletePlant,
        waterPlant,
        addTask,
        toggleTask,
        deleteTask,
        addHarvest,
        deleteHarvest,
        addJournalEntry,
        deleteJournalEntry,
        seedInitialGarden
      }}
    >
      {children}
    </GardenContext.Provider>
  );
};

export const useGarden = () => {
  const context = useContext(GardenContext);
  if (!context) {
    throw new Error('useGarden must be used within a GardenProvider');
  }
  return context;
};
