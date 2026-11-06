import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Sun, 
  CloudSun, 
  Cloud, 
  Sparkles, 
  Edit2, 
  Trash2, 
  Leaf, 
  X,
  Compass
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { Plot, SunExposure, SoilType } from '../types/garden';

interface PlotsViewProps {
  onOpenAddPlot: () => void;
  onSelectPlotFilter?: (plotId: string) => void;
}

export const PlotsView: React.FC<PlotsViewProps> = ({ onOpenAddPlot }) => {
  const { plots, plants, updatePlot, deletePlot } = useGarden();
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);

  const getSunBadge = (exposure: SunExposure) => {
    switch (exposure) {
      case 'full_sun':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Sun className="w-3.5 h-3.5 text-amber-600" /> Plein soleil
          </span>
        );
      case 'partial_shade':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
            <CloudSun className="w-3.5 h-3.5 text-sky-600" /> Mi-ombre
          </span>
        );
      case 'full_shade':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
            <Cloud className="w-3.5 h-3.5 text-slate-600" /> Ombre
          </span>
        );
    }
  };

  const getSoilLabel = (soil: SoilType) => {
    switch (soil) {
      case 'clay': return 'Argileux (lourd & riche)';
      case 'sandy': return 'Sableux (drainant & léger)';
      case 'loamy': return 'Limoneux (équilibré)';
      case 'chalky': return 'Calcaire';
      case 'potting': return 'Terreau & Compost';
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlot) return;
    await updatePlot(editingPlot.id, {
      name: editingPlot.name,
      description: editingPlot.description,
      sunExposure: editingPlot.sunExposure,
      soilType: editingPlot.soilType,
      areaM2: editingPlot.areaM2 ? Number(editingPlot.areaM2) : undefined,
      color: editingPlot.color
    });
    setEditingPlot(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            Mes Parcelles & Espaces de culture
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Définissez vos carrés potagers, planches de culture, serres et jardinières pour organiser vos rotations.
          </p>
        </div>
        <button
          onClick={onOpenAddPlot}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Nouvelle parcelle
        </button>
      </div>

      {/* Grid of Plots */}
      {plots.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300 p-8">
          <Layers className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">Aucune parcelle configurée</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            Créez une première parcelle (par exemple "Carré Potager 1" ou "Serre") pour y assigner vos plants.
          </p>
          <button
            onClick={onOpenAddPlot}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" /> Créer une parcelle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plots.map((plot) => {
            const plotPlants = plants.filter((p) => p.plotId === plot.id);
            const activePlants = plotPlants.filter((p) => p.status !== 'finished');

            return (
              <div
                key={plot.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                {/* Header colored banner */}
                <div>
                  <div 
                    className="h-3 w-full"
                    style={{ backgroundColor: plot.color || '#10b981' }}
                  />
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-base text-stone-900">{plot.name}</h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {plot.areaM2 ? `${plot.areaM2} m² de surface` : 'Surface non précisée'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setEditingPlot(plot)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer la parcelle "${plot.name}" ?`)) {
                              deletePlot(plot.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {plot.description && (
                      <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                        {plot.description}
                      </p>
                    )}

                    {/* Metadata Badges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {getSunBadge(plot.sunExposure)}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                        {getSoilLabel(plot.soilType)}
                      </span>
                    </div>

                    {/* Plants in this plot */}
                    <div className="mt-5 pt-4 border-t border-stone-100">
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
                        <span className="flex items-center gap-1">
                          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                          Cultures ({activePlants.length})
                        </span>
                        <span>{plotPlants.length} total</span>
                      </div>

                      {activePlants.length === 0 ? (
                        <p className="text-xs text-stone-400 italic py-1">
                          Aucun légume planté actuellement.
                        </p>
                      ) : (
                        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                          {activePlants.map((plant) => (
                            <div
                              key={plant.id}
                              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-stone-50 text-xs border border-stone-200/60"
                            >
                              <span className="font-medium text-stone-800 truncate">
                                {plant.name}
                              </span>
                              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium capitalize">
                                {plant.status === 'growing' ? 'croissance' : plant.status === 'sown' ? 'semé' : plant.status === 'harvesting' ? 'récolte' : plant.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50/70 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
                  <span>Créé le {new Date(plot.createdAt).toLocaleDateString('fr-FR')}</span>
                  <span className="font-semibold text-emerald-700">
                    {plotPlants.length > 0 ? 'En exploitation' : 'Disponible'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Plot Modal */}
      {editingPlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-stone-900">Modifier la parcelle</h3>
              <button
                onClick={() => setEditingPlot(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nom de la parcelle *
                </label>
                <input
                  type="text"
                  required
                  value={editingPlot.name}
                  onChange={(e) => setEditingPlot({ ...editingPlot, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description / Emplacement
                </label>
                <textarea
                  rows={2}
                  value={editingPlot.description || ''}
                  onChange={(e) => setEditingPlot({ ...editingPlot, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Ensoleillement
                  </label>
                  <select
                    value={editingPlot.sunExposure}
                    onChange={(e) => setEditingPlot({ ...editingPlot, sunExposure: e.target.value as SunExposure })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="full_sun">Plein soleil</option>
                    <option value="partial_shade">Mi-ombre</option>
                    <option value="full_shade">Ombre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nature du sol
                  </label>
                  <select
                    value={editingPlot.soilType}
                    onChange={(e) => setEditingPlot({ ...editingPlot, soilType: e.target.value as SoilType })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="clay">Argileux</option>
                    <option value="sandy">Sableux</option>
                    <option value="loamy">Limoneux</option>
                    <option value="chalky">Calcaire</option>
                    <option value="potting">Terreau & Compost</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Surface (m²)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPlot.areaM2 || ''}
                    onChange={(e) => setEditingPlot({ ...editingPlot, areaM2: parseFloat(e.target.value) || undefined })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Couleur visuelle
                  </label>
                  <input
                    type="color"
                    value={editingPlot.color || '#10b981'}
                    onChange={(e) => setEditingPlot({ ...editingPlot, color: e.target.value })}
                    className="w-full h-10 p-1 rounded-xl border border-stone-300 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPlot(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-600 hover:bg-stone-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
