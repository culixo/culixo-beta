// src/components/profile/CookingStats.tsx
"use client";

import { CookingStats as CookingStatsType } from "@/types/profile/stats";
import { Card } from "@/components/ui/card";
import { ChefHat, Timer, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface CookingStatsProps {
  stats: CookingStatsType;
  isLoading?: boolean;
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const CookingStats = ({ stats, isLoading }: CookingStatsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="animate-pulse p-6 bg-background-elevated border-border-primary h-[300px]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          icon={ChefHat}
          label="Total Recipes"
          value={stats.totalRecipes}
        />
        <StatsCard
          icon={TrendingUp}
          label="Total Likes"
          value={stats.totalLikes}
        />
        <StatsCard
          icon={Timer}
          label="Total Saves"
          value={stats.totalSaves}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cuisine Distribution */}
        <Card className="p-6 bg-background-elevated border-border-primary">
          <h3 className="text-lg font-semibold mb-6">Cuisine Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.cuisineDistribution}
                  dataKey="count"
                  nameKey="cuisine"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ cuisine }) => cuisine}
                >
                  {stats.cuisineDistribution.map((entry, index) => (
                    <Cell 
                      key={entry.cuisine} 
                      fill={CHART_COLORS[index % CHART_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Difficulty Distribution */}
        <Card className="p-6 bg-background-elevated border-border-primary">
          <h3 className="text-lg font-semibold mb-6">Recipe Difficulty</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.difficultyDistribution}>
                <XAxis dataKey="difficulty" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={CHART_COLORS[0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Cooking Time Distribution */}
        <Card className="p-6 bg-background-elevated border-border-primary lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6">Cooking Time Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.cookingTimeDistribution}>
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={CHART_COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: any; 
  label: string; 
  value: number; 
}) => {
  return (
    <Card className="p-6 bg-background-elevated border-border-primary">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h4 className="text-2xl font-bold mt-1">{value}</h4>
        </div>
        <div className="p-2 bg-primary/10 rounded-full">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </Card>
  );
};

export default CookingStats;