import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, MapPin, Users, Search, Filter, PlayCircle, History, Heart, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { getEvents, type Event } from "../lib/storage";
import { format } from "date-fns";
import { addEventInterest } from "../lib/api";
import { getUserIdentifier } from "../lib/fingerprint";

interface PastConcert {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  city: string;
  venue: string;
  artist?: string;
  capacity: string;
  type: "concert" ;
}

interface PastShow {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  city: string;
  artist?: string;
  type: "reality-show";
}

interface PastEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  city: string;
  artist?: string;
  venue?: string;
  capacity: string;
  type: "event";
}

{/*Past Concert Details*/}
export const pastConcerts: PastConcert[] = [
  
 {
    id: "pastc-5",
    title: "TRENDZ - [ON THE MOVE] Tour (2026)",
    artist: "TRENDZ",
    date: "2026-04-08",
    venue: "WE",
    city: "Thessaloniki",
    image: "https://www.more.com/getattachment/ff0c40be-504d-401b-a1d7-a8428bd96e32/TRENDZ-(KR)-FOR-THE-FIRST-TIME-LIVE-IN-THESSA834cd.png ",
    description: "",
    capacity: "apx. 1000",
    type:"concert",
  },
  {
    id: "pastc-8",
    title: "XLOV - First Full Europe Tour (2026)",
    description: "",
    image: "https://static.wixstatic.com/media/ce89e1_3d5fc49c24924998b71d94760f59872c~mv2.jpg/v1/fill/w_586,h_733,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ce89e1_3d5fc49c24924998b71d94760f59872c~mv2.jpg",
    date: "2026-02-04",
    city: "Athens",
    venue: "UNIVERSE Multivenue",
    capacity: "apx.2000",
    type: "concert",
  },
   {
    id: "pastc-7",
    title: "TRENDZ - GLOW Europe Tour pt. 2 (2025)",
    description: "",
    image: "https://static.wixstatic.com/media/79793c_0bcd804a48c04bbb90a4b4f913e0cf6e~mv2.jpg/v1/fill/w_740,h_925,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/79793c_0bcd804a48c04bbb90a4b4f913e0cf6e~mv2.jpg ",
    date: "2025-11-23",
    city: "Athens",
    venue: "AUX Live Club",
     capacity: "apx.1200",
    type: "concert",
  },
  {
    id: "pastc-6",
    title: "BIG OCEAN - Underwater Tour (2025)",
    description: "",
    image: "https://static.wixstatic.com/media/79793c_7bc86624f39b4a3eacae62f3a7e0804a~mv2.png/v1/fill/w_740,h_926,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/79793c_7bc86624f39b4a3eacae62f3a7e0804a~mv2.png ",
    date: "2025-07-17",
    city: "Athens",
    venue: "AUX Live Club",
    capacity: "apx.1200",
    type: "concert",
  },
  {
    id: "pastc-5",
    title: "TRENDZ - [GLOW] TOUR in Europe (2025)",
    description: "",
    image: "https://static.wixstatic.com/media/79793c_939a367511124b0e8b356eb6c4db0ca3~mv2.jpg/v1/fill/w_740,h_925,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/79793c_939a367511124b0e8b356eb6c4db0ca3~mv2.jpg  ",
    date: "2025-05-30",
    city: "Athens",
    venue: "AUX Live Club",
    capacity: "apx.1200",
    type: "concert",
  },
 {
    id: "pastc-4",
    title: "LUMINOUS - Wonderland in Europe (2023)",
    description: "",
    image: "https://static.wixstatic.com/media/79793c_7b66300e279a4d58a056bf1dca90fa0d~mv2.png/v1/fill/w_597,h_845,al_c,q_90,enc_avif,quality_auto/79793c_7b66300e279a4d58a056bf1dca90fa0d~mv2.png  ",
    date: "2023-10-17",
   city: "Athens",
   venue: "AUX Live Club",
   capacity: "apx.1200",
    type: "concert",
  },
  
{
    id: "pastc-3",
    title: "Jay B 'Tape: Press Pause'Europe Tour (2022)",
    description: "",
    image: "https://preview.redd.it/jay-b-got7-2022-world-tour-tape-press-pause-in-european-v0-1ni7zwna7e4a1.jpg?width=1080&crop=smart&auto=webp&s=5103f9d22dfd25a1a71d2b89ed2ed58dadd16a05  ",
    date: "2023-12-22",
    city: "Athens",
    venue: "FUZZ Live Music Club",
  capacity: "apx.1500",
    type: "concert",
  },
  {
    id: "pastc-2",
    title: "KISU - 'BEYOND ' WORLD TOUR Will Be Fine (2022)",
    description: "",
    image: "https://static.wixstatic.com/media/79793c_8389e3b9809d45f69d74c38fe97183a9~mv2.jpg/v1/fill/w_740,h_1047,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/79793c_8389e3b9809d45f69d74c38fe97183a9~mv2.jpg  ",
    date: "2023-02-20",
    city: "Athens",
    venue: "AUX Live Club",
    capacity: "apx.1200",
    type: "concert",
  },
  {
    id: "pastc-1",
    title: "ALPHABAT - “A Story Not Told” European Tour (2019)",
    description: "",
    image: "https://blank-ent.com/wp-content/uploads/2022/01/athens-new2.png   ",
    date: "2019-12-05",
    city: "Athens",
    venue: "Hollywood Stage",
    capacity: "apx.500",
    type: "concert",
  },
 
];

