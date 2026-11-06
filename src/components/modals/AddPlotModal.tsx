import React, { useState } from 'react';
import { X, Layers } from 'lucide-react';
import { useGarden } from '../../context/GardenContext';
import { SunExposure, SoilType } from '../../types/garden';

interface AddPlotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPlotModal: React.FC<AddPlotModalProps> = ({ isOpen, onClose }) => {
  const { addPlot } = useGarden();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sunExposure, setSunExposure] = useState<SunExposure>('full_sun');
  const [soilType, setSoilType] = useState<SoilType>('loamy');
  const [areaM2, setAreaM2] = useState<string>('4');
  const [color, setColor] = useState('#10b981');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await addPlot({
        name: name.trim(),
        description: description.trim() || undefined,
        sunExposure,
        soilType,
        areaM2: areaM2 ? parseFloat(areaM2) : undefined,
        color
      });
      onClose();
      setName('');
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Nouvelle parcelle de jardin</h3>
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
              Nom de l'espace *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Carré Potager 1, Serre froide, Bordure Sud..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Description / Localisation
            </label>
            <textarea
              rows={2}
              placeholder="ex: Plein soleil, proche du point d'eau, enrichi en compost..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Ensoleillement *
              </label>
              <select
                value={sunExposure}
                onChange={(e) => setSunExposure(e.target.value as SunExposure)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="full_sun">☀️ Plein soleil</option>
                <option value="partial_shade">⛅ Mi-ombre</option>
                <option value="full_shade">☁️ Ombre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Type de sol *
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as SoilType)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="loamy">Limoneux</option>
                <option value="clay">Argileux</option>
                <option value="sandy">Sableux</option>
                <option value="chalky">Calcaire</option>
                <option value="potting">Terreau & Compost</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Surface approximative (m²)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="4"
                value={areaM2}
                onChange={(e) => setAreaM2(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Couleur de repère
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 p-1 rounded-xl border border-stone-300 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3">
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
              {isSubmitting ? 'Création...' : 'Créer la parcelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
