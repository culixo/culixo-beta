export const commonIngredients = [
    { name: 'All-purpose flour', category: 'Baking' },
    { name: 'Sugar', category: 'Baking' },
    { name: 'Salt', category: 'Seasonings' },
    { name: 'Black pepper', category: 'Seasonings' },
    { name: 'Olive oil', category: 'Oils' },
    { name: 'Butter', category: 'Dairy' },
    { name: 'Milk', category: 'Dairy' },
    { name: 'Eggs', category: 'Dairy' },
    { name: 'Onion', category: 'Vegetables' },
    { name: 'Garlic', category: 'Vegetables' },
    { name: 'Tomatoes', category: 'Vegetables' },
    { name: 'Chicken breast', category: 'Meat' },
    { name: 'Ground beef', category: 'Meat' },
    // Add more common ingredients as needed
  ] as const;
  
  export const getIngredientSuggestions = (query: string) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return commonIngredients.filter(ingredient => 
      ingredient.name.toLowerCase().includes(lowerQuery)
    );
  };