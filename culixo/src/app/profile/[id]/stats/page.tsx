// src/app/profile/[id]/stats/page.tsx
import CookingStats from "@/components/profile/CookingStats";

export default async function StatsPage({
  params,
}: {
  params: { id: string };
}) {
  // Mock data - replace with actual API call
  const stats = {
    totalRecipes: 48,
    totalLikes: 1567,
    totalSaves: 892,
    cuisineDistribution: [],
    difficultyDistribution: [],
    cookingTimeDistribution: []
  }; // Fetch stats

  return (
    <div className="animate-fade-in-up">
      <CookingStats stats={stats} />
    </div>
  );
}