{/*Past Event Details*/}
export const pastEvents: PastEvent[] = [

  {
    id: "paste-4",
    title: "Choom KPOP FESTIVAL - Thessaloniki",
    artist: "Choom KPOP FESTIVAL",
    date: "2026-03-29",
    venue: "Ioannis Vellidis Convention Center",
    city: "Thessaloniki",
    image: "https://choomkpopfestival.gr/wp-content/uploads/2025/09/choom-logo-homepage.png",
    description: "",
    capacity: "apx. 1500",
    type:"event",
  },
  {
    id: "paste-3",
    title: "LEVEL10KCONVENTION 2025 - Athens",
    description: "",
    image: "https://cityportal.gr/wp-content/uploads/2025/11/K-POP.jpg",
    date: "2025-12-13",
    city: "Athens",
  venue: "The Core Force CrossFit Studio",
    capacity: "apx. 150",
    type: "event",
  },
  {
    id: "paste-2",
    title: "LEVEL10KCONVENTION 2025 - Thessaloniki ",
    description: "",
    image: "https://cityportal.gr/wp-content/uploads/2025/06/tatter.jpg",
    date: "2025-06-28",
    city: "Thessaloniki",
    venue: "WE",
    capacity: "apx. 1000",
    type: "event",
  },
   {
    id: "paste-1",
    title: "LEVEL10KCONVENTION 2024 - Thessaloniki",
    description: "",
    image: "https://iili.io/q4SoT74.md.png",
    date: "2024-05-18",
    city: "Thessaloniki",
    venue: "WE",
    capacity: "apx. 1000",
    type: "event",
  },
];

{/*Past Show Details*/}
export const pastShows: PastShow[] = [
  {
    id: "pasts-3",
    title: "I am Ground (아이엠그라운드 2024)",
    description: "",
    image: "T6j999m6vLA",
    date: "2024",
    city: "Athens",
    type: "reality-show",
  },

   {
    id: "pasts-2",
    title: "Road to Ithaka (이타카로가는길 2023)",
    description: "",
    image: "6D9cq4HJOag",
    date: "2023",
    city: "Thessaloniki",
    type: "reality-show",
  },

  {
    id: "pasts-1",
    title: "Grandpas over flowers (꽃보다 할배 2015)",
    description: "",
    image: "H1TlZBszAlg",
    date: "2015",
    city: "Athens",
    type: "reality-show",
  },
  ];

