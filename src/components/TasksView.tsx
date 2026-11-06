import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Droplets, 
  Scissors, 
  Sprout, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Calendar, 
  Trash2, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { Task, TaskType } from '../types/garden';

interface TasksViewProps {
  onOpenAddTask: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onOpenAddTask }) => {
  const { tasks, toggleTask, deleteTask } = useGarden();
  const [filter, setFilter] = useState<'all' | 'today' | 'pending' | 'completed'>('pending');
  const todayStr = new Date().toISOString().split('T')[0];

  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case 'watering': return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'sowing': return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'pruning': return <Scissors className="w-4 h-4 text-amber-600" />;
      case 'weeding': return <Scissors className="w-4 h-4 text-stone-600" />;
      case 'pest_control': return <ShieldCheck className="w-4 h-4 text-teal-600" />;
      case 'harvesting': return <Sparkles className="w-4 h-4 text-rose-600" />;
      case 'fertilizing': return <Sparkles className="w-4 h-4 text-purple-600" />;
      default: return <Clock className="w-4 h-4 text-stone-600" />;
    }
  };

  const getTaskTypeLabel = (type: TaskType) => {
    switch (type) {
      case 'watering': return 'Arrosage';
      case 'sowing': return 'Semis';
      case 'pruning': return 'Taille';
      case 'weeding': return 'Désherbage';
      case 'pest_control': return 'Traitement naturel';
      case 'harvesting': return 'Récolte';
      case 'fertilizing': return 'Fertilisation / Compost';
      default: return 'Entretien';
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'today') return !t.completed && t.dueDate <= todayStr;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
            Tâches & Travaux du Potager
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Ne manquez aucun arrosage, repiquage ou désherbage grâce à votre calendrier d'entretien.
          </p>
        </div>
        <button
          onClick={onOpenAddTask}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Nouvelle tâche
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-stone-200 shadow-xs overflow-x-auto">
        {[
          { id: 'pending', label: 'À faire', count: tasks.filter(t => !t.completed).length },
          { id: 'today', label: "Aujourd'hui & En retard", count: tasks.filter(t => !t.completed && t.dueDate <= todayStr).length },
          { id: 'completed', label: 'Terminées', count: tasks.filter(t => t.completed).length },
          { id: 'all', label: 'Toutes les tâches', count: tasks.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              filter === tab.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              filter === tab.id ? 'bg-emerald-800 text-emerald-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300 p-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-stone-800">Aucune tâche dans cette liste</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            Tout est à jour ! Profitez de votre potager ou planifiez une nouvelle tâche.
          </p>
          <button
            onClick={onOpenAddTask}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" /> Ajouter une tâche
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isOverdue = !task.completed && task.dueDate < todayStr;
            const isToday = !task.completed && task.dueDate === todayStr;

            return (
              <div
                key={task.id}
                className={`flex items-start justify-between p-4 rounded-2xl border transition bg-white shadow-2xs hover:shadow-xs ${
                  task.completed 
                    ? 'border-stone-200 bg-stone-50/50 opacity-70' 
                    : isOverdue 
                    ? 'border-rose-300 bg-rose-50/30' 
                    : isToday 
                    ? 'border-amber-300 bg-amber-50/30' 
                    : 'border-stone-200'
                }`}
              >
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id, task.completed)}
                    className="mt-1 w-5 h-5 text-emerald-600 rounded-md border-stone-300 focus:ring-emerald-500 cursor-pointer"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-stone-100 text-stone-700">
                        {getTaskIcon(task.type)}
                        {getTaskTypeLabel(task.type)}
                      </span>

                      {isOverdue && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800">
                          En retard
                        </span>
                      )}

                      {isToday && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                          Pour aujourd'hui
                        </span>
                      )}
                    </div>

                    <h4 className={`text-sm font-semibold ${task.completed ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                      {task.title}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                        {task.notes}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-3 text-[11px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Échéance : {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                      </span>
                      {task.completedAt && (
                        <span>&bull; Fait le {new Date(task.completedAt).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm(`Supprimer la tâche "${task.title}" ?`)) {
                      deleteTask(task.id);
                    }
                  }}
                  className="p-1.5 ml-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
