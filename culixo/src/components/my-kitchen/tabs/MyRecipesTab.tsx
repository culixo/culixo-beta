// src/components/my-kitchen/tabs/MyRecipesTab.tsx
import RecipeCard from "../cards/RecipeCard";
import CreateRecipeCard from "../cards/CreateRecipeCard";
import { useCallback } from "react";
import { motion } from "framer-motion";

// Mock data for recipes
const mockRecipes = [
  {
    id: "1",
    title: "Homemade Pizza Margherita",
    image: "/images/recipes/margherita.jpg",
    cookingTime: 45,
    rating: 4.8,
    views: 1250,
    likes: 342,
    dietaryTags: ["Vegetarian", "Italian"],
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15",
    userId: "user1",
  },
  {
    id: "2",
    title: "Chicken Tikka Masala",
    image: "/images/recipes/chicken-tikka.jpg",
    cookingTime: 60,
    rating: 4.9,
    views: 980,
    likes: 256,
    dietaryTags: ["Indian", "Gluten-Free"],
    createdAt: "2024-03-10",
    updatedAt: "2024-03-10",
    userId: "user1",
  },
  // Add more mock recipes as needed
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function MyRecipesTab() {

  const handleEditRecipe = useCallback((id: string) => {
    // Implement edit logic
    console.log("Edit recipe:", id);
  }, []);

  const handleDeleteRecipe = useCallback((id: string) => {
    // Implement delete logic
    console.log("Delete recipe:", id);
  }, []);

  const handleShareRecipe = useCallback((id: string) => {
    // Implement share logic
    console.log("Share recipe:", id);
  }, []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={item}>
          <CreateRecipeCard />
        </motion.div>

        {mockRecipes.map((recipe) => (
          <motion.div key={recipe.id} variants={item}>
            <RecipeCard
              recipe={recipe}
              onEdit={handleEditRecipe}
              onDelete={handleDeleteRecipe}
              onShare={handleShareRecipe}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
