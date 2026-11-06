import React, { useState } from 'react';
import { X, BookOpen, Sun, CloudRain, Cloud, CloudLightning, Wind, Snowflake, Thermometer } from 'lucide-react';
import { useGarden } from '../../context/GardenContext';
import { WeatherType } from '../../types/garden';

interface AddJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddJournalModal: React.FC<AddJournalModalProps> = ({ isOpen, onClose }) => {
  const { addJournalEntry } = useGarden();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weather, setWeather] = useState<WeatherType>('sunny');
  const [temperature, setTemperature] = useState('20');
  const [tags, setTags] = useState('potager, observation');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await addJournalEntry({
        title: title.trim(),
        content: content.trim(),
        date,
        weather,
        temperature: temperature ? parseFloat(temperature) : undefined,
        tags: tags.trim() || undefined
      });
      onClose();
      setTitle('');
      setContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Nouvelle note de journal</h3>
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
              Titre de la note *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Première floraison des courgettes, Traitement purin d'ortie..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Météo
              </label>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value as WeatherType)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="sunny">☀️ Ensoleillé</option>
                <option value="rainy">🌧️ Pluvieux</option>
                <option value="cloudy">⛅ Nuageux</option>
                <option value="stormy">⛈️ Orageux</option>
                <option value="windy">💨 Venteux</option>
                <option value="frost">❄️ Gelée</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Température (°C)
              </label>
              <input
                type="number"
                step="1"
                placeholder="20"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Contenu de l'observation *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Décrivez l'état du potager, apparition de pucerons ou coccinelles, humidité du sol, essais de paillage..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Mots-clés (séparés par des virgules)
            </label>
            <input
              type="text"
              placeholder="semis, météo, insectes, paillage"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
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
              {isSubmitting ? 'Enregistrement...' : 'Publier dans le journal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
