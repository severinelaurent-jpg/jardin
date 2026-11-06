export interface PlantGuide {
  id: string;
  name: string;
  category: 'vegetable' | 'fruit' | 'herb' | 'flower' | 'legume';
  defaultVariety: string;
  wateringFrequencyDays: number;
  daysToHarvest: number;
  sunExposure: 'full_sun' | 'partial_shade' | 'full_shade';
  companionGood: string;
  companionBad: string;
  tips: string;
}

export const VEGETABLE_DATABASE: PlantGuide[] = [
  {
    id: 'tomate',
    name: 'Tomate',
    category: 'vegetable',
    defaultVariety: 'Cœur de Bœuf / Marmande',
    wateringFrequencyDays: 3,
    daysToHarvest: 90,
    sunExposure: 'full_sun',
    companionGood: 'Basilic, Œillet d’Inde, Carotte, Persil',
    companionBad: 'Fenouil, Pomme de terre, Aubergine',
    tips: 'Pincer les gourmands et pailler le pied pour conserver la fraîcheur.'
  },
  {
    id: 'courgette',
    name: 'Courgette',
    category: 'vegetable',
    defaultVariety: 'Verte non coureuse / Ronde de Nice',
    wateringFrequencyDays: 2,
    daysToHarvest: 60,
    sunExposure: 'full_sun',
    companionGood: 'Haricot vert, Maïs, Bourrache, Capucine',
    companionBad: 'Pomme de terre, Concombre',
    tips: 'Arroser au pied sans mouiller les feuilles pour éviter l’oïdium.'
  },
  {
    id: 'carotte',
    name: 'Carotte',
    category: 'vegetable',
    defaultVariety: 'Nantaise améliorée',
    wateringFrequencyDays: 4,
    daysToHarvest: 80,
    sunExposure: 'full_sun',
    companionGood: 'Poireau, Radis, Laitue, Romarin',
    companionBad: 'Aneth, Fenouil, Céleri',
    tips: 'Le poireau repousse la mouche de la carotte et vice-versa.'
  },
  {
    id: 'laitue',
    name: 'Laitue / Salade',
    category: 'vegetable',
    defaultVariety: 'Batavia / Feuille de chêne',
    wateringFrequencyDays: 2,
    daysToHarvest: 45,
    sunExposure: 'partial_shade',
    companionGood: 'Radis, Fraisier, Concombre, Carotte',
    companionBad: 'Persil, Tournesol',
    tips: 'Récolter feuille à feuille ou le cœur le matin pour garder le croquant.'
  },
  {
    id: 'fraisier',
    name: 'Fraisier',
    category: 'fruit',
    defaultVariety: 'Mara des Bois / Gariguette',
    wateringFrequencyDays: 3,
    daysToHarvest: 60,
    sunExposure: 'full_sun',
    companionGood: 'Ail, Épinard, Bourrache, Thym',
    companionBad: 'Chou, Brocoli',
    tips: 'Pailler avec des aiguilles de pin ou paille propre pour protéger les fruits.'
  },
  {
    id: 'basilic',
    name: 'Basilic',
    category: 'herb',
    defaultVariety: 'Grand Vert / Pourpre',
    wateringFrequencyDays: 2,
    daysToHarvest: 30,
    sunExposure: 'full_sun',
    companionGood: 'Tomate, Poivron, Concombre',
    companionBad: 'Rue officinale',
    tips: 'Supprimer les boutons floraux pour stimuler le feuillage aromatique.'
  },
  {
    id: 'haricot',
    name: 'Haricot vert',
    category: 'legume',
    defaultVariety: 'Contender / Mangetout',
    wateringFrequencyDays: 3,
    daysToHarvest: 60,
    sunExposure: 'full_sun',
    companionGood: 'Courgette, Carotte, Fraisier, Pomme de terre',
    companionBad: 'Oignon, Échalote, Ail, Poireau',
    tips: 'Fixe l’azote dans le sol, idéal avant les légumes feuilles.'
  },
  {
    id: 'radis',
    name: 'Radis',
    category: 'vegetable',
    defaultVariety: 'Rond écarlate / 18 jours',
    wateringFrequencyDays: 2,
    daysToHarvest: 25,
    sunExposure: 'partial_shade',
    companionGood: 'Carotte, Laitue, Tomate, Pois',
    companionBad: 'Cerfeuil, Chou',
    tips: 'Arrosage régulier essentiel pour éviter que les radis ne deviennent piquants.'
  },
  {
    id: 'poivron',
    name: 'Poivron / Piment',
    category: 'vegetable',
    defaultVariety: 'Doux d’Espagne / Piment d’Espelette',
    wateringFrequencyDays: 3,
    daysToHarvest: 90,
    sunExposure: 'full_sun',
    companionGood: 'Basilic, Carotte, Marjolaine, Tomate',
    companionBad: 'Fenouil, Chou-rave',
    tips: 'Exige beaucoup de chaleur et un sol meuble bien amendé.'
  },
  {
    id: 'menthe',
    name: 'Menthe',
    category: 'herb',
    defaultVariety: 'Marocaine / Poivrée',
    wateringFrequencyDays: 3,
    daysToHarvest: 20,
    sunExposure: 'partial_shade',
    companionGood: 'Chou, Tomate (éloigne certains ravageurs)',
    companionBad: 'Plantes à racines délicates (la menthe est traçante)',
    tips: 'Planter en pot ou bac délimité pour éviter l’envahissement.'
  },
  {
    id: 'oeillet_inde',
    name: 'Œillet d’Inde',
    category: 'flower',
    defaultVariety: 'Tagète naine',
    wateringFrequencyDays: 4,
    daysToHarvest: 40,
    sunExposure: 'full_sun',
    companionGood: 'Tomate, Aubergine, Pomme de terre',
    companionBad: 'Aucune contre-indication majeure',
    tips: 'Sécrète des substances nématicides qui assainissent le sol du potager.'
  }
];

export const MOCK_INITIAL_PLOTS = [
  {
    name: 'Carré Potager Sud',
    description: 'Bordure sud en plein soleil, sol riche avec compost maison.',
    sunExposure: 'full_sun' as const,
    soilType: 'loamy' as const,
    areaM2: 6,
    color: '#10b981'
  },
  {
    name: 'Serre & Couche Chaude',
    description: 'Serre polycarbonate pour semis précoces et tomates.',
    sunExposure: 'full_sun' as const,
    soilType: 'potting' as const,
    areaM2: 8,
    color: '#06b6d4'
  },
  {
    name: 'Jardinière Aromatiques',
    description: 'Proche de la cuisine, semi-ombragée en fin de journée.',
    sunExposure: 'partial_shade' as const,
    soilType: 'potting' as const,
    areaM2: 2,
    color: '#8b5cf6'
  }
];
