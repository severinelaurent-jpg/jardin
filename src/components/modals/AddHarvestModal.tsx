import React, { useState } from 'react';
import { X, Award, Star, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGarden } from '../../context/GardenContext';
import { HarvestUnit, HarvestQuality } from '../../types/garden';

interface AddHarvestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddHarvestModal: React.FC<AddHarvestModalProps> = ({ isOpen, onClose }) => {
  const { addHarvest, plants, plots } = useGarden();

  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [customPlantName, setCustomPlantName] = useState('');
  const [plotName, setPlotName] = useState('');
  const [quantity, setQuantity] = useState('1.5');
  const [unit, setUnit] = useState<HarvestUnit>('kg');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [quality, setQuality] = useState<HarvestQuality>('excellent');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePlantSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    setSelectedPlantId(pId);
    if (pId && pId !== 'custom') {
      const found = plants.find((p) => p.id === pId);
      if (found) {
        setCustomPlantName(found.name);
        const plot = plots.find((pl) => pl.id === found.plotId);
        setPlotName(plot ? plot.name : '');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPlantName = customPlantName.trim();
    if (!finalPlantName) return;

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) return;

    setIsSubmitting(true);
    try {
      await addHarvest({
        plantId: selectedPlantId && selectedPlantId !== 'custom' ? selectedPlantId : undefined,
        plantName: finalPlantName,
        plotName: plotName.trim() || undefined,
        harvestDate,
        quantity: numQty,
        unit,
        quality,
        notes: notes.trim() || undefined
      });

      // Confetti burst for celebrating homegrown harvest!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (cErr) {
        // Safe fail
      }

      onClose();
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
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Enregistrer une récolte 🧺</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select from existing plants or custom */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Variété récoltée *
            </label>
            {plants.length > 0 && (
              <select
                value={selectedPlantId}
                onChange={handlePlantSelect}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden mb-2"
              >
                <option value="">-- Choisir une plante de votre potager --</option>
                {plants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.variety ? `(${p.variety})` : ''}
                  </option>
                ))}
                <option value="custom">Autre légume / cueillette spontanée...</option>
              </select>
            )}

            {(!selectedPlantId || selectedPlantId === 'custom' || plants.length === 0) && (
              <input
                type="text"
                required
                placeholder="ex: Fraises Mara des Bois, Tomates Cerises, Courgettes..."
                value={customPlantName}
                onChange={(e) => setCustomPlantName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Quantité pesée *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.01"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Unité de mesure *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as HarvestUnit)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="kg">Kilogrammes (kg)</option>
                <option value="g">Grammes (g)</option>
                <option value="units">Pièces / Unités</option>
                <option value="bunches">Bottes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Date de récolte
              </label>
              <input
                type="date"
                required
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Qualité / Goût
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as HarvestQuality)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="excellent">⭐⭐⭐⭐ Exceptionnel / Délicieux</option>
                <option value="good">⭐⭐⭐ Très bon</option>
                <option value="average">⭐⭐ Standard</option>
                <option value="poor">⭐ Décevant</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Commentaires de dégustation ou conservation
            </label>
            <textarea
              rows={2}
              placeholder="ex: Première grosse récolte, très sucré, mangé en salade..."
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
              {isSubmitting ? 'Pesée en cours...' : 'Ajouter au panier 🧺'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
