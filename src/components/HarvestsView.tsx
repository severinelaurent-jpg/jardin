import React from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Award, 
  Calendar, 
  Trash2, 
  TrendingUp, 
  Sparkles, 
  Star,
  Layers
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { Harvest, HarvestQuality } from '../types/garden';

interface HarvestsViewProps {
  onOpenAddHarvest: () => void;
}

export const HarvestsView: React.FC<HarvestsViewProps> = ({ onOpenAddHarvest }) => {
  const { harvests, deleteHarvest } = useGarden();

  // Metrics
  const totalKg = harvests.reduce((acc, h) => {
    if (h.unit === 'kg') return acc + h.quantity;
    if (h.unit === 'g') return acc + h.quantity / 1000;
    return acc;
  }, 0);

  const totalCount = harvests.reduce((acc, h) => {
    if (h.unit === 'units' || h.unit === 'bunches') return acc + h.quantity;
    return acc;
  }, 0);

  // Group by plant name for top producers
  const cropsStats: Record<string, { totalKg: number; count: number; countUnits: number }> = {};
  harvests.forEach((h) => {
    if (!cropsStats[h.plantName]) {
      cropsStats[h.plantName] = { totalKg: 0, count: 0, countUnits: 0 };
    }
    cropsStats[h.plantName].count += 1;
    if (h.unit === 'kg') cropsStats[h.plantName].totalKg += h.quantity;
    if (h.unit === 'g') cropsStats[h.plantName].totalKg += h.quantity / 1000;
    if (h.unit === 'units' || h.unit === 'bunches') cropsStats[h.plantName].countUnits += h.quantity;
  });

  const getQualityBadge = (quality?: HarvestQuality) => {
    switch (quality) {
      case 'excellent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" /> Saveur d'or
          </span>
        );
      case 'good':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
            <Star className="w-3 h-3 text-teal-600" /> Très bonne
          </span>
        );
      case 'average':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
            Standard
          </span>
        );
      case 'poor':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            Moyen
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            Livre des Récoltes & Rendements
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pesez et savourez le fruit de votre travail au fil des saisons.
          </p>
        </div>
        <button
          onClick={onOpenAddHarvest}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Enregistrer une récolte
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Poids total récolté
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700">{totalKg.toFixed(2)}</span>
            <span className="text-sm font-semibold text-stone-600">kg</span>
          </div>
          <p className="text-xs text-stone-400 mt-1">Légumes et fruits pesés</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Pièces & Bottes cueillies
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-teal-700">{totalCount}</span>
            <span className="text-sm font-semibold text-stone-600">unités</span>
          </div>
          <p className="text-xs text-stone-400 mt-1">Radis, herbes aromatiques, salades</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Sessions de cueillette
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900">{harvests.length}</span>
            <span className="text-sm font-semibold text-stone-600">paniers</span>
          </div>
          <p className="text-xs text-stone-400 mt-1">Entrées de récolte au total</p>
        </div>
      </div>

      {/* Top Producers Bar */}
      {Object.keys(cropsStats).length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <h3 className="text-sm font-bold text-stone-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Variétés les plus productives
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(cropsStats)
              .sort((a, b) => b[1].totalKg - a[1].totalKg)
              .slice(0, 6)
              .map(([cropName, stats]) => (
                <div
                  key={cropName}
                  className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center gap-2"
                >
                  <span className="font-semibold text-stone-800">{cropName}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                    {stats.totalKg > 0 ? `${stats.totalKg.toFixed(1)} kg` : `${stats.countUnits} pcs`}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Harvests List */}
      {harvests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300 p-8">
          <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">Aucune récolte enregistrée</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            Dès vos premiers légumes ou fruits cueillis, notez le poids et la qualité pour garder l'historique !
          </p>
          <button
            onClick={onOpenAddHarvest}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" /> Enregistrer une récolte
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {harvests.map((harvest) => (
            <div
              key={harvest.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-stone-900">{harvest.plantName}</h3>
                    {harvest.plotName && (
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <Layers className="w-3 h-3" /> {harvest.plotName}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`Supprimer cette récolte de ${harvest.plantName} ?`)) {
                        deleteHarvest(harvest.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Big quantity badge */}
                <div className="mt-4 p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-900">Quantité récoltée</span>
                  <span className="text-xl font-extrabold text-emerald-800">
                    {harvest.quantity} {harvest.unit}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {getQualityBadge(harvest.quality)}
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(harvest.harvestDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                {harvest.notes && (
                  <p className="mt-3 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 italic">
                    "{harvest.notes}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
