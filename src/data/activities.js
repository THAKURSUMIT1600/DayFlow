// Available activities for weekend planning
export const ACTIVITY_CATEGORIES = {
  FOOD: "food",
  OUTDOOR: "outdoor",
  INDOOR: "indoor",
  SOCIAL: "social",
  WELLNESS: "wellness",
  ENTERTAINMENT: "entertainment",
  CREATIVE: "creative",
  LEARNING: "learning",
};

export const MOODS = {
  RELAXED: "relaxed",
  ENERGETIC: "energetic",
  SOCIAL: "social",
  ADVENTUROUS: "adventurous",
  PEACEFUL: "peaceful",
  PRODUCTIVE: "productive",
};

export const TIME_SLOTS = {
  MORNING: "morning",
  AFTERNOON: "afternoon",
  EVENING: "evening",
  NIGHT: "night",
};

export const DEFAULT_ACTIVITIES = [
  // Food Activities
  {
    id: "brunch-1",
    name: "Brunch at Cafe",
    category: ACTIVITY_CATEGORIES.FOOD,
    duration: 120, // minutes
    mood: MOODS.SOCIAL,
    description: "Enjoy a leisurely brunch with friends",
    icon: "🥐",
    preferredTimeSlot: TIME_SLOTS.MORNING,
  },
  {
    id: "cooking-1",
    name: "Cook Special Dinner",
    category: ACTIVITY_CATEGORIES.FOOD,
    duration: 180,
    mood: MOODS.PRODUCTIVE,
    description: "Try a new recipe and cook something special",
    icon: "👨‍🍳",
    preferredTimeSlot: TIME_SLOTS.EVENING,
  },
  {
    id: "coffee-1",
    name: "Coffee Shop Visit",
    category: ACTIVITY_CATEGORIES.FOOD,
    duration: 90,
    mood: MOODS.RELAXED,
    description: "Visit a cozy coffee shop",
    icon: "☕",
    preferredTimeSlot: TIME_SLOTS.AFTERNOON,
  },

  // Outdoor Activities
  {
    id: "hiking-1",
    name: "Nature Hiking",
    category: ACTIVITY_CATEGORIES.OUTDOOR,
    duration: 240,
    mood: MOODS.ADVENTUROUS,
    description: "Explore nature trails and enjoy fresh air",
    icon: "🥾",
    preferredTimeSlot: TIME_SLOTS.MORNING,
  },
  {
    id: "park-1",
    name: "Park Picnic",
    category: ACTIVITY_CATEGORIES.OUTDOOR,
    duration: 150,
    mood: MOODS.PEACEFUL,
    description: "Relax with a picnic in the park",
    icon: "🧺",

    preferredTimeSlot: TIME_SLOTS.AFTERNOON,
  },
  {
    id: "cycling-1",
    name: "Bike Ride",
    category: ACTIVITY_CATEGORIES.OUTDOOR,
    duration: 120,
    mood: MOODS.ENERGETIC,
    description: "Go for a refreshing bike ride",
    icon: "🚴‍♀️",
    preferredTimeSlot: TIME_SLOTS.MORNING,
  },

  // Indoor Activities
  {
    id: "reading-1",
    name: "Reading Session",
    category: ACTIVITY_CATEGORIES.INDOOR,
    duration: 120,
    mood: MOODS.PEACEFUL,
    description: "Dive into a good book",
    icon: "📚",
    preferredTimeSlot: TIME_SLOTS.AFTERNOON,
  },
  {
    id: "gaming-1",
    name: "Video Gaming",
    category: ACTIVITY_CATEGORIES.INDOOR,
    duration: 180,
    mood: MOODS.ENERGETIC,
    description: "Play your favorite video games",
    icon: "🎮",
    preferredTimeSlot: TIME_SLOTS.EVENING,
  },
  {
    id: "cleaning-1",
    name: "Home Organization",
    category: ACTIVITY_CATEGORIES.INDOOR,
    duration: 120,
    mood: MOODS.PRODUCTIVE,
    description: "Organize and clean your living space",
    icon: "🧹",
    preferredTimeSlot: TIME_SLOTS.MORNING,
  },

  // Social Activities
  {
    id: "friends-1",
    name: "Meet Friends",
    category: ACTIVITY_CATEGORIES.SOCIAL,
    duration: 180,
    mood: MOODS.SOCIAL,
    description: "Catch up with friends",
    icon: "👥",
    preferredTimeSlot: TIME_SLOTS.EVENING,
  },
  {
    id: "family-1",
    name: "Family Time",
    category: ACTIVITY_CATEGORIES.SOCIAL,
    duration: 240,
    mood: MOODS.SOCIAL,
    description: "Spend quality time with family",
    icon: "👨‍👩‍👧‍👦",
    preferredTimeSlot: TIME_SLOTS.AFTERNOON,
  },

  // Wellness Activities
  {
    id: "yoga-1",
    name: "Yoga Session",
    category: ACTIVITY_CATEGORIES.WELLNESS,
    duration: 60,
    mood: MOODS.PEACEFUL,
    description: "Practice yoga for mind and body wellness",
    icon: "🧘‍♀️",
    preferredTimeSlot: TIME_SLOTS.MORNING,
  },
  {
    id: "spa-1",
    name: "Home Spa Day",
    category: ACTIVITY_CATEGORIES.WELLNESS,
    duration: 180,
    mood: MOODS.RELAXED,
    description: "Pamper yourself with a relaxing spa session",
    icon: "🛁",
    preferredTimeSlot: TIME_SLOTS.AFTERNOON,
  },
  {
    id: "meditation-1",
    name: "Meditation",
    category: ACTIVITY_CATEGORIES.WELLNESS,
    duration: 30,
    mood: MOODS.PEACEFUL,
    description: "Practice mindfulness and meditation",
    icon: "🕯️",
    preferredTimeSlot: TIME_SLOTS.MORNING,
  },

  // Entertainment Activities
  {
    id: "movie-1",
    name: "Movie Night",
    category: ACTIVITY_CATEGORIES.ENTERTAINMENT,
    duration: 150,
    mood: MOODS.RELAXED,
    description: "Watch a movie at home or cinema",
    icon: "🎬",

    preferredTimeSlot: TIME_SLOTS.EVENING,
  },
  {
    id: "music-1",
    name: "Live Music",
    category: ACTIVITY_CATEGORIES.ENTERTAINMENT,
    duration: 180,
    mood: MOODS.ENERGETIC,
    description: "Attend a concert or music event",
    icon: "🎵",
    preferredTimeSlot: TIME_SLOTS.EVENING,
  },
  {
    id: "podcast-1",
    name: "Podcast Listening",
    category: ACTIVITY_CATEGORIES.ENTERTAINMENT,
    duration: 60,
    mood: MOODS.RELAXED,
    description: "Listen to interesting podcasts",
    icon: "🎧",
    preferredTimeSlot: TIME_SLOTS.AFTERNOON,
  },

  // Creative Activities
  {
    id: "painting-1",
    name: "Painting/Drawing",
    category: ACTIVITY_CATEGORIES.CREATIVE,
    duration: 120,
    mood: MOODS.PEACEFUL,
    description: "Express creativity through art",
    icon: "🎨",
    preferredTimeSlot: TIME_SLOTS.AFTERNOON,
  },
  {
    id: "writing-1",
    name: "Creative Writing",
    category: ACTIVITY_CATEGORIES.CREATIVE,
    duration: 90,
    mood: MOODS.PRODUCTIVE,
    description: "Write stories, poems, or journal entries",
    icon: "✍️",
    preferredTimeSlot: TIME_SLOTS.AFTERNOON,
  },
  {
    id: "photography-1",
    name: "Photography Walk",
    category: ACTIVITY_CATEGORIES.CREATIVE,
    duration: 120,
    mood: MOODS.ADVENTUROUS,
    description: "Capture beautiful moments through photography",
    icon: "📸",
    preferredTimeSlot: TIME_SLOTS.MORNING,
  },

  // Learning Activities
  {
    id: "course-1",
    name: "Online Course",
    category: ACTIVITY_CATEGORIES.LEARNING,
    duration: 120,
    mood: MOODS.PRODUCTIVE,
    description: "Learn something new through online courses",
    icon: "💻",
    preferredTimeSlot: TIME_SLOTS.AFTERNOON,
  },
  {
    id: "language-1",
    name: "Language Practice",
    category: ACTIVITY_CATEGORIES.LEARNING,
    duration: 60,
    mood: MOODS.PRODUCTIVE,
    description: "Practice a new language",
    icon: "🗣️",
    preferredTimeSlot: TIME_SLOTS.MORNING,
  },
  {
    id: "documentary-1",
    name: "Educational Documentary",
    category: ACTIVITY_CATEGORIES.LEARNING,
    duration: 90,
    mood: MOODS.RELAXED,
    description: "Watch educational documentaries",
    icon: "📺",
    preferredTimeSlot: TIME_SLOTS.EVENING,
  },
];

export const CATEGORY_COLORS = {
  [ACTIVITY_CATEGORIES.FOOD]: "#FF6B6B",
  [ACTIVITY_CATEGORIES.OUTDOOR]: "#4ECDC4",
  [ACTIVITY_CATEGORIES.INDOOR]: "#45B7D1",
  [ACTIVITY_CATEGORIES.SOCIAL]: "#96CEB4",
  [ACTIVITY_CATEGORIES.WELLNESS]: "#FFEAA7",
  [ACTIVITY_CATEGORIES.ENTERTAINMENT]: "#DDA0DD",
  [ACTIVITY_CATEGORIES.CREATIVE]: "#98D8C8",
  [ACTIVITY_CATEGORIES.LEARNING]: "#F7DC6F",
};

export const MOOD_COLORS = {
  [MOODS.RELAXED]: "#81C784",
  [MOODS.ENERGETIC]: "#FF7043",
  [MOODS.SOCIAL]: "#42A5F5",
  [MOODS.ADVENTUROUS]: "#FFA726",
  [MOODS.PEACEFUL]: "#9575CD",
  [MOODS.PRODUCTIVE]: "#66BB6A",
};
