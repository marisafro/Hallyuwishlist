// Local storage utilities for managing app data
import { getUserIdentifier, getUserAgeGroup } from './fingerprint';

export interface Event {
  id: string;
  title: string;
  artist: string;
  date: string;
  venue: string;
  city: string;
  
  image: string;
  description: string;
  capacity: string;
  interestedCount: number;
}

export interface PastConcert {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  city: string;
  venue: string;
  artist?: string;
  type: "concert";
}

export interface PastShow {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  city: string;
  artist?: string;
  type: "reality-show";
}

export interface PastEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  city: string;
  artist?: string;
  venue?: string;
  type: "event";
}

export type AnyEvent = Event | PastConcert | PastShow | PastEvent;

export interface ArtistWish {
  id: string;
  artistName: string;
  votes: number;
  genre: string;
  votesByUser?: Record<string, boolean>; // Track which user IDs voted
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  votesByUser?: Record<string, boolean>; // Track which user IDs voted
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
}

export interface UserInteraction {
  eventId?: string;
  artistId?: string;
  pollId?: string;
  action: 'interested' | 'vote' | 'wishlist';
  timestamp: number;
  city?: string;
  userId?: string; // User fingerprint identifier
  ageGroup?: string; // User age group
}

// Upcoming events data
export const upcomingEvents: Event[] = [
 
   {
    id: "4",
    title: "Choom KPOP FESTIVAL - Thessaloniki",
    artist: "Choom KPOP FESTIVAL",
    date: "2026-03-29",
    venue: "Ioannis Vellidis Convention Center",
    city: "Thessaloniki",
    image: "https://choomkpopfestival.gr/wp-content/uploads/2025/09/choom-logo-homepage.png",
    description: "",
    capacity: "apx. 1500",
    interestedCount: 0,
  },

  {
    id: "3",
    title: "LEVEL10KCONVENTION 2026 Thessaloniki",
    artist: "LEVEL10KCONVENTION",
    date: "2026-06-27",
    venue: "WE",
    city: "Thessaloniki",
    image: "https://iili.io/q48Xv1a.md.png",
    description: "",
    capacity: "apx. 1000",
    interestedCount: 0,
  },
 {
    id: "2",
    title: "TRENDZ",
    artist: "TRENDZ",
    date: "2026-04-08",
    venue: "WE",
    city: "Thessaloniki",
    image: "https://www.more.com/getattachment/ff0c40be-504d-401b-a1d7-a8428bd96e32/TRENDZ-(KR)-FOR-THE-FIRST-TIME-LIVE-IN-THESSA834cd.png ",
    description: "",
    capacity: "apx. 1000",
    interestedCount: 0,
  },
  {
    id: "1",
    title: "LEVEL10KCONVENTION 2026 - Athens ",
    artist: "LEVEL10KCONVENTION",
    date: "2026-08-10",
    venue: "TBA",
    city: "Athens",
    image: "https://iili.io/q4UTnzQ.png",
    description: "",
    capacity: "TBA",
    interestedCount: 0,
  },
  

 ];

// Initialize events in localStorage if not present

export const initializeEvents = () => {
  const stored = localStorage.getItem('events');
  if (!stored) {
    localStorage.setItem('events', JSON.stringify(upcomingEvents));
  }
};

export const getEvents = (): Event[] => {
  initializeEvents();
  const stored = localStorage.getItem('event');
  return stored ? JSON.parse(stored) : upcomingEvents;
};

export const getEvent = (id: string): Event | undefined => {
  const events = getEvents();
  return events.find(e => e.id === id);
};

// Get any event (upcoming or past)
export const getAnyEvent = async (id: string): Promise<AnyEvent | undefined> => {
  // First check upcoming events
  const events = getEvents();
  const upcomingEvent = events.find(e => e.id === id);
  if (upcomingEvent) return upcomingEvent;
  
  // Import past events dynamically to avoid circular dependencies
  const { pastConcerts, pastEvents, pastShows } = await import('../components/events');
  
  // Check past concerts
  const pastConcert = pastConcerts.find(e => e.id === id);
  if (pastConcert) return pastConcert;
  
  // Check past events
  const pastEvent = pastEvents.find(e => e.id === id);
  if (pastEvent) return pastEvent;
  
  // Check past shows
  const pastShow = pastShows.find(e => e.id === id);
  if (pastShow) return pastShow;
  
  return undefined;
};

