import React from 'react';
import { 
  Sprout, 
  Droplets, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus, 
  Calendar, 
  Sun, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { ActiveTab } from './Header';

interface DashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddPlant: () => void;
  onOpenAddPlot: () => void;
  onOpenAddTask: () => void;
  onOpenAddHarvest: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setActiveTab,
  onOpenAddPlant,
  onOpenAddPlot,
  onOpenAddTask,
  onOpenAddHarvest
}) => {
  const { 
    plots, 
    plants, 
    tasks, 
    harvests, 
    waterPlant, 
    toggleTask, 
    seedInitialGarden,
    user
  } = useGarden();

  const todayStr = new Date().toISOString().split('T')[0];

  // Needs watering calculations
  const plantsNeedingWater = plants.filter((plant) => {
    if (plant.status === 'finished' || plant.status === 'planned') return false;
    if (!plant.wateringFrequencyDays) return false;
    if (!plant.lastWateredDate) return true;
    const lastDate = new Date(plant.lastWateredDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
    return diffDays >= plant.wateringFrequencyDays;
  });

  // Pending tasks
  const pendingTasks = tasks.filter((t) => !t.completed);
  const todayTasks = pendingTasks.filter((t) => t.dueDate <= todayStr);

  // Total harvests stats
  const totalKg = harvests.reduce((acc, h) => {
    if (h.unit === 'kg') return acc + h.quantity;
    if (h.unit === 'g') return acc + h.quantity / 1000;
    return acc;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs font-medium mb-3">
            <Sun className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
            <span>Saison Potagère Active &bull; {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bonjour {user?.displayName ? user.displayName.split(' ')[0] : 'Jardinier'} ! 🌱
          </h1>
          <p className="mt-2 text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Bienvenue dans votre carnet de jardinage connecté. Suivez la croissance de vos légumes, organisez vos parcelles et planifiez vos arrosages avec précision.
          </p>

          {/* Quick starter button if no plots */}
          {plots.length === 0 && (
            <div className="mt-4 pt-4 border-t border-emerald-600/60 flex flex-wrap items-center gap-3">
              <button
                onClick={seedInitialGarden}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-emerald-900" />
                Initialiser un potager type (Tomates, Fraises, etc.)
              </button>
              <span className="text-xs text-emerald-200">
                Ou commencez avec vos propres parcelles vierges
              </span>
            </div>
          )}
        </div>
        <div className="absolute -right-8 -bottom-10 opacity-20 pointer-events-none">
          <Sprout className="w-64 h-64 text-emerald-200" />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Parcelles */}
        <div 
          onClick={() => setActiveTab('plots')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Parcelles</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-stone-900">{plots.length}</span>
            <span className="text-xs text-stone-500">zones</span>
          </div>
          <p className="mt-1 text-xs text-stone-500 flex items-center gap-1">
            Gérer les espaces <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </p>
        </div>

        {/* Cultures */}
        <div 
          onClick={() => setActiveTab('plants')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Cultures en cours</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-stone-900">
              {plants.filter(p => p.status !== 'finished').length}
            </span>
            <span className="text-xs text-stone-500">variétés</span>
          </div>
          <p className="mt-1 text-xs text-stone-500 flex items-center gap-1">
            Voir le potager <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </p>
        </div>

        {/* Tâches */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-500 hover:shadow-md cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Tâches à faire</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-600">{todayTasks.length}</span>
            <span className="text-xs text-stone-500">pour aujourd'hui</span>
          </div>
          <p className="mt-1 text-xs text-stone-500 flex items-center gap-1">
            {pendingTasks.length} en attente au total
          </p>
        </div>

        {/* Récoltes */}
        <div 
          onClick={() => setActiveTab('harvests')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Récoltes totales</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700 group-hover:bg-rose-600 group-hover:text-white transition">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-stone-900">{totalKg.toFixed(1)}</span>
            <span className="text-xs text-stone-500">kg pesés</span>
          </div>
          <p className="mt-1 text-xs text-stone-500 flex items-center gap-1">
            {harvests.length} pesées enregistrées
          </p>
        </div>
      </div>

      {/* Main Content 2-Column: Left (Arrosages urgents + Quick Actions), Right (Tâches du jour + Conseils) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Alert: Plants Needing Water */}
          {plantsNeedingWater.length > 0 && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm sm:text-base">
                  <Droplets className="w-5 h-5 text-amber-600 animate-bounce" />
                  <span>Arrosage recommandé ({plantsNeedingWater.length} plantes)</span>
                </div>
                <span className="text-xs text-amber-800 font-medium">
                  Fréquence dépassée
                </span>
              </div>
              <p className="text-xs text-amber-800 mb-4">
                Ces variétés ont soif pour maintenir une bonne floraison et nouaison :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plantsNeedingWater.slice(0, 4).map((plant) => (
                  <div 
                    key={plant.id} 
                    className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-200 shadow-2xs"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">{plant.name}</h4>
                      <p className="text-xs text-stone-500">
                        Tous les {plant.wateringFrequencyDays}j &bull; Dernier : {plant.lastWateredDate || 'Non renseigné'}
                      </p>
                    </div>
                    <button
                      onClick={() => waterPlant(plant.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition"
                    >
                      <Droplets className="w-3.5 h-3.5" />
                      Arrosé
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Action Center */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Actions rapides au jardin
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={onOpenAddPlant}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition group text-center"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-stone-800">Planter</span>
                <span className="text-[11px] text-stone-500">Nouvelle culture</span>
              </button>

              <button
                onClick={onOpenAddPlot}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition group text-center"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-stone-800">Parcelle</span>
                <span className="text-[11px] text-stone-500">Carré ou planche</span>
              </button>

              <button
                onClick={onOpenAddTask}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition group text-center"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-stone-800">Tâche</span>
                <span className="text-[11px] text-stone-500">Rappel jardinier</span>
              </button>

              <button
                onClick={onOpenAddHarvest}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition group text-center"
              >
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-stone-800">Récolte</span>
                <span className="text-[11px] text-stone-500">Peser vos fruits</span>
              </button>
            </div>
          </div>

          {/* Overview of plots and active plants */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-900">Aperçu de vos parcelles</h3>
              <button
                onClick={() => setActiveTab('plots')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                Voir tout <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {plots.length === 0 ? (
              <div className="text-center py-8 text-stone-500">
                <p className="text-sm">Aucune parcelle créée pour le moment.</p>
                <button
                  onClick={onOpenAddPlot}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                >
                  <Plus className="w-3.5 h-3.5" /> Créer ma première parcelle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plots.map((plot) => {
                  const plotPlants = plants.filter(p => p.plotId === plot.id && p.status !== 'finished');
                  return (
                    <div 
                      key={plot.id} 
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-stone-900 flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: plot.color || '#10b981' }} 
                          />
                          {plot.name}
                        </span>
                        <span className="text-xs text-stone-500">{plot.areaM2 ? `${plot.areaM2} m²` : ''}</span>
                      </div>
                      <p className="text-xs text-stone-500 line-clamp-1 mb-2">
                        {plot.description || 'Aucune description'}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {plotPlants.length > 0 ? (
                          plotPlants.map(p => (
                            <span 
                              key={p.id}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-stone-200 text-emerald-900 font-medium"
                            >
                              🌱 {p.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-stone-400 italic">Parcelle vide</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 span) - Today's Checklist & Ecological Advice */}
        <div className="space-y-6">

          {/* Today's Tasks */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                À faire aujourd'hui
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {todayTasks.length}
              </span>
            </div>

            {todayTasks.length === 0 ? (
              <div className="text-center py-6 text-stone-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                <p className="text-xs font-medium">Tout est à jour pour aujourd'hui !</p>
                <p className="text-[11px] text-stone-400 mt-1">Prenez le temps d'observer vos plantations.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start space-x-2.5 p-2.5 rounded-xl border border-stone-100 hover:bg-stone-50 transition"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id, task.completed)}
                      className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${task.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                        {task.title}
                      </p>
                      {task.notes && (
                        <p className="text-[11px] text-stone-400 truncate mt-0.5">{task.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={onOpenAddTask}
              className="mt-4 w-full py-2 rounded-xl border border-dashed border-stone-300 hover:border-emerald-500 text-stone-600 hover:text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter une tâche
            </button>
          </div>

          {/* Eco Garden Advice */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5 shadow-xs">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm mb-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Conseil éco-jardinier</span>
            </div>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              <strong>Le paillage protecteur :</strong> Disposez 5 à 7 cm de paille, feuilles sèches ou tontes séchées au pied des tomates et courgettes. Cela réduit l'évaporation de 70 %, freine les herbes indésirables et nourrit la vie du sol.
            </p>
            <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800 font-medium">
              <span>Astuce permaculture</span>
              <span>100% Naturel 🌿</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