export function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [interestedEvents, setInterestedEvents] = useState<Set<string>>(new Set());
  const allEvents = getEvents();

  // Load interested events from localStorage on mount
  useEffect(() => {
    const loadInterested = async () => {
      const userId = await getUserIdentifier();
      const stored = localStorage.getItem(`interested_events_${userId}`);
      if (stored) {
        setInterestedEvents(new Set(JSON.parse(stored)));
      }
    };
    loadInterested();
  }, []);

  const handleEventInterest = async (eventId: string) => {
    const userId = await getUserIdentifier();

    // Optimistic update
    setInterestedEvents(prev => {
      const newSet = new Set(prev);
      newSet.add(eventId);
      localStorage.setItem(`interested_events_${userId}`, JSON.stringify(Array.from(newSet)));
      return newSet;
    });

    try {
      await addEventInterest(eventId, userId);
    } catch (error) {
      console.error('Error adding event interest:', error);
      // Revert on error
      setInterestedEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        localStorage.setItem(`interested_events_${userId}`, JSON.stringify(Array.from(newSet)));
        return newSet;
      });
    }
  }; 

  // Combine all events for search and filtering
  const allPastConcerts = pastConcerts.map(e => ({ ...e, artist: e.title, venue: e.venue || "" }));
  const allPastEvents = pastEvents.map(e => ({ ...e, artist: e.title, venue: e.venue || "" }));
  const allPastShows = pastShows.map(e => ({ ...e, artist: e.title, venue: e.venue || "" }));
  
  const combinedSearchableEvents = [
    ...allEvents.map(e => ({ ...e, category: 'upcoming-events' as const })),
    ...allPastConcerts.map(e => ({ ...e, category: 'past-concert' as const })),
    ...allPastEvents.map(e => ({ ...e, category: 'past-event' as const })),
    ...allPastShows.map(e => ({ ...e, category: 'past-show' as const }))
  ];

  // Get unique cities from all events
  const cities = Array.from(new Set(combinedSearchableEvents.map(e => e.city)));

  // Filter upcoming events
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = filterCity === "all" || event.city === filterCity;
    return matchesSearch && matchesCity;
  });

  // Filter past concerts
  const filteredPastConcerts = allPastConcerts.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = filterCity === "all" || event.city === filterCity;
    return matchesSearch && matchesCity;
  });

  // Filter past events
  const filteredPastEvents = allPastEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (event.venue && event.venue.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCity = filterCity === "all" || event.city === filterCity;
    return matchesSearch && matchesCity;
  });

  // Filter past shows
  const filteredPastShows = allPastShows.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = filterCity === "all" || event.city === filterCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative bg-gradient-to-r from-blue-600 via-red-600 to-blue-600 text-white py-20 overflow-hidden">
       {/* Animated background */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.1,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              K-pop Events in Greece
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/90 max-w-2xl mx-auto"
            >
              Browse all upcoming concerts, fan meetings, and exclusive events
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section id="SearchBar" className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl shadow-xl p-6 border border-blue-200"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, artists, or venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="size-5 text-gray-400" />
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-blue-600 to-red-600 p-3 rounded-xl shadow-lg"
            >
              <Calendar className="size-6 text-white" />
            </motion.div>
            <div>
              <h2 id="why" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                Upcoming Events
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} coming soon to Greece
              </p>
            </div>
          </div>
        </motion.div>

        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Calendar className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onInterest={handleEventInterest}
                hasInterest={interestedEvents.has(event.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Past Events */}
   
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-blue-600 to-red-600 p-3 rounded-xl shadow-lg"
            >
              <History className="size-6 text-white" />
            </motion.div>
            <div>
              <h2 id="why" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                Past Events & Highlights
              </h2>
              <p className="text-gray-600 mt-1">
                Some memorable moments from K-pop concerts, events and Korean reality shows in Greece
              </p>
            </div>
          </div>
        </motion.div>
<h3 id="Past" className=" text-3xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                Past Concerts
              </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         
          {filteredPastConcerts.map((event, index) => (
            <PastConcertCard key={event.id} event={event} index={index} />
          ))}
</div>

        <h3 id="Past" className=" text-3xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                Past Events
              </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         
          {filteredPastEvents.map((event, index) => (
            <PastEventCard key={event.id} event={event} index={index} />
          ))}
</div>
         <h3 id="Past" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                Past Shows
              </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             
          {filteredPastShows.map((event, index) => (
            <PastShowCard key={event.id} event={event} index={index} />
          ))}
        </div>
       
      </section>
    </div>
  );
}

