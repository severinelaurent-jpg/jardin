import React, { useState } from 'react';
import { X, Sprout, Sparkles, Heart, ShieldAlert } from 'lucide-react';
import { useGarden } from '../../context/GardenContext';
import { PlantCategory, PlantStatus } from '../../types/garden';
import { VEGETABLE_DATABASE, PlantGuide } from '../../data/vegetableDatabase';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddPlot: () => void;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({
  isOpen,
  onClose,
  onOpenAddPlot
}) => {
  const { plots, addPlant } = useGarden();

  const [name, setName] = useState('');
  const [variety, setVariety] = useState('');
  const [category, setCategory] = useState<PlantCategory>('vegetable');
  const [status, setStatus] = useState<PlantStatus>('growing');
  const [plotId, setPlotId] = useState(plots[0]?.id || '');
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().split('T')[0]);
  const [estimatedHarvestDate, setEstimatedHarvestDate] = useState('');
  const [wateringFrequencyDays, setWateringFrequencyDays] = useState('3');
  const [quantity, setQuantity] = useState('4');
  const [companionGood, setCompanionGood] = useState('');
  const [companionBad, setCompanionBad] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Auto-fill from vegetable catalog
  const handleSelectTemplate = (guide: PlantGuide) => {
    setName(guide.name);
    setVariety(guide.defaultVariety);
    setCategory(guide.category);
    setWateringFrequencyDays(guide.wateringFrequencyDays.toString());
    setCompanionGood(guide.companionGood);
    setCompanionBad(guide.companionBad);
    setNotes(guide.tips);

    // Calculate estimated harvest date
    const plantDate = new Date(plantingDate || new Date());
    plantDate.setDate(plantDate.getDate() + guide.daysToHarvest);
    setEstimatedHarvestDate(plantDate.toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!plotId) {
      alert('Veuillez sélectionner ou créer une parcelle pour y planter ce légume.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addPlant({
        plotId,
        name: name.trim(),
        variety: variety.trim() || undefined,
        category,
        status,
        plantingDate: plantingDate || undefined,
        estimatedHarvestDate: estimatedHarvestDate || undefined,
        wateringFrequencyDays: wateringFrequencyDays ? parseInt(wateringFrequencyDays) : undefined,
        lastWateredDate: plantingDate || new Date().toISOString().split('T')[0],
        quantity: quantity ? parseInt(quantity) : undefined,
        companionGood: companionGood.trim() || undefined,
        companionBad: companionBad.trim() || undefined,
        notes: notes.trim() || undefined
      });
      onClose();
      setName('');
      setVariety('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Sprout className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Planter une variété</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestions Catalog */}
        <div className="mb-5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
          <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Suggestions rapides (cliquez pour pré-remplir les conseils) :
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {VEGETABLE_DATABASE.map((guide) => (
              <button
                key={guide.id}
                type="button"
                onClick={() => handleSelectTemplate(guide)}
                className="px-2.5 py-1 rounded-lg text-xs bg-white border border-emerald-200 text-emerald-950 font-medium hover:bg-emerald-600 hover:text-white transition shadow-2xs"
              >
                {guide.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nom du végétal *
              </label>
              <input
                type="text"
                required
                placeholder="ex: Tomates, Courgettes..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Variété spécifique
              </label>
              <input
                type="text"
                placeholder="ex: Marmande, Cœur de Bœuf..."
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Catégorie *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PlantCategory)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="vegetable">🥕 Légume</option>
                <option value="fruit">🍓 Fruit / Baie</option>
                <option value="herb">🌿 Aromatique</option>
                <option value="flower">🌸 Fleur compagne</option>
                <option value="legume">🌱 Légumineuse</option>
                <option value="other">🪴 Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Statut actuel
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PlantStatus)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="growing">En croissance</option>
                <option value="sown">Semé</option>
                <option value="planned">Planifié</option>
                <option value="harvesting">En récolte</option>
                <option value="finished">Terminé</option>
              </select>
            </div>
          </div>

          {/* Plot selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-700">
                Parcelle de culture *
              </label>
              {plots.length === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAddPlot();
                  }}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  + Créer une parcelle d'abord
                </button>
              )}
            </div>
            {plots.length === 0 ? (
              <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-xs border border-amber-200">
                Aucune parcelle existante. Cliquez ci-dessus pour en créer une.
              </div>
            ) : (
              <select
                required
                value={plotId}
                onChange={(e) => setPlotId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {plots.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sunExposure === 'full_sun' ? 'Plein soleil' : 'Mi-ombre'})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Date de plantation / semis
              </label>
              <input
                type="date"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Récolte estimée
              </label>
              <input
                type="date"
                value={estimatedHarvestDate}
                onChange={(e) => setEstimatedHarvestDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Fréquence arrosage (jours)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={wateringFrequencyDays}
                onChange={(e) => setWateringFrequencyDays(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nombre de pieds / plants
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Companions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1 flex items-center gap-1">
                <Heart className="w-3 h-3 text-emerald-600" /> Plantes amies
              </label>
              <input
                type="text"
                placeholder="ex: Basilic, Œillet d'Inde..."
                value={companionGood}
                onChange={(e) => setCompanionGood(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-800 mb-1 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-600" /> Plantes à éviter
              </label>
              <input
                type="text"
                placeholder="ex: Fenouil, Pomme de terre..."
                value={companionBad}
                onChange={(e) => setCompanionBad(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Notes & Conseils
            </label>
            <textarea
              rows={2}
              placeholder="Conseils de taille, paillage, tuteurage..."
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
              disabled={isSubmitting || plots.length === 0}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : 'Planter dans le potager'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
