// src/components/community/types/index.ts

  export interface Member {
    id: string;
    name: string;
    image: string;
    specialty: string;
    recipesShared: number;
    likesReceived: number;
    helpfulComments: number;
    bio: string;
    badges: string[];
    isOnline?: boolean;
  }
  
  export interface Activity {
    id: string;
    type: 'recipe' | 'comment' | 'like' | 'achievement' | 'follow';
    userId: string;
    userName: string;
    userImage: string;
    content: string;
    timestamp: string;
    likes: number;
    comments: number;
    recipeImage?: string;
    achievement?: string;
    targetUser?: string;
    liked?: boolean;
  }
  
  export interface Challenge {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    participants: number;
    image: string;
    type: 'challenge' | 'event' | 'contest';
    category: string;
    prize?: string;
    difficulty: 'easy' | 'medium' | 'hard';
    status: 'upcoming' | 'active' | 'ended';
    isParticipating?: boolean;
  }
  
  export interface Discussion {
    id: string;
    category: 'Recipe Help' | 'Technique' | 'Equipment' | 'General' | 'Ingredients';
    title: string;
    author: string;
    authorImage: string;
    authorBadge?: string;
    replies: number;
    views: number;
    lastActivity: string;
    solved?: boolean;
    pinned?: boolean;
    tags: string[];
    preview?: string;
  }

  export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'recipes' | 'engagement' | 'expertise' | 'special';
    progress: number;
    total: number;
    level: 'bronze' | 'silver' | 'gold' | 'platinum';
    unlocked: boolean;
    unlockedAt?: string;
  }

  export interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'guide' | 'tutorial' | 'tips' | 'faq';
    category: string;
    author: string;
    authorImage: string;
    likes: number;
    reads: number;
    datePublished: string;
    estimatedReadTime: number;
    featured?: boolean;
    coverImage?: string;
  }

  export interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    totalVotes: number;
    endDate: string;
    author: string;
    authorImage: string;
  }
  
  export interface PollOption {
    id: string;
    text: string;
    votes: number;
  }
  
  export interface RecipeRequest {
    id: string;
    title: string;
    description: string;
    requestedBy: string;
    requestedByImage: string;
    timestamp: string;
    responses: number;
    status: 'open' | 'in-progress' | 'solved';
    category: string;
  }
  
  // Mock Data
  export const mockMembers: Member[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      image: '/api/placeholder/150/150',
      specialty: 'Italian Cuisine',
      recipesShared: 145,
      likesReceived: 2890,
      helpfulComments: 456,
      bio: 'Passionate about bringing authentic Italian flavors to home cooking.',
      badges: ['Top Contributor', 'Recipe Master'],
      isOnline: true
    },
    {
      id: '2',
      name: 'Mike Chen',
      image: '/api/placeholder/150/150',
      specialty: 'Asian Fusion',
      recipesShared: 98,
      likesReceived: 1756,
      helpfulComments: 312,
      bio: 'Exploring the intersection of traditional and modern Asian cuisine.',
      badges: ['Rising Star'],
      isOnline: false
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      image: '/api/placeholder/150/150',
      specialty: 'Mediterranean',
      recipesShared: 167,
      likesReceived: 3102,
      helpfulComments: 528,
      bio: 'Sharing healthy and delicious Mediterranean recipes with a modern twist.',
      badges: ['Healthy Cooking Expert', 'Community Favorite'],
      isOnline: true
    },
    {
      id: '4',
      name: 'David Kim',
      image: '/api/placeholder/150/150',
      specialty: 'Korean BBQ',
      recipesShared: 78,
      likesReceived: 1435,
      helpfulComments: 245,
      bio: 'Making Korean BBQ accessible for home cooks everywhere.',
      badges: ['BBQ Master'],
      isOnline: false
    }
  ];
  
  export const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'recipe',
      userId: '1',
      userName: 'Sarah Johnson',
      userImage: '/api/placeholder/40/40',
      content: 'Authentic Neapolitan Pizza',
      timestamp: '2024-11-20T10:30:00Z',
      likes: 45,
      comments: 12,
      recipeImage: '/api/placeholder/300/200',
      liked: false
    },
    {
      id: '2',
      type: 'achievement',
      userId: '2',
      userName: 'Mike Chen',
      userImage: '/api/placeholder/40/40',
      content: 'Earned the Master Chef badge!',
      timestamp: '2024-11-20T09:15:00Z',
      likes: 28,
      comments: 5,
      achievement: 'Master Chef',
      liked: true
    },
    {
      id: '3',
      type: 'comment',
      userId: '3',
      userName: 'Elena Rodriguez',
      userImage: '/api/placeholder/40/40',
      content: 'This recipe was amazing! I added a bit more garlic and it turned out perfect.',
      timestamp: '2024-11-20T08:45:00Z',
      likes: 15,
      comments: 3,
      liked: false
    },
    {
      id: '4',
      type: 'follow',
      userId: '4',
      userName: 'David Kim',
      userImage: '/api/placeholder/40/40',
      content: 'Started following',
      targetUser: 'Sarah Johnson',
      timestamp: '2024-11-20T08:30:00Z',
      likes: 8,
      comments: 0,
      liked: false
    },
    {
      id: '5',
      type: 'recipe',
      userId: '3',
      userName: 'Elena Rodriguez',
      userImage: '/api/placeholder/40/40',
      content: 'Mediterranean Grilled Vegetables',
      timestamp: '2024-11-20T07:15:00Z',
      likes: 34,
      comments: 8,
      recipeImage: '/api/placeholder/300/200',
      liked: true
    }
  ];
  
  export const mockChallenges: Challenge[] = [
    {
      id: '1',
      title: 'Holiday Cookies Championship',
      description: 'Create your most festive and delicious holiday cookies. Share your unique recipes and win amazing prizes!',
      startDate: '2024-12-01T00:00:00Z',
      endDate: '2024-12-25T23:59:59Z',
      participants: 234,
      image: '/api/placeholder/400/200',
      type: 'contest',
      category: 'Baking',
      prize: '$100 Gift Card',
      difficulty: 'medium',
      status: 'upcoming',
      isParticipating: false
    },
    {
      id: '2',
      title: 'Healthy January Challenge',
      description: 'Start the year right with 30 days of healthy cooking. Share your nutritious recipes and inspire others!',
      startDate: '2025-01-01T00:00:00Z',
      endDate: '2025-01-31T23:59:59Z',
      participants: 156,
      image: '/api/placeholder/400/200',
      type: 'challenge',
      category: 'Healthy Cooking',
      difficulty: 'easy',
      status: 'upcoming',
      isParticipating: true
    },
    {
      id: '3',
      title: 'Virtual Cooking Workshop',
      description: 'Join Chef Michael for a live cooking session. Learn professional techniques and secret recipes!',
      startDate: '2024-11-30T18:00:00Z',
      endDate: '2024-11-30T20:00:00Z',
      participants: 89,
      image: '/api/placeholder/400/200',
      type: 'event',
      category: 'Workshop',
      difficulty: 'medium',
      status: 'upcoming',
      isParticipating: false
    }
  ];

  export const mockDiscussions: Discussion[] = [
    {
      id: '1',
      category: 'Recipe Help',
      title: 'How to achieve the perfect pizza crust?',
      author: 'Sarah Johnson',
      authorImage: '/api/placeholder/40/40',
      authorBadge: 'Expert Baker',
      replies: 28,
      views: 156,
      lastActivity: '2024-11-20T15:45:00Z',
      solved: true,
      tags: ['Pizza', 'Baking', 'Dough'],
      preview: 'I\'ve been trying to get that perfect crispy yet chewy texture...'
    },
    {
      id: '2',
      category: 'Equipment',
      title: 'Best food processor for home kitchen?',
      author: 'Mike Chen',
      authorImage: '/api/placeholder/40/40',
      replies: 15,
      views: 89,
      lastActivity: '2024-11-20T14:30:00Z',
      tags: ['Equipment', 'Recommendations'],
      preview: 'Looking for recommendations for a reliable food processor...'
    },
    {
      id: '3',
      category: 'Technique',
      title: 'Mastering knife skills - Tips and tricks',
      author: 'Elena Rodriguez',
      authorImage: '/api/placeholder/40/40',
      authorBadge: 'Professional Chef',
      replies: 42,
      views: 230,
      lastActivity: '2024-11-20T12:15:00Z',
      pinned: true,
      tags: ['Skills', 'Basics', 'Tutorial'],
      preview: 'Here are some essential knife techniques every cook should know...'
    },
    {
      id: '4',
      category: 'Ingredients',
      title: 'Substitute for buttermilk?',
      author: 'David Kim',
      authorImage: '/api/placeholder/40/40',
      replies: 12,
      views: 76,
      lastActivity: '2024-11-20T10:00:00Z',
      solved: true,
      tags: ['Substitutions', 'Baking'],
      preview: 'What can I use instead of buttermilk in recipes?'
    }
  ];

  export const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: 'Recipe Master',
      description: 'Share your culinary creativity with the community',
      icon: 'ChefHat',
      category: 'recipes',
      progress: 75,
      total: 100,
      level: 'gold',
      unlocked: false
    },
    {
      id: '2',
      title: 'Helpful Critic',
      description: 'Leave thoughtful reviews and comments',
      icon: 'MessageSquare',
      category: 'engagement',
      progress: 50,
      total: 50,
      level: 'silver',
      unlocked: true,
      unlockedAt: '2024-11-15T10:30:00Z'
    },
    {
      id: '3',
      title: 'Community Leader',
      description: 'Help others and engage with the community',
      icon: 'Users',
      category: 'engagement',
      progress: 120,
      total: 150,
      level: 'platinum',
      unlocked: false
    },
    {
      id: '4',
      title: 'Photography Pro',
      description: 'Share beautiful food photography',
      icon: 'Camera',
      category: 'expertise',
      progress: 25,
      total: 50,
      level: 'bronze',
      unlocked: false
    }
  ];

  export const mockResources: Resource[] = [
    {
      id: '1',
      title: 'Essential Kitchen Tools Guide',
      description: 'A comprehensive guide to must-have kitchen tools for every home cook.',
      type: 'guide',
      category: 'Equipment',
      author: 'Sarah Johnson',
      authorImage: '/api/placeholder/40/40',
      likes: 245,
      reads: 1289,
      datePublished: '2024-11-15T10:30:00Z',
      estimatedReadTime: 8,
      featured: true,
      coverImage: '/api/placeholder/300/200'
    },
    {
      id: '2',
      title: 'Knife Skills 101',
      description: 'Learn the basic cutting techniques every cook should know.',
      type: 'tutorial',
      category: 'Basics',
      author: 'Mike Chen',
      authorImage: '/api/placeholder/40/40',
      likes: 189,
      reads: 876,
      datePublished: '2024-11-14T15:45:00Z',
      estimatedReadTime: 12
    },
    {
      id: '3',
      title: 'Food Photography Tips',
      description: 'Take better photos of your culinary creations with these simple tips.',
      type: 'tips',
      category: 'Photography',
      author: 'Elena Rodriguez',
      authorImage: '/api/placeholder/40/40',
      likes: 156,
      reads: 654,
      datePublished: '2024-11-13T09:20:00Z',
      estimatedReadTime: 6,
      featured: true,
      coverImage: '/api/placeholder/300/200'
    },
    {
      id: '4',
      title: 'Common Cooking FAQs',
      description: 'Answers to the most frequently asked cooking questions.',
      type: 'faq',
      category: 'General',
      author: 'David Kim',
      authorImage: '/api/placeholder/40/40',
      likes: 134,
      reads: 987,
      datePublished: '2024-11-12T14:10:00Z',
      estimatedReadTime: 10
    }
  ];

  export const mockPolls: Poll[] = [
    {
      id: '1',
      question: 'What\'s your favorite cooking method?',
      options: [
        { id: 'a', text: 'Grilling', votes: 45 },
        { id: 'b', text: 'Baking', votes: 32 },
        { id: 'c', text: 'Stir-frying', votes: 28 },
        { id: 'd', text: 'Slow cooking', votes: 38 }
      ],
      totalVotes: 143,
      endDate: '2024-12-01T00:00:00Z',
      author: 'Sarah Johnson',
      authorImage: '/api/placeholder/40/40'
    }
  ];
  
  export const mockRecipeRequests: RecipeRequest[] = [
    {
      id: '1',
      title: 'Authentic Thai Green Curry',
      description: 'Looking for a traditional Thai green curry recipe. Preferably with homemade curry paste!',
      requestedBy: 'Mike Chen',
      requestedByImage: '/api/placeholder/40/40',
      timestamp: '2024-11-20T10:30:00Z',
      responses: 3,
      status: 'open',
      category: 'Asian'
    },
    {
      id: '2',
      title: 'Gluten-free Pizza Dough',
      description: 'Need a good recipe for crispy gluten-free pizza dough that doesn\'t fall apart.',
      requestedBy: 'Elena Rodriguez',
      requestedByImage: '/api/placeholder/40/40',
      timestamp: '2024-11-19T15:45:00Z',
      responses: 5,
      status: 'in-progress',
      category: 'Baking'
    }
  ];