function EventCard({
  event,
  index,
  onInterest,
  hasInterest,
}: {
  event: Event;
  index: number;
  onInterest: (eventId: string) => void;
  hasInterest: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-blue-200 h-full flex flex-col">
        <Link to={`/events/${event.id}`} className="group block">
          <div className="relative aspect-[16/9] overflow-hidden">
            <motion.img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-blue-600/20"
            />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-white text-lg font-bold mb-1">{event.artist}</div>
              <div className="text-white/90 text-sm flex items-center gap-2">
                <MapPin className="size-4" />
                {event.venue}
              </div>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
              {event.title}
            </h3>
            <div className="space-y-2 text-sm text-gray-700 mt-auto">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                {format(new Date(event.date), "EEEE, MMMM dd, yyyy")}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                {event.city}
              </div>
            </div>
          </div>
        </Link>
        <div className="px-6 pb-6">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              if (!hasInterest) {
                onInterest(event.id);
              }
            }}
            disabled={hasInterest}
            whileHover={!hasInterest ? { scale: 1.02 } : {}}
            whileTap={!hasInterest ? { scale: 0.98 } : {}}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
              hasInterest
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-red-600 text-white hover:shadow-lg'
            }`}
          >
            {hasInterest ? (
              <>
                <CheckCircle className="size-4" />
                Interested
              </>
            ) : (
              <>
                <Heart className="size-4" />
                I'm Interested
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function PastConcertCard({ event, index }: { event: PastShow; index: number }) {
   return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <Link to={`/events/${event.id}`} className="group block">
        <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-blue-200 h-full flex flex-col">
          <div className="relative aspect-[16/9] overflow-hidden">
            <motion.img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-blue-600/20"
            />
            
            <div className="absolute bottom-4 left-4 right-4">
              
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
              {event.title}
            </h3>
            <div className="space-y-2 text-sm text-gray-700 mt-auto">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                {format(new Date(event.date), "EEEE, MMMM dd, yyyy")}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                {event.city}
              </div>
              
            </div>
            <div className="mt-4 pt-4 border-t border-blue-100">
              <span className="text-blue-600 font-semibold group-hover:underline">
                View Details →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function PastEventCard({ event, index }: { event: PastEvent; index: number }) {
   return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <Link to={`/events/${event.id}`} className="group block">
        <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-blue-200 h-full flex flex-col">
          <div className="relative aspect-[16/9] overflow-hidden">
            <motion.img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-blue-600/20"
            />
            
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-white text-lg font-bold mb-1">{event.artist}</div>
              <div className="text-white/90 text-sm flex items-center gap-2">
                <MapPin className="size-4" />
                {event.venue}
              </div>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
              {event.title}
            </h3>
            <div className="space-y-2 text-sm text-gray-700 mt-auto">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                {format(new Date(event.date), "EEEE, MMMM dd, yyyy")}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                {event.city}
              </div>
              
            </div>
            <div className="mt-4 pt-4 border-t border-blue-100">
              <span className="text-blue-600 font-semibold group-hover:underline">
                View Details →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
function PastShowCard({ event, index }: { event: PastShow; index: number }) {
  // Generate YouTube thumbnail URL from video ID
  const thumbnailUrl = `https://img.youtube.com/vi/${event.image}/maxresdefault.jpg`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <Link to={`/events/${event.id}`} className="group block">
        <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-blue-200 h-full flex flex-col">
          <div className="relative aspect-[16/9] overflow-hidden">
            <motion.img
              src={thumbnailUrl}
              alt={event.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-blue-600/20"
            />
            
            {/* Play button overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <motion.div
                className="bg-red-600 rounded-full p-6 shadow-2xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayCircle className="size-12 text-white fill-white" />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1"
              
            >
              <History className="size-3" />
              Reality Show
            </motion.div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-white text-lg font-bold mb-1">{event.title}</div>
              <div className="text-white/90 text-sm flex items-center gap-2">
                <Calendar className="size-4" />
                {event.date}
              </div>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
              {event.title}
            </h3>
            <div className="space-y-2 text-sm text-gray-700 mt-auto">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                {event.date}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                {event.city}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-100">
              <span className="text-red-600 font-semibold group-hover:underline flex items-center gap-2">
                <PlayCircle className="size-4" />
                Watch on YouTube →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}