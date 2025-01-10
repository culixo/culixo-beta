// server/models/recipes/listModel.js
const db = require('../../config/db');

const ListModel = {
    getUserRecipesByUserId: async (userId, currentUserId = null) => {
      try {
        const query = `
          SELECT 
            r.*,
            u.full_name as author_name,
            u.avatar_url as author_avatar,
            COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id), 0) as likes_count,
            COALESCE((SELECT COUNT(*) FROM recipe_saves WHERE recipe_id = r.id), 0) as saves_count,
            ${currentUserId ? `
              EXISTS(SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = $2) as has_liked,
              EXISTS(SELECT 1 FROM recipe_saves WHERE recipe_id = r.id AND user_id = $2) as has_saved
            ` : 'false as has_liked, false as has_saved'}
          FROM recipes r
          LEFT JOIN users u ON r.user_id = u.id
          WHERE r.user_id = $1
          ORDER BY r.created_at DESC
        `;
      
        const result = await db.query(query, currentUserId ? [userId, currentUserId] : [userId]);
        return result.rows;
      } catch (error) {
        console.error('Error in getUserRecipesByUserId:', error);
        throw error;
      }
    },

    getAllRecipes: async ({ page = 1, limit = 12, sortBy = 'Newest First', userId = null }) => {
        try {
          const offset = (page - 1) * limit;
          
          const validSortFields = {
            'Newest First': 'r.created_at',
            'Cooking Time': '(r.prep_time + r.cook_time)',
            'Quick Recipes': '(r.prep_time + r.cook_time)',
            'Difficulty Level': 'r.difficulty_level'
          };
      
          const sortField = validSortFields[sortBy] || 'r.created_at';
      
          const query = `
            SELECT 
              r.*,
              u.full_name as author_name,
              u.avatar_url as author_avatar,
              (r.prep_time + r.cook_time) as total_time,
              COUNT(*) OVER() as total_count,
              COALESCE(
                (SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id),
                0
              ) as likes_count,
              COALESCE(
                (SELECT COUNT(*) FROM recipe_saves WHERE recipe_id = r.id),
                0
              ) as saves_count,
              ${userId ? `
                EXISTS(SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = $3) as has_liked,
                EXISTS(SELECT 1 FROM recipe_saves WHERE recipe_id = r.id AND user_id = $3) as has_saved
              ` : 'false as has_liked, false as has_saved'}
            FROM recipes r
            LEFT JOIN users u ON r.user_id = u.id
            ORDER BY ${sortField} DESC
            LIMIT $1 OFFSET $2
          `;
          const values = userId ? [limit, offset, userId] : [limit, offset];
          const result = await db.query(query, values);
          
          const recipes = result.rows;
          const totalRecipes = recipes.length > 0 ? parseInt(recipes[0].total_count) : 0;
          const totalPages = Math.ceil(totalRecipes / limit);
      
          return {
            recipes: recipes.map(recipe => ({
              ...recipe,
              id: recipe.id,
              title: recipe.title,
              description: recipe.description,
              difficulty_level: recipe.difficulty_level,
              prep_time: recipe.prep_time,
              cook_time: recipe.cook_time,
              likes_count: parseInt(recipe.likes_count) || 0,
              saves_count: parseInt(recipe.saves_count) || 0,
              has_liked: !!recipe.has_liked,
              has_saved: !!recipe.has_saved,
              media: recipe.media,
              author: {
                id: recipe.user_id,
                full_name: recipe.author_name,
                avatar_url: recipe.author_avatar
              },
              created_at: recipe.created_at
            })),
            pagination: {
              currentPage: page,
              totalPages,
              totalRecipes,
              hasNextPage: page < totalPages,
              hasPreviousPage: page > 1
            }
          };
        } catch (error) {
          console.error('Error in getAllRecipes:', error);
          throw error;
        }
    },

    getFilteredRecipes: async ({ filters = [], page = 1, limit = 12, userId = null }) => {
      try {
          const offset = (page - 1) * limit;

          let query = `
              SELECT 
                  r.*,
                  u.full_name as author_name,
                  u.avatar_url as author_avatar,
                  (r.prep_time + r.cook_time) as total_time,
                  COUNT(*) OVER() as total_count,
                  COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id), 0) as likes_count,
                  COALESCE((SELECT COUNT(*) FROM recipe_saves WHERE recipe_id = r.id), 0) as saves_count,
                  ${userId ? `
                      EXISTS(SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = $1) as has_liked,
                      EXISTS(SELECT 1 FROM recipe_saves WHERE recipe_id = r.id AND user_id = $1) as has_saved
                  ` : 'false as has_liked, false as has_saved'}
              FROM recipes r
              LEFT JOIN users u ON r.user_id = u.id
              WHERE 1=1
          `;

          const queryParams = userId ? [userId] : [];
          let paramCounter = queryParams.length + 1;

          // Apply filters
          filters.forEach(filter => {
              switch (filter.type) {
                  case 'cuisine':
                      query += ` AND r.cuisine_type = $${paramCounter}`;
                      queryParams.push(filter.value);
                      paramCounter++;
                      break;
                  case 'diet':
                    query += ` AND r.diet_category = $${paramCounter}`;
                    queryParams.push(filter.value);
                    paramCounter++;
                    break;
                  case 'mealType':
                    query += ` AND r.course_type = $${paramCounter}`;
                    queryParams.push(filter.value);
                    paramCounter++;
                    break;
                  case 'cookingTime':
                    // Handle total cooking time ranges (prep_time + cook_time)
                    const timeRanges = {
                      'Under 15 mins': [0, 15],
                      '15-30 mins': [15, 30],
                      '30-45 mins': [30, 45],
                      '45-60 mins': [45, 60],
                      '1-2 hours': [60, 120],
                      'Over 2 hours': [120, 999999]
                    };
                    const [min, max] = timeRanges[filter.value];
                    query += ` AND (r.prep_time + r.cook_time) BETWEEN $${paramCounter} AND $${paramCounter + 1}`;
                    queryParams.push(min, max);
                    paramCounter += 2;
                    break;
                  case 'difficulty':
                    query += ` AND r.difficulty_level = $${paramCounter}`;
                    queryParams.push(filter.value);
                    paramCounter++;
                    break;
              }
          });

          query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
          queryParams.push(limit, offset);

          const result = await db.query(query, queryParams);
          const recipes = result.rows;
          const totalRecipes = recipes.length > 0 ? parseInt(recipes[0].total_count) : 0;
          const totalPages = Math.ceil(totalRecipes / limit);

          return {
              recipes,
              pagination: {
                  currentPage: page,
                  totalPages,
                  totalRecipes,
                  hasNextPage: page < totalPages,
                  hasPreviousPage: page > 1
              }
          };
      } catch (error) {
          console.error('Error in getFilteredRecipes:', error);
          throw error;
      }
    },

    searchRecipes: async ({ searchQuery, page = 1, limit = 12, userId = null }) => {
      try {
          const offset = (page - 1) * limit;
          
          const query = `
              SELECT 
                  r.*,
                  u.full_name as author_name,
                  u.avatar_url as author_avatar,
                  (r.prep_time + r.cook_time) as total_time,
                  COUNT(*) OVER() as total_count,
                  COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id), 0) as likes_count,
                  COALESCE((SELECT COUNT(*) FROM recipe_saves WHERE recipe_id = r.id), 0) as saves_count,
                  ${userId ? `
                      EXISTS(SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = $1) as has_liked,
                      EXISTS(SELECT 1 FROM recipe_saves WHERE recipe_id = r.id AND user_id = $1) as has_saved
                  ` : 'false as has_liked, false as has_saved'}
              FROM recipes r
              LEFT JOIN users u ON r.user_id = u.id
              WHERE to_tsvector('english', 
                  r.title || ' ' || 
                  COALESCE(r.description, '') || ' ' || 
                  r.cuisine_type || ' ' || 
                  r.course_type
              ) @@ plainto_tsquery('english', $${userId ? '2' : '1'})
              ORDER BY created_at DESC
              LIMIT $${userId ? '3' : '2'} OFFSET $${userId ? '4' : '3'}
          `;

          const queryParams = userId 
              ? [userId, searchQuery, limit, offset]
              : [searchQuery, limit, offset];

          const result = await db.query(query, queryParams);
          const recipes = result.rows;
          const totalRecipes = recipes.length > 0 ? parseInt(recipes[0].total_count) : 0;
          const totalPages = Math.ceil(totalRecipes / limit);

          return {
              recipes,
              pagination: {
                  currentPage: page,
                  totalPages,
                  totalRecipes,
                  hasNextPage: page < totalPages,
                  hasPreviousPage: page > 1
              }
          };
      } catch (error) {
          console.error('Error in searchRecipes:', error);
          throw error;
      }
    },

    getFeaturedRecipes: async (userId = null) => {
      try {
          const query = `
              SELECT 
                  r.*,
                  u.full_name as author_name,
                  u.avatar_url as author_avatar,
                  (r.prep_time + r.cook_time) as total_time,
                  COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id), 0) as likes_count,
                  COALESCE((SELECT COUNT(*) FROM recipe_saves WHERE recipe_id = r.id), 0) as saves_count,
                  ${userId ? `
                      EXISTS(SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = $1) as has_liked,
                      EXISTS(SELECT 1 FROM recipe_saves WHERE recipe_id = r.id AND user_id = $1) as has_saved
                  ` : 'false as has_liked, false as has_saved'}
              FROM recipes r
              LEFT JOIN users u ON r.user_id = u.id
              WHERE r.likes_count >= 5
              ORDER BY r.created_at DESC
              LIMIT 6
          `;

          const result = await db.query(query, userId ? [userId] : []);
          return result.rows;
      } catch (error) {
          console.error('Error in getFeaturedRecipes:', error);
          throw error;
      }
    }
};

module.exports = ListModel;