export const updateEvent = (event: Event) => {
  const events = getEvents();
  const index = events.findIndex(e => e.id === event.id);
  if (index !== -1) {
    events[index] = event;
    localStorage.setItem('events', JSON.stringify(events));
  }
};
/*export function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const allEvents = upcomingEvents(); */
  
// Artist wishlist
export const getArtistWishes = (): ArtistWish[] => {
  const stored = localStorage.getItem('kpop_artist_wishes');
  return stored ? JSON.parse(stored) : [
    { id: "1", artistName: "SEVENTEEN", votes: 0, genre: "Boy Group" },
    { id: "2", artistName: "TXT (Tomorrow X Together)", votes: 0, genre: "Boy Group" },
    { id: "3", artistName: "IVE", votes: 0, genre: "Girl Group" },
    { id: "4", artistName: "ATEEZ", votes: 0, genre: "Boy Group" },
    { id: "5", artistName: "TWICE", votes: 0, genre: "Girl Group" },
    { id: "6", artistName: "BTS", votes: 0, genre: "Boy Group" },
    { id: "7", artistName: "LE SSERAFIM", votes: 0, genre: "Girl Group" },
    { id: "8", artistName: "EXO", votes: 0, genre: "Boy Group" },
    { id: "9", artistName: "STRAY KIDS", votes: 0, genre: "Boy Group" },
    { id: "10", artistName: "aespa", votes: 0, genre: "Girl Group" },
    { id: "11", artistName: "HEARTS2HEARTS", votes: 0, genre: "Girl Group" },
    { id: "12", artistName: "ILLIT", votes: 0, genre: "Girl Group" },
    { id: "13", artistName: "P1HARMONY", votes: 0, genre: "Boy Group" },
    { id: "14", artistName: "DREAMCATCHER", votes: 0, genre: "Girl Group" },
    { id: "15", artistName: "CIX", votes: 0, genre: "Boy Group" },
    { id: "16", artistName: "BTOB", votes: 0, genre: "Boy Group" },
    { id: "17", artistName: "DAY6", votes: 0, genre: "Boy Group" },
    { id: "18", artistName: "JUNNY", votes: 0, genre: "Solo Artist" },
    { id: "19", artistName: "KARD", votes: 0, genre: "Co-ed Group" },
    { id: "20", artistName: "BAEKHYUN", votes: 0, genre: "Solo Artist" },
    { id: "21", artistName: "CHUNGHA", votes: 0, genre: "Solo Artist" },
    { id: "22", artistName: "WOODZ", votes: 0, genre: "Solo Artist" },
    { id: "23", artistName: "THE ROSE", votes: 0, genre: "Boy Group" },
    { id: "24", artistName: "I-DLE", votes: 0, genre: "Girl Group" },
    { id: "25", artistName: "TRENDZ", votes: 0, genre: "Boy Group" },
    { id: "26", artistName: "YOUNGJI", votes: 0, genre: "Solo Artist" },
    
  ];
};

export const addArtistVote = async (artistId: string) => {
  const userId = await getUserIdentifier();
  const wishes = getArtistWishes();
  const artist = wishes.find(a => a.id === artistId);
  if (artist && !artist.votesByUser?.[userId]) {
    artist.votes++;
    if (!artist.votesByUser) {
      artist.votesByUser = {};
    }
    artist.votesByUser[userId] = true;
    localStorage.setItem('kpop_artist_wishes', JSON.stringify(wishes));
    await trackInteraction({
      artistId,
      action: 'wishlist',
      timestamp: Date.now(),
    });
  }
};

