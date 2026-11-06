export type SunExposure = 'full_sun' | 'partial_shade' | 'full_shade';
export type SoilType = 'clay' | 'sandy' | 'loamy' | 'chalky' | 'potting';
export type PlantCategory = 'vegetable' | 'fruit' | 'herb' | 'flower' | 'legume' | 'other';
export type PlantStatus = 'planned' | 'sown' | 'growing' | 'harvesting' | 'finished';
export type TaskType = 'watering' | 'fertilizing' | 'pruning' | 'weeding' | 'pest_control' | 'sowing' | 'harvesting' | 'other';
export type HarvestUnit = 'kg' | 'g' | 'units' | 'bunches';
export type HarvestQuality = 'excellent' | 'good' | 'average' | 'poor';
export type WeatherType = 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'windy' | 'frost';

export interface Plot {
  id: string;
  userId: string;
  name: string;
  description?: string;
  sunExposure: SunExposure;
  soilType: SoilType;
  areaM2?: number;
  color?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Plant {
  id: string;
  userId: string;
  plotId: string;
  name: string;
  variety?: string;
  category: PlantCategory;
  status: PlantStatus;
  sowingDate?: string;
  plantingDate?: string;
  estimatedHarvestDate?: string;
  wateringFrequencyDays?: number;
  lastWateredDate?: string;
  quantity?: number;
  notes?: string;
  companionGood?: string;
  companionBad?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  userId: string;
  plantId?: string;
  plotId?: string;
  title: string;
  type: TaskType;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Harvest {
  id: string;
  userId: string;
  plantId?: string;
  plantName: string;
  plotName?: string;
  harvestDate: string;
  quantity: number;
  unit: HarvestUnit;
  quality?: HarvestQuality;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  title: string;
  content: string;
  weather?: WeatherType;
  temperature?: number;
  tags?: string;
  createdAt: string;
  updatedAt?: string;
}
