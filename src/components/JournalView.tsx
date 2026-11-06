import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Sun, 
  CloudRain, 
  Cloud, 
  CloudLightning, 
  Wind, 
  Snowflake, 
  Calendar, 
  Trash2, 
  Tag, 
  Thermometer 
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { JournalEntry, WeatherType } from '../types/garden';

interface JournalViewProps {
  onOpenAddJournal: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ onOpenAddJournal }) => {
  const { journal, deleteJournalEntry } = useGarden();

  const getWeatherIcon = (weather?: WeatherType) => {
    switch (weather) {
      case 'sunny': return <Sun className="w-4 h-4 text-amber-500" />;
      case 'rainy': return <CloudRain className="w-4 h-4 text-blue-500" />;
      case 'cloudy': return <Cloud className="w-4 h-4 text-stone-500" />;
      case 'stormy': return <CloudLightning className="w-4 h-4 text-purple-500" />;
      case 'windy': return <Wind className="w-4 h-4 text-teal-500" />;
      case 'frost': return <Snowflake className="w-4 h-4 text-sky-400" />;
      default: return null;
    }
  };

  const getWeatherLabel = (weather?: WeatherType) => {
    switch (weather) {
      case 'sunny': return 'Ensoleillé';
      case 'rainy': return 'Pluvieux';
      case 'cloudy': return 'Nuageux';
      case 'stormy': return 'Orageux';
      case 'windy': return 'Venteux';
      case 'frost': return 'Gelée blanche';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Journal de Bord du Jardinier
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Notez vos observations météo, apparitions d'auxiliaires, traitements bio et réussites.
          </p>
        </div>
        <button
          onClick={onOpenAddJournal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Nouvelle observation
        </button>
      </div>

      {/* Journal entries */}
      {journal.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300 p-8">
          <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">Aucune note dans le journal</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            Consignez le temps qu'il a fait, la date de la première fleur de courgette ou vos tests de paillage.
          </p>
          <button
            onClick={onOpenAddJournal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" /> Écrire une note
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {journal.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {new Date(entry.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>

                  {entry.weather && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-100 text-stone-700 text-xs font-medium">
                      {getWeatherIcon(entry.weather)}
                      <span>{getWeatherLabel(entry.weather)}</span>
                    </div>
                  )}

                  {entry.temperature !== undefined && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-100 text-stone-700 text-xs font-medium">
                      <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                      <span>{entry.temperature}°C</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (window.confirm(`Supprimer cette note "${entry.title}" ?`)) {
                      deleteJournalEntry(entry.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition self-end sm:self-auto"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-bold text-base text-stone-900 mb-2">{entry.title}</h3>
              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                {entry.content}
              </p>

              {entry.tags && (
                <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap gap-1.5">
                  {entry.tags.split(',').map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
