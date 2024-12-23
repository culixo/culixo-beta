"use client";

import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  minerals: {
    iron: number;
    zinc: number;
    calcium: number;
    magnesium: number;
  };
  vitamins: {
    a: number;
    c: number;
    d: number;
    e: number;
    k: number;
    b6: number;
    b12: number;
  };
  servings: number;
}

interface NutritionCardProps {
  nutritionalInfo: NutritionInfo;
}

const NutritionCard = ({ nutritionalInfo }: NutritionCardProps) => {
  const [expanded, setExpanded] = useState(false);

  // Calculate macronutrient percentages
  const totalMacros = 
    nutritionalInfo.protein + 
    nutritionalInfo.carbs + 
    nutritionalInfo.fat;

  const macroPercentages = {
    protein: (nutritionalInfo.protein / totalMacros) * 100,
    carbs: (nutritionalInfo.carbs / totalMacros) * 100,
    fat: (nutritionalInfo.fat / totalMacros) * 100
  };

  const vitaminsData = [
    { name: 'Vitamin A', amount: nutritionalInfo.vitamins.a, unit: 'μg', dailyValue: 900 },
    { name: 'Vitamin C', amount: nutritionalInfo.vitamins.c, unit: 'mg', dailyValue: 90 },
    { name: 'Vitamin D', amount: nutritionalInfo.vitamins.d, unit: 'μg', dailyValue: 20 },
    { name: 'Vitamin E', amount: nutritionalInfo.vitamins.e, unit: 'mg', dailyValue: 15 },
    { name: 'Vitamin K', amount: nutritionalInfo.vitamins.k, unit: 'μg', dailyValue: 120 },
    { name: 'Vitamin B6', amount: nutritionalInfo.vitamins.b6, unit: 'mg', dailyValue: 1.7 },
    { name: 'Vitamin B12', amount: nutritionalInfo.vitamins.b12, unit: 'μg', dailyValue: 2.4 }
  ];

  const mineralsData = [
    { name: 'Iron', amount: nutritionalInfo.minerals.iron, unit: 'mg', dailyValue: 18 },
    { name: 'Zinc', amount: nutritionalInfo.minerals.zinc, unit: 'mg', dailyValue: 11 },
    { name: 'Calcium', amount: nutritionalInfo.minerals.calcium, unit: 'mg', dailyValue: 1000 },
    { name: 'Magnesium', amount: nutritionalInfo.minerals.magnesium, unit: 'mg', dailyValue: 400 }
  ];

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Nutrition Facts</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Calories */}
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-2xl font-bold">{nutritionalInfo.calories}</span>
            <span className="text-muted-foreground">Calories</span>
          </div>
          
          {/* Macronutrient Distribution */}
          <div className="space-y-3">
            <div className="h-2 flex rounded-full overflow-hidden">
              <div 
                className="bg-blue-500" 
                style={{ width: `${macroPercentages.protein}%` }}
              />
              <div 
                className="bg-green-500" 
                style={{ width: `${macroPercentages.carbs}%` }}
              />
              <div 
                className="bg-orange-500" 
                style={{ width: `${macroPercentages.fat}%` }}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <MacroItem
                label="Protein"
                amount={nutritionalInfo.protein}
                color="bg-blue-500"
                percentage={macroPercentages.protein}
              />
              <MacroItem
                label="Carbs"
                amount={nutritionalInfo.carbs}
                color="bg-green-500"
                percentage={macroPercentages.carbs}
              />
              <MacroItem
                label="Fat"
                amount={nutritionalInfo.fat}
                color="bg-orange-500"
                percentage={macroPercentages.fat}
              />
            </div>
          </div>

          {/* Extended Nutrition Information */}
          {expanded && (
            <div className="space-y-6 pt-4 border-t">
              {/* Vitamins */}
              <div className="space-y-3">
                <h4 className="font-medium">Vitamins</h4>
                {vitaminsData.map((vitamin, index) => (
                  <NutrientRow
                    key={index}
                    nutrient={vitamin}
                  />
                ))}
              </div>

              {/* Minerals */}
              <div className="space-y-3">
                <h4 className="font-medium">Minerals</h4>
                {mineralsData.map((mineral, index) => (
                  <NutrientRow
                    key={index}
                    nutrient={mineral}
                  />
                ))}
              </div>

              {/* Fiber */}
              <div className="flex items-center justify-between text-sm">
                <span>Dietary Fiber</span>
                <span>{nutritionalInfo.fiber}g</span>
              </div>
            </div>
          )}

          {/* Servings Info */}
          <div className="text-xs text-muted-foreground pt-2 border-t">
            <p>* Percent Daily Values are based on a {nutritionalInfo.servings}-serving recipe.</p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

const MacroItem = ({ 
  label, 
  amount, 
  color, 
  percentage 
}: { 
  label: string; 
  amount: number; 
  color: string;
  percentage: number;
}) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color}`} />
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">
        {amount}g ({Math.round(percentage)}%)
      </p>
    </div>
  </div>
);

const NutrientRow = ({ 
  nutrient 
}: { 
  nutrient: { 
    name: string; 
    amount: number; 
    unit: string; 
    dailyValue: number;
  }
}) => {
  const percentageOfDV = (nutrient.amount / nutrient.dailyValue) * 100;
  
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        {nutrient.name}
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Daily Value: {nutrient.dailyValue}{nutrient.unit}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-4">
        <Progress 
          value={Math.min(percentageOfDV, 100)} 
          className="w-20"
        />
        <span>
          {nutrient.amount}{nutrient.unit}
        </span>
      </div>
    </div>
  );
};

export default NutritionCard;