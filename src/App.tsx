import React, { useState } from 'react';
import { GardenProvider, useGarden } from './context/GardenContext';
import { Header, ActiveTab } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PlotsView } from './components/PlotsView';
import { PlantsView } from './components/PlantsView';
import { TasksView } from './components/TasksView';
import { HarvestsView } from './components/HarvestsView';
import { JournalView } from './components/JournalView';
import { VercelDeployModal } from './components/VercelDeployModal';
import { AddPlotModal } from './components/modals/AddPlotModal';
import { AddPlantModal } from './components/modals/AddPlantModal';
import { AddTaskModal } from './components/modals/AddTaskModal';
import { AddHarvestModal } from './components/modals/AddHarvestModal';
import { AddJournalModal } from './components/modals/AddJournalModal';
import { Sprout, LogIn, Cloud, Rocket } from 'lucide-react';

const GardenAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modal open states
  const [isAddPlotOpen, setIsAddPlotOpen] = useState(false);
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddHarvestOpen, setIsAddHarvestOpen] = useState(false);
  const [isAddJournalOpen, setIsAddJournalOpen] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);

  const { user, loginWithGoogle } = useGarden();

  return (
    <div className="min-h-screen bg-stone-100/90 text-stone-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenVercelModal={() => setIsVercelModalOpen(true)}
      />

      {/* Guest Mode Info Banner if not logged in */}
      {!user && (
        <div className="bg-emerald-800 text-emerald-100 px-4 py-2 text-xs flex items-center justify-between border-b border-emerald-700">
          <div className="flex items-center gap-2 mx-auto max-w-7xl w-full justify-between">
            <span className="flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-amber-300" />
              <span>
                <strong>Mode Démonstration locale :</strong> Vos données sont stockées dans ce navigateur.
              </span>
            </span>
            <button
              onClick={loginWithGoogle}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-[11px] transition shadow-xs"
            >
              <LogIn className="w-3 h-3" />
              Synchroniser sur Firebase
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            onOpenAddPlant={() => setIsAddPlantOpen(true)}
            onOpenAddPlot={() => setIsAddPlotOpen(true)}
            onOpenAddTask={() => setIsAddTaskOpen(true)}
            onOpenAddHarvest={() => setIsAddHarvestOpen(true)}
          />
        )}

        {activeTab === 'plots' && (
          <PlotsView
            onOpenAddPlot={() => setIsAddPlotOpen(true)}
          />
        )}

        {activeTab === 'plants' && (
          <PlantsView
            onOpenAddPlant={() => setIsAddPlantOpen(true)}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            onOpenAddTask={() => setIsAddTaskOpen(true)}
          />
        )}

        {activeTab === 'harvests' && (
          <HarvestsView
            onOpenAddHarvest={() => setIsAddHarvestOpen(true)}
          />
        )}

        {activeTab === 'journal' && (
          <JournalView
            onOpenAddJournal={() => setIsAddJournalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-stone-800">Mon Jardinier</span>
            <span>&bull; Carnet de potager et verger connecté</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsVercelModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-stone-700 hover:text-black font-semibold transition"
            >
              <Rocket className="w-3.5 h-3.5 text-emerald-600" />
              <span>Guide Déploiement Vercel</span>
            </button>
            <span>&bull;</span>
            <span className="text-emerald-700 font-medium">Hébergement Firebase Firestore</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddPlotModal
        isOpen={isAddPlotOpen}
        onClose={() => setIsAddPlotOpen(false)}
      />

      <AddPlantModal
        isOpen={isAddPlantOpen}
        onClose={() => setIsAddPlantOpen(false)}
        onOpenAddPlot={() => setIsAddPlotOpen(true)}
      />

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />

      <AddHarvestModal
        isOpen={isAddHarvestOpen}
        onClose={() => setIsAddHarvestOpen(false)}
      />

      <AddJournalModal
        isOpen={isAddJournalOpen}
        onClose={() => setIsAddJournalOpen(false)}
      />

      <VercelDeployModal
        isOpen={isVercelModalOpen}
        onClose={() => setIsVercelModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <GardenProvider>
      <GardenAppContent />
    </GardenProvider>
  );
}