export const hasUserVotedForArtist = async (artistId: string): Promise<boolean> => {
  const userId = await getUserIdentifier();
  const wishes = getArtistWishes();
  const artist = wishes.find(a => a.id === artistId);
  return artist?.votesByUser?.[userId] || false;
};

export const addCustomArtist = async (artistName: string, genre: string) => {
  const userId = await getUserIdentifier();
  const wishes = getArtistWishes();
  const newArtist: ArtistWish = {
    id: Date.now().toString(),
    artistName,
    votes: 1,
    genre,
    votesByUser: { [userId]: true },
  };
  wishes.push(newArtist);
  localStorage.setItem('kpop_artist_wishes', JSON.stringify(wishes));
  await trackInteraction({
    artistId: newArtist.id,
    action: 'wishlist',
    timestamp: Date.now(),
  });
};

// Polls
export const getPolls = (): Poll[] => {
  const stored = localStorage.getItem('kpop_polls');
  return stored ? JSON.parse(stored) : [
    {
      id: "1",
      question: "What type of K-pop event would you most like to see in Greece?",
      options: [
        { id: "1a", text: "Large stadium concerts", votes: 0 },
        { id: "1b", text: "Fan meetings", votes: 0 },
        { id: "1c", text: "Multi-day festivals", votes: 0 },
        { id: "1d", text: "Dance Workshops", votes: 0 },
      ],
    },
    {
      id: "2",
      question: "Which Greek city should host more K-pop events?",
      options: [
        { id: "2a", text: "Athens", votes: 0 },
        { id: "2b", text: "Thessaloniki", votes: 0 },
        
      ],
    },
  ];
};

export const votePoll = async (pollId: string, optionId: string) => {
  const userId = await getUserIdentifier();
  const polls = getPolls();
  const poll = polls.find(p => p.id === pollId);
  if (poll) {
    const option = poll.options.find(o => o.id === optionId);
    if (option && !option.votesByUser?.[userId]) {
      option.votes++;
      if (!option.votesByUser) {
        option.votesByUser = {};
      }
      option.votesByUser[userId] = true;
      localStorage.setItem('kpop_polls', JSON.stringify(polls));
      await trackInteraction({
        pollId,
        action: 'vote',
        timestamp: Date.now(),
      });
    }
  }
};

export const hasUserVotedInPoll = async (pollId: string): Promise<boolean> => {
  const userId = await getUserIdentifier();
  const polls = getPolls();
  const poll = polls.find(p => p.id === pollId);
  if (!poll) return false;
  
  return poll.options.some(option => option.votesByUser?.[userId]);
};

// Interest tracking
export const addEventInterest = (eventId: string, city?: string) => {
  const events = getEvents();
  const event = events.find(e => e.id === eventId);
  if (event) {
    event.interestedCount++;
    updateEvent(event);
    trackInteraction({
      eventId,
      action: 'interested',
      timestamp: Date.now(),
      city,
    });
  }
};

export const hasUserShownInterest = (eventId: string): boolean => {
  const key = `interest_${eventId}`;
  return localStorage.getItem(key) === 'true';
};

export const setUserInterest = (eventId: string) => {
  const key = `interest_${eventId}`;
  localStorage.setItem(key, 'true');
};

// User interactions for KPI tracking
export const trackInteraction = (interaction: UserInteraction) => {
  const stored = localStorage.getItem('kpop_interactions');
  const interactions: UserInteraction[] = stored ? JSON.parse(stored) : [];
  interactions.push(interaction);
  localStorage.setItem('kpop_interactions', JSON.stringify(interactions));
};

export const getInteractions = (): UserInteraction[] => {
  const stored = localStorage.getItem('kpop_interactions');
  return stored ? JSON.parse(stored) : [];
};

// Clear all data (for demo purposes)
export const clearAllData = () => {
  localStorage.removeItem('kpop_events');
  localStorage.removeItem('kpop_artist_wishes');
  localStorage.removeItem('kpop_polls');
  localStorage.removeItem('kpop_interactions');
  // Clear interest flags
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('interest_')) {
      localStorage.removeItem(key);
    }
  }
};