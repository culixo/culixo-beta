import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, Flame, Utensils } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';
import { cn } from "@/lib/utils";

const mockStats = {
  mostCooked: [
    { name: "Homemade Pizza", count: 15 },
    { name: "Chicken Curry", count: 12 },
    { name: "Chocolate Cake", count: 8 }
  ],
  cuisineData: [
    { name: "Italian", value: 45, color: "#FF6B6B" },
    { name: "Indian", value: 35, color: "#4ECDC4" },
    { name: "Mexican", value: 20, color: "#45B7D1" }
  ],
  weeklyActivity: [
    { day: "Mon", recipes: 3 },
    { day: "Tue", recipes: 2 },
    { day: "Wed", recipes: 4 },
    { day: "Thu", recipes: 1 },
    { day: "Fri", recipes: 3 },
    { day: "Sat", recipes: 5 },
    { day: "Sun", recipes: 2 }
  ]
};

// Define proper types for the CustomTooltip props
type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
    name?: string;
  }>;
  label?: string;
} & Omit<TooltipProps<number, string>, 'payload'>;

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-background border shadow-md p-2">
        <p className="text-sm">{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function MyKitchenSidebar() {
  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="p-6 space-y-8">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Cooking Statistics</h2>
        </div>

        {/* Weekly Activity */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Weekly Activity
          </h3>
          <div className="w-full">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={mockStats.weeklyActivity}>
                <Bar 
                  dataKey="recipes" 
                  fill="currentColor" 
                  className="fill-primary" 
                  radius={[4, 4, 0, 0]}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'transparent' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Cooked */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Most Cooked
          </h3>
          <div className="space-y-2">
            {mockStats.mostCooked.map((recipe) => (
              <div
                key={recipe.name}
                className={cn(
                  "flex items-center justify-between",
                  "p-3 rounded-lg",
                  "bg-muted/50 hover:bg-muted/80 transition-colors"
                )}
              >
                <span className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-primary" />
                  <span className="font-medium">{recipe.name}</span>
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  {recipe.count}x
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cuisine Distribution */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Cuisine Distribution
          </h3>
          <div className="flex flex-col items-center">
            <div className="w-full h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockStats.cuisineData}
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockStats.cuisineData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              {mockStats.cuisineData.map((cuisine) => (
                <div key={cuisine.name} className="flex items-center gap-1.5">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cuisine.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {cuisine.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Streak */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Streak</span>
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-bold">7 days</span>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}