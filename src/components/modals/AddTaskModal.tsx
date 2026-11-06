import React, { useState } from 'react';
import { X, CheckSquare, Calendar } from 'lucide-react';
import { useGarden } from '../../context/GardenContext';
import { TaskType } from '../../types/garden';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask, plots, plants } = useGarden();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<TaskType>('watering');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [plotId, setPlotId] = useState('');
  const [plantId, setPlantId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await addTask({
        title: title.trim(),
        type,
        dueDate,
        completed: false,
        plotId: plotId || undefined,
        plantId: plantId || undefined,
        notes: notes.trim() || undefined
      });
      onClose();
      setTitle('');
      setNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Nouvelle tâche ou rappel</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Description de la tâche *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Pailler les courgettes, Arroser les semis, Tailler..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Type de travail
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="watering">💧 Arrosage</option>
                <option value="sowing">🌱 Semis / Repiquage</option>
                <option value="pruning">✂️ Taille / Ébourgeonnage</option>
                <option value="weeding">🌾 Désherbage</option>
                <option value="pest_control">🛡️ Traitement bio / Purin</option>
                <option value="fertilizing">✨ Compost / Engrais</option>
                <option value="harvesting">🧺 Récolte</option>
                <option value="other">🪴 Autre entretien</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Date d'échéance *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Parcelle liée (optionnel)
              </label>
              <select
                value={plotId}
                onChange={(e) => setPlotId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="">Aucune</option>
                {plots.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Plante liée (optionnel)
              </label>
              <select
                value={plantId}
                onChange={(e) => setPlantId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="">Aucune</option>
                {plants.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Instructions ou détails
            </label>
            <textarea
              rows={2}
              placeholder="Conseils de dosage, température idéale..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-stone-600 hover:bg-stone-100 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
            >
              {isSubmitting ? 'Ajout...' : 'Programmer la tâche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
