import {
  CoupleProfile,
  Album,
  Memory,
  TimelineEvent,
  LoveLetter,
  CalendarEvent,
  DateNightIdea,
  CoupleGoal,
  BucketListItem,
  FutureMemory,
  LoveReason,
  SharedNote,
  SongItem,
  Surprise,
  GuestMessage,
  DailyQuestion,
  ChatMessage
} from '../types';

export const INITIAL_PROFILE: CoupleProfile = {
  partner1Name: 'Farjana Akter',
  partner2Name: 'Md Nasif Kamran',
  partner1Avatar: '/farjana-avatar.jpg',
  partner2Avatar: '/kamran-avatar.jpg',
  weddingDate: '2026-08-24',
  relationshipStartDate: '2019-10-14',
  heroTagline: 'Farjana Akter & Md Nasif Kamran',
  heroQuote: 'Today is not the end of our story. It is the beginning of all the memories we are going to make together.',
  heroImage: '/hero-wedding.jpg',
  coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85',
  location: 'Dhaka, Bangladesh'
};

export const INITIAL_ALBUMS: Album[] = [
  { id: 'alb-1', name: 'Wedding Day', description: 'Our sacred vows & celebration', coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', createdAt: '2026-08-19' },
  { id: 'alb-2', name: 'Engagement', description: 'The magic moment in Paris', coverImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80', createdAt: '2024-05-12' },
  { id: 'alb-3', name: 'Honeymoon Dreams', description: 'Romantic getaway', coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', createdAt: '2026-08-22' },
  { id: 'alb-4', name: 'Our Adventures', description: 'Hiking, road trips & exploring', coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80', createdAt: '2022-09-01' },
  { id: 'alb-5', name: 'Date Nights', description: 'Candlelight dinners & late walks', coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', createdAt: '2021-02-14' },
  { id: 'alb-6', name: 'Random Memories', description: 'Little everyday golden moments', coverImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80', createdAt: '2020-03-10' }
];

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    title: 'Our First Sunset as Husband & Wife',
    caption: 'Standing by the waters at sunset, surrounded by loved ones, holding hands as husband and wife for the very first time.',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    date: '2026-08-19',
    location: 'Dhaka, Bangladesh',
    albumId: 'alb-1',
    tags: ['Wedding', 'Sunset', 'Love', 'Vows'],
    isFavorite: true,
    visibility: 'PUBLIC',
    author: 'Farjana & Nasif',
    createdAt: '2026-08-19T18:00:00Z'
  },
  {
    id: 'mem-2',
    title: 'The Sacred Exchange of Rings',
    caption: '“With this ring, I give you my heart, my soul, and my forever.”',
    imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
    date: '2026-08-19',
    location: 'Grand Ballroom, Dhaka',
    albumId: 'alb-1',
    tags: ['Wedding', 'Rings', 'Ceremony'],
    isFavorite: true,
    visibility: 'PUBLIC',
    author: 'Md Nasif Kamran',
    createdAt: '2026-08-19T16:30:00Z'
  },
  {
    id: 'mem-3',
    title: 'She Said YES Under Eiffel Tower',
    caption: 'Tears of pure joy under the sparkling Paris night sky. The easiest decision of my life.',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
    date: '2024-05-12',
    location: 'Paris, France',
    albumId: 'alb-2',
    tags: ['Engagement', 'Paris', 'Proposal'],
    isFavorite: true,
    visibility: 'PUBLIC',
    author: 'Md Nasif Kamran',
    createdAt: '2024-05-12T21:00:00Z'
  },
  {
    id: 'mem-4',
    title: 'First Coffee Date Laughs',
    caption: 'We talked for 4 straight hours until the cafe closed. I knew right then you were special.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    date: '2019-10-18',
    location: 'Dhanmondi Coffee Shop',
    albumId: 'alb-5',
    tags: ['Date Night', 'First Date', 'Coffee'],
    isFavorite: false,
    visibility: 'COUPLE_ONLY',
    author: 'Farjana Akter',
    createdAt: '2019-10-18T17:00:00Z'
  },
  {
    id: 'mem-5',
    title: 'Beachside Stroll in Cox\'s Bazar',
    caption: 'Soft sea breeze, warm golden sand, and endless waves stretching to the horizon.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    date: '2022-12-10',
    location: 'Cox\'s Bazar',
    albumId: 'alb-4',
    tags: ['Beach', 'Vacation', 'Sea'],
    isFavorite: true,
    visibility: 'PUBLIC',
    author: 'Farjana Akter',
    createdAt: '2022-12-10T11:00:00Z'
  },
  {
    id: 'mem-6',
    title: 'Wedding Reception First Dance',
    caption: 'Floating on air while our favorite song played in the background.',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    date: '2026-08-19',
    location: 'Dhaka Club',
    albumId: 'alb-1',
    tags: ['Wedding', 'Dance', 'Party'],
    isFavorite: true,
    visibility: 'PUBLIC',
    author: 'Farjana & Nasif',
    createdAt: '2026-08-19T20:00:00Z'
  }
];

export const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl-1',
    year: '2019',
    date: '2019-10-14',
    title: 'The First Spark 💫',
    description: 'We met at a university cultural gathering in Dhaka. One shared laugh was all it took.',
    location: 'Dhaka University Campus',
    imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    visibility: 'PUBLIC'
  },
  {
    id: 'tl-2',
    year: '2020',
    date: '2020-02-14',
    title: 'Official First Valentine ❤️',
    description: 'A cozy handwritten card, red roses, and a promise to always stand by each other.',
    location: 'Dhanmondi Lake Park',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    visibility: 'PUBLIC'
  },
  {
    id: 'tl-3',
    year: '2022',
    date: '2022-09-15',
    title: 'First Mountain Adventure 🏔️',
    description: 'We hiked through Sylhet tea gardens in the misty morning. Unforgettable breathtaking vistas.',
    location: 'Sylhet, Bangladesh',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    visibility: 'PUBLIC'
  },
  {
    id: 'tl-4',
    year: '2024',
    date: '2024-05-12',
    title: 'The Dream Proposal 💍',
    description: 'Nasif dropped to one knee overlooking the Eiffel Tower with a sparkling ring.',
    location: 'Paris, France',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    visibility: 'PUBLIC'
  },
  {
    id: 'tl-5',
    year: '2026',
    date: '2026-08-19',
    title: 'Our Wedding Day ❤️',
    description: 'Surrounded by our families and dearest friends, we united our hearts in sacred marriage.',
    location: 'Dhaka, Bangladesh',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    visibility: 'PUBLIC'
  }
];

export const INITIAL_LETTERS: LoveLetter[] = [
  {
    id: 'let-1',
    title: 'To My Soulmate on Our Wedding Morning',
    content: 'My dearest Farjana,\n\nAs I lace up my sherwani this morning, my heart is overflowing with gratitude. From the moment I met you in 2019, you transformed my world into a brighter, softer, and happier place. Today, I promise to cherish you, listen to you, laugh with you, and stand by your side through every joy and storm.\n\nHere is to our forever.\n\nLove always,\nNasif',
    sender: 'partner2',
    recipient: 'partner1',
    date: '2026-08-19',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    isDraft: false,
    visibility: 'COUPLE_ONLY'
  },
  {
    id: 'let-2',
    title: 'Open on Our 1st Anniversary ❤️',
    content: 'My sweet husband Nasif,\n\nIf you are reading this, we have completed our very first full year of marriage! 365 days of warm breakfasts, silly jokes, cozy evening walks, and growing closer together. I hope we are still laughing as hard as we did on our wedding night. I love you more with every passing day.\n\nYour wife,\nFarjana',
    sender: 'partner1',
    recipient: 'partner2',
    date: '2026-08-19',
    unlockDate: '2027-08-19',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    isDraft: false,
    visibility: 'COUPLE_ONLY'
  }
];

export const INITIAL_CALENDAR: CalendarEvent[] = [
  { id: 'cal-1', title: 'Our Wedding Anniversary ❤️', date: '2026-08-19', category: 'anniversary', description: 'Annual celebration of our sacred wedding day vows.' },
  { id: 'cal-2', title: 'Farjana\'s Birthday 🎂', date: '2026-10-24', category: 'birthday', description: 'Plan surprise dinner & baked cake!' },
  { id: 'cal-3', title: 'Nasif\'s Birthday 🎂', date: '2026-12-05', category: 'birthday', description: 'Special celebration & weekend getaway.' },
  { id: 'cal-4', title: 'Honeymoon Maldives Trip ✈️', date: '2026-09-01', category: 'vacation', description: 'Overwater bungalow & snorkeling.' },
  { id: 'cal-5', title: 'Candlelight Date Night 🍽️', date: '2026-08-28', category: 'date_night', description: 'Italian pasta night & phone-free evening.' }
];

export const INITIAL_DATE_IDEAS: DateNightIdea[] = [
  { id: 'di-1', title: 'Phone-Free Dinner & Candlelight', description: 'Turn off all screens, light scented candles, play gentle acoustics, and cook together.', category: 'At Home' },
  { id: 'di-2', title: 'Midnight Stargazing & Hot Cocoa', description: 'Pack a warm blanket, a flask of tea, and lie down under the open stars.', category: 'Romantic' },
  { id: 'di-3', title: 'Random Sunset Drive', description: 'Pick a direction on the map, roll down the windows, and drive to a scenic viewpoint.', category: 'Adventure' },
  { id: 'di-4', title: 'Recreate Our First Coffee Date', description: 'Visit the exact cafe where we had our first coffee and ask each other the same questions!', category: 'Romantic' },
  { id: 'di-5', title: 'Homemade Pizza & Movie Marathon', description: 'Roll dough together, pick crazy toppings, and stream 3 back-to-back nostalgia movies.', category: 'At Home' },
  { id: 'di-6', title: 'Park Picnic & Book Reading', description: 'Pack sandwiches, fresh fruit, and read favorite poetry out loud on the grass.', category: 'Outdoors' }
];

export const INITIAL_GOALS: CoupleGoal[] = [
  { id: 'cg-1', title: 'Visit Japan in Cherry Blossom Season 🌸', description: 'Explore Kyoto temples, Tokyo neon streetscapes, and Mount Fuji.', category: 'Travel', targetYear: '2028', progress: 40, status: 'in_progress', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80' },
  { id: 'cg-2', title: 'Build & Furnish Our Dream Cozy Home 🏠', description: 'Create a sunlit living space with a huge bookshelf and garden balcony.', category: 'Home', targetYear: '2027', progress: 60, status: 'in_progress', imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
  { id: 'cg-3', title: 'Learn Italian Cooking Masterclasses 🍝', description: 'Master hand-rolled pasta, authentic tiramisu, and wood-fired pizza.', category: 'Personal', targetYear: '2026', progress: 25, status: 'in_progress', imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80' }
];

export const INITIAL_BUCKET_LIST: BucketListItem[] = [
  { id: 'bl-1', title: 'Watch a sunset over the ocean together', isCompleted: true, completedDate: '2022-12-10', memoryPhotoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', note: 'Cox\'s Bazar sunset stroll!' },
  { id: 'bl-2', title: 'Take a hot air balloon ride at sunrise', isCompleted: false },
  { id: 'bl-3', title: 'Learn a new dance together for our wedding', isCompleted: true, completedDate: '2026-08-19', memoryPhotoUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
  { id: 'bl-4', title: 'Build our dream home library', isCompleted: false },
  { id: 'bl-5', title: 'Celebrate our 10th anniversary with a vow renewal', isCompleted: false }
];

export const INITIAL_FUTURE_MEMORIES: FutureMemory[] = [
  { id: 'fm-1', title: 'Our First Home 🏠', icon: '🏠', placeholderDescription: 'The keys to our sanctuary where we will build our daily warmth.', isUnlocked: false, targetYear: '2027' },
  { id: 'fm-2', title: 'Our First Anniversary ❤️', icon: '❤️', placeholderDescription: 'One full orbit around the sun as husband and wife.', isUnlocked: false, targetYear: '2027' },
  { id: 'fm-3', title: 'Our First Big Trip ✈️', icon: '✈️', placeholderDescription: 'Flying across oceans into new adventures.', isUnlocked: false, targetYear: '2027' },
  { id: 'fm-4', title: 'Our 5th Anniversary 💍', icon: '💍', placeholderDescription: 'Half a decade of shared milestones and endless love.', isUnlocked: false, targetYear: '2031' }
];

export const INITIAL_LOVE_REASONS: LoveReason[] = [
  { id: 'lr-1', author: 'partner2', reason: 'I love how your eyes crinkle when you laugh at my goofy jokes.', date: '2026-08-19' },
  { id: 'lr-2', author: 'partner1', reason: 'I love the way you always brew hot tea for me when I am tired after work.', date: '2026-08-19' },
  { id: 'lr-3', author: 'partner2', reason: 'I love how compassionate and gentle you are with everyone around you.', date: '2026-08-19' },
  { id: 'lr-4', author: 'partner1', reason: 'I love that you hold my hand tightly even when we are just walking down the street.', date: '2026-08-19' }
];

export const INITIAL_NOTES: SharedNote[] = [
  {
    id: 'sn-1',
    title: 'Things We Need For Our New Home 🛋️',
    content: 'A list of dream items to pick for our cozy apartment balcony and living room.',
    category: 'Home',
    isPinned: true,
    checklistItems: [
      { id: 'c1', text: 'Comfortable oversized lounge sofa', done: true },
      { id: 'c2', text: 'Warm fairy lights for balcony garden', done: true },
      { id: 'c3', text: 'Espresso coffee machine', done: false },
      { id: 'c4', text: 'Framed gallery wall of wedding photos', done: false }
    ],
    updatedAt: '2026-08-20'
  },
  {
    id: 'sn-2',
    title: 'Honeymoon Packing List 🏝️',
    content: 'Don\'t forget passports, camera gear, and sun protection!',
    category: 'Travel',
    isPinned: false,
    checklistItems: [
      { id: 'h1', text: 'Passports & travel documents', done: true },
      { id: 'h2', text: 'Waterproof camera casing', done: false },
      { id: 'h3', text: 'Matching beach outfits', done: true }
    ],
    updatedAt: '2026-08-19'
  }
];

export const INITIAL_SONGS: SongItem[] = [
  { id: 'sg-1', title: 'Perfect', artist: 'Ed Sheeran', category: 'Our Song', linkUrl: 'https://spotify.com', albumCover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80' },
  { id: 'sg-2', title: 'A Thousand Years', artist: 'Christina Perri', category: 'Wedding Songs', linkUrl: 'https://spotify.com', albumCover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80' },
  { id: 'sg-3', title: 'Can\'t Help Falling in Love', artist: 'Elvis Presley', category: 'Wedding Songs', linkUrl: 'https://spotify.com', albumCover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80' }
];

export const INITIAL_SURPRISES: Surprise[] = [
  {
    id: 'sur-1',
    sender: 'partner2',
    recipient: 'partner1',
    title: 'A Little Secret Date Invitation 🌹',
    surpriseType: 'date_invitation',
    content: 'Get ready by 7:00 PM tonight! I booked a candlelit roof terrace dinner overlooking the city lights. Wear your favorite dress!',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    unlockDate: '2026-08-20',
    isOpened: false
  }
];

export const INITIAL_GUEST_MESSAGES: GuestMessage[] = [
  {
    id: 'gm-1',
    authorName: 'AMMU & ABBU',
    relationship: 'Parents',
    message: 'Wishing you both a lifetime of happiness, patience and laughter.',
    date: '2026-08-19',
    status: 'approved',
    isPinned: true
  },
  {
    id: 'gm-2',
    authorName: 'TANVIR',
    relationship: 'Best Friend',
    message: 'You two make love look easy. Congratulations!',
    date: '2026-08-19',
    status: 'approved',
    isPinned: true
  },
  {
    id: 'gm-3',
    authorName: 'RUMANA',
    relationship: 'Sister',
    message: 'May every year be kinder than the last. So happy for you both.',
    date: '2026-08-19',
    status: 'approved',
    isPinned: true
  }
];

export const DAILY_QUESTIONS: DailyQuestion[] = [
  { id: 'dq-1', questionText: 'What is one moment with me that you’ll never forget?' },
  { id: 'dq-2', questionText: 'What is one place in the world you want us to visit next?' },
  { id: 'dq-3', questionText: 'What makes you feel most loved on ordinary days?' },
  { id: 'dq-4', questionText: 'What is a funny habit of mine that makes you smile?' },
  { id: 'dq-5', questionText: 'What is one new goal we should try together this year?' }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'chat-1',
    sender: 'partner2',
    text: 'Good morning my love ❤️ Can\'t wait to see you tonight!',
    timestamp: '2026-08-20T09:15:00Z',
    reaction: '❤️'
  },
  {
    id: 'chat-2',
    sender: 'partner1',
    text: 'Good morning husband! Don\'t forget we have our sunset walk planned ✨',
    timestamp: '2026-08-20T09:20:00Z',
    reaction: '🌹'
  }
];
