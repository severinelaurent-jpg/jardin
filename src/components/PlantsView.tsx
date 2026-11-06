import React, { useState } from 'react';
import { 
  Sprout, 
  Plus, 
  Droplets, 
  Search, 
  Calendar, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  Heart, 
  ShieldAlert, 
  Filter,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { Plant, PlantCategory, PlantStatus } from '../types/garden';

interface PlantsViewProps {
  onOpenAddPlant: () => void;
}

export const PlantsView: React.FC<PlantsViewProps> = ({ onOpenAddPlant }) => {
  const { plants, plots, waterPlant, updatePlant, deletePlant } = useGarden();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<PlantStatus | 'all'>('all');
  const [selectedPlotId, setSelectedPlotId] = useState<string>('all');
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);

  // Filtered plants
  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = 
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plant.variety && plant.variety.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (plant.notes && plant.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || plant.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || plant.status === selectedStatus;
    const matchesPlot = selectedPlotId === 'all' || plant.plotId === selectedPlotId;

    return matchesSearch && matchesCategory && matchesStatus && matchesPlot;
  });

  const getStatusBadge = (status: PlantStatus) => {
    switch (status) {
      case 'planned':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">Planifié</span>;
      case 'sown':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Semé</span>;
      case 'growing':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">En croissance</span>;
      case 'harvesting':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 animate-pulse">En récolte 🍓</span>;
      case 'finished':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-200 text-stone-600">Terminé</span>;
    }
  };

  const getCategoryEmoji = (category: PlantCategory) => {
    switch (category) {
      case 'vegetable': return '🥕';
      case 'fruit': return '🍓';
      case 'herb': return '🌿';
      case 'flower': return '🌸';
      case 'legume': return '🌱';
      case 'other': return '🪴';
    }
  };

  const isWaterDue = (plant: Plant) => {
    if (!plant.wateringFrequencyDays || plant.status === 'finished') return false;
    if (!plant.lastWateredDate) return true;
    const last = new Date(plant.lastWateredDate).getTime();
    const now = new Date().getTime();
    const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    return diff >= plant.wateringFrequencyDays;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlant) return;
    await updatePlant(editingPlant.id, {
      name: editingPlant.name,
      variety: editingPlant.variety,
      category: editingPlant.category,
      status: editingPlant.status,
      plotId: editingPlant.plotId,
      sowingDate: editingPlant.sowingDate,
      plantingDate: editingPlant.plantingDate,
      estimatedHarvestDate: editingPlant.estimatedHarvestDate,
      wateringFrequencyDays: editingPlant.wateringFrequencyDays ? Number(editingPlant.wateringFrequencyDays) : undefined,
      quantity: editingPlant.quantity ? Number(editingPlant.quantity) : undefined,
      notes: editingPlant.notes,
      companionGood: editingPlant.companionGood,
      companionBad: editingPlant.companionBad
    });
    setEditingPlant(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            Potager & Cultures ({plants.length})
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Gérez vos plantations, calendriers de récoltes, arrosages et associations bénéfiques.
          </p>
        </div>
        <button
          onClick={onOpenAddPlant}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Planter une variété
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Rechercher une plante, variété, note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Plot Filter */}
          <div className="w-full sm:w-48">
            <select
              value={selectedPlotId}
              onChange={(e) => setSelectedPlotId(e.target.value)}
              className="w-full py-2 px-3 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">Toutes les parcelles</option>
              {plots.map((plot) => (
                <option key={plot.id} value={plot.id}>
                  {plot.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-44">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as PlantStatus | 'all')}
              className="w-full py-2 px-3 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">Tous les statuts</option>
              <option value="planned">Planifié</option>
              <option value="sown">Semé</option>
              <option value="growing">En croissance</option>
              <option value="harvesting">En récolte</option>
              <option value="finished">Terminé</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'Toutes les catégories', emoji: '🌱' },
            { id: 'vegetable', label: 'Légumes', emoji: '🥕' },
            { id: 'fruit', label: 'Fruits & Baies', emoji: '🍓' },
            { id: 'herb', label: 'Aromatiques', emoji: '🌿' },
            { id: 'flower', label: 'Fleurs compagnes', emoji: '🌸' },
            { id: 'legume', label: 'Légumineuses', emoji: '🌱' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as PlantCategory | 'all')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Plants Grid */}
      {filteredPlants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300 p-8">
          <Sprout className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">Aucune culture trouvée</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            {plants.length === 0
              ? 'Votre potager est vide pour l’instant. Ajoutez une première variété !'
              : 'Aucune plante ne correspond à vos filtres de recherche.'}
          </p>
          <button
            onClick={onOpenAddPlant}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" /> Planter un légume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map((plant) => {
            const plot = plots.find((p) => p.id === plant.plotId);
            const waterDue = isWaterDue(plant);

            return (
              <div
                key={plant.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="p-5">
                  {/* Category & Status bar */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl" title={plant.category}>
                      {getCategoryEmoji(plant.category)}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {getStatusBadge(plant.status)}
                      <button
                        onClick={() => setEditingPlant(plant)}
                        className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                        title="Modifier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Supprimer "${plant.name}" ?`)) {
                            deletePlant(plant.id);
                          }
                        }}
                        className="p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Variety */}
                  <h3 className="font-bold text-base text-stone-900">{plant.name}</h3>
                  {plant.variety && (
                    <p className="text-xs text-emerald-800 font-medium">
                      Variété : {plant.variety}
                    </p>
                  )}

                  {/* Plot badge */}
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-medium">
                    <Layers className="w-3 h-3 text-stone-500" />
                    <span>Parcelle : {plot ? plot.name : 'Non assignée'}</span>
                  </div>

                  {/* Dates & Timeline */}
                  <div className="mt-3.5 space-y-1 text-xs text-stone-500">
                    {plant.plantingDate && (
                      <div className="flex items-center justify-between">
                        <span>Plantation :</span>
                        <span className="font-medium text-stone-700">
                          {new Date(plant.plantingDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                    {plant.estimatedHarvestDate && (
                      <div className="flex items-center justify-between">
                        <span>Récolte estimée :</span>
                        <span className="font-semibold text-rose-700">
                          {new Date(plant.estimatedHarvestDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                    {plant.quantity && (
                      <div className="flex items-center justify-between">
                        <span>Quantité plantée :</span>
                        <span className="font-medium text-stone-700">{plant.quantity} pieds</span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {plant.notes && (
                    <p className="mt-3 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 italic">
                      "{plant.notes}"
                    </p>
                  )}

                  {/* Companion planting tips */}
                  {(plant.companionGood || plant.companionBad) && (
                    <div className="mt-3 pt-3 border-t border-stone-100 space-y-1 text-[11px]">
                      {plant.companionGood && (
                        <div className="flex items-center gap-1.5 text-emerald-800">
                          <Heart className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span><strong>Amies :</strong> {plant.companionGood}</span>
                        </div>
                      )}
                      {plant.companionBad && (
                        <div className="flex items-center gap-1.5 text-amber-800">
                          <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
                          <span><strong>Éviter :</strong> {plant.companionBad}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer with Watering Quick Action */}
                <div className={`p-4 border-t flex items-center justify-between text-xs ${
                  waterDue ? 'bg-amber-50/80 border-amber-200' : 'bg-stone-50 border-stone-100'
                }`}>
                  <div>
                    <div className="flex items-center gap-1 font-medium text-stone-700">
                      <Droplets className={`w-3.5 h-3.5 ${waterDue ? 'text-amber-600' : 'text-teal-600'}`} />
                      <span>{plant.wateringFrequencyDays ? `Tous les ${plant.wateringFrequencyDays}j` : 'Arrosage libre'}</span>
                    </div>
                    <p className="text-[10px] text-stone-500">
                      Dernier : {plant.lastWateredDate ? new Date(plant.lastWateredDate).toLocaleDateString('fr-FR') : 'Jamais'}
                    </p>
                  </div>

                  <button
                    onClick={() => waterPlant(plant.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition ${
                      waterDue 
                        ? 'bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    <Droplets className="w-3 h-3" />
                    Arroser
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Plant Modal */}
      {editingPlant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-stone-900">Modifier la culture</h3>
              <button
                onClick={() => setEditingPlant(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nom du végétal *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPlant.name}
                    onChange={(e) => setEditingPlant({ ...editingPlant, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Variété
                  </label>
                  <input
                    type="text"
                    value={editingPlant.variety || ''}
                    onChange={(e) => setEditingPlant({ ...editingPlant, variety: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={editingPlant.category}
                    onChange={(e) => setEditingPlant({ ...editingPlant, category: e.target.value as PlantCategory })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="vegetable">Légume</option>
                    <option value="fruit">Fruit / Baie</option>
                    <option value="herb">Aromatique</option>
                    <option value="flower">Fleur compagne</option>
                    <option value="legume">Légumineuse</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Statut actuel
                  </label>
                  <select
                    value={editingPlant.status}
                    onChange={(e) => setEditingPlant({ ...editingPlant, status: e.target.value as PlantStatus })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="planned">Planifié</option>
                    <option value="sown">Semé</option>
                    <option value="growing">En croissance</option>
                    <option value="harvesting">En récolte</option>
                    <option value="finished">Terminé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Parcelle assignée *
                </label>
                <select
                  required
                  value={editingPlant.plotId}
                  onChange={(e) => setEditingPlant({ ...editingPlant, plotId: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {plots.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Date de plantation
                  </label>
                  <input
                    type="date"
                    value={editingPlant.plantingDate || ''}
                    onChange={(e) => setEditingPlant({ ...editingPlant, plantingDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Date de récolte estimée
                  </label>
                  <input
                    type="date"
                    value={editingPlant.estimatedHarvestDate || ''}
                    onChange={(e) => setEditingPlant({ ...editingPlant, estimatedHarvestDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
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
                    value={editingPlant.wateringFrequencyDays || ''}
                    onChange={(e) => setEditingPlant({ ...editingPlant, wateringFrequencyDays: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nombre de pieds / plants
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingPlant.quantity || ''}
                    onChange={(e) => setEditingPlant({ ...editingPlant, quantity: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Notes de culture
                </label>
                <textarea
                  rows={2}
                  value={editingPlant.notes || ''}
                  onChange={(e) => setEditingPlant({ ...editingPlant, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPlant(null)}
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
