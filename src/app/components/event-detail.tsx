import { useParams, Link, useNavigate } from "react-router";
import { Calendar, MapPin, Users, DollarSign, Heart, ArrowLeft, CheckCircle, Sparkles, PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import { getAnyEvent, addEventInterest, hasUserShownInterest, setUserInterest, type AnyEvent, type Event, type PastConcert, type PastEvent, type PastShow } from "../lib/storage";
import { format } from "date-fns";
import { useState, useEffect } from "react";

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<AnyEvent | undefined>(undefined);
  const [isInterested, setIsInterested] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      if (id) {
        const loadedEvent = await getAnyEvent(id);
        setEvent(loadedEvent);
        setIsInterested(hasUserShownInterest(id));
      }
    };
    loadEvent();
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-red-600"
          >
            <ArrowLeft className="size-5" />
            Back to Events
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleInterest = () => {
    if (!isInterested && id) {
      addEventInterest(id, event.city);
      setUserInterest(id);
      setIsInterested(true);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Check if it's an upcoming event (has price and capacity)
  const isUpcomingEvent = 'price' in event && 'capacity' in event;
  // Check if it's a past show (has YouTube video)
  const isPastShow = 'type' in event && event.type === 'reality-show';
  
  // Get image URL (for past shows, use YouTube thumbnail)
  const getImageUrl = () => {
    if (isPastShow) {
      return `https://img.youtube.com/vi/${event.image}/maxresdefault.jpg`;
    }
    return event.image;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <section className="relative h-[60vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          src={getImageUrl()}
          alt={event.title}
          className="w-full h-full object-contain bg-black"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute size-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div whileHover={{ x: -5 }}>
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="size-5" />
                  Back to Events
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block bg-gradient-to-r from-blue-600 to-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4 shadow-lg"
              >
                {event.artist}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold text-white mb-4"
              >
                {event.title}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-6 text-white/90"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="size-5" />
                  {format(new Date(event.date), "EEEE, MMMM dd, yyyy")}
                </div>
                {event.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-5" />
                    {event.venue}, {event.city}
                  </div>
                )}
                {!event.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-5" />
                    {event.city}
                  </div>
                )}
                {isUpcomingEvent && 'interestedCount' in event && (
                  <div className="flex items-center gap-2">
                    <Users className="size-5" />
                    {event.interestedCount} interested
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
             // transition={{ duration: 0.6, delay: 0.2 }}
              //whileHover={{ scale: 1.01 }}
              className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl p-8 shadow-lg border border-blue-200"
            >
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                About This Event
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">{event.description}</p>
              
              <div className="space-y-4">
                {[
                  { icon: Calendar, title: "Date & Time", content: format(new Date(event.date), "EEEE, MMMM dd, yyyy"), color: "blue" },
                  { icon: MapPin, title: "Location", content: event.venue || event.city, subtext: `${event.city}, Greece`, color: "red" },
                  { icon: Users, title: "Capacity", content: isUpcomingEvent && 'capacity' in event ? `${event.capacity.toLocaleString()} attendees` : "TBA", subtext: isUpcomingEvent && 'interestedCount' in event ? `${event.interestedCount} people are interested` : "", color: "blue" },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    
                    className={`flex items-start gap-3 p-4 bg-gradient-to-r from-${item.color}-50 to-white rounded-xl border border-${item.color}-200`}
                  >
                    <item.icon className={`size-5 text-${item.color}-600 mt-1`} />
                    <div>
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-gray-600">{item.content}</div>
                      {item.subtext && <div className="text-sm text-gray-500">{item.subtext}</div>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Additional Info */}
            {/*} <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
             
              className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl p-8 shadow-lg border border-blue-200"
            >
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                Event Information
              </h2>
              <ul className="space-y-3 text-gray-700">
                {[
                  "All ages welcome (minors must be accompanied by an adult)",
                  "Light sticks and banners are permitted",
                  "Photography and recording policies to be announced",
                  "Accessible seating available upon request",
                  "Merchandise booths will be available at the venue",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>*/}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl p-8 shadow-lg border border-blue-200 sticky top-24"
            >
              {/* Show price only for upcoming events */}
              {isUpcomingEvent && 'price' in event && (
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(59, 130, 246, 0.3)",
                      "0 0 40px rgba(239, 68, 68, 0.3)",
                      "0 0 20px rgba(59, 130, 246, 0.3)",
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-center mb-6 p-4 bg-white rounded-xl"
                >
                 {/*  <div className="text-sm text-gray-600 mb-2">Ticket Prices</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-1">
                    {event.price}
                  </div>*/}
                  <div className="text-sm text-gray-500">Various ticket tiers available</div>
                </motion.div>
              )}

              {/* Show interest button only for upcoming events */}
              {isUpcomingEvent && (
                <>
                  <motion.button
                    onClick={handleInterest}
                    disabled={isInterested}
                    whileHover={!isInterested ? { scale: 1.05 } : {}}
                    whileTap={!isInterested ? { scale: 0.95 } : {}}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all mb-4 shadow-lg ${
                      isInterested
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-red-600 text-white hover:shadow-xl'
                    }`}
                  >
                    {isInterested ? (
                      <>
                        <CheckCircle className="size-5" />
                        You're Interested
                      </>
                    ) : (
                      <>
                        <Heart className="size-5" />
                        I'm Interested
                      </>
                    )}
                  </motion.button>

                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-green-50 text-green-800 p-3 rounded-xl text-sm text-center mb-4 border border-green-200"
                    >
                      <CheckCircle className="size-5 inline mr-2" />
                      Interest recorded! Thanks for your support.
                    </motion.div>
                  )}
                </>
              )}

              {/* Show YouTube link for past shows */}
              {isPastShow && (
                <motion.a
                  href={`https://www.youtube.com/watch?v=${event.image}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all mb-6 shadow-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-xl"
                >
                  <PlayCircle className="size-5" />
                  Watch on YouTube
                </motion.a>
              )}

              <div className="space-y-3 text-sm">
                {[
                  { label: "Artist", value: event.artist || event.title },
                  event.venue && { label: "Venue", value: event.venue },
                  { label: "City", value: event.city },
                  isUpcomingEvent && 'capacity' in event && { label: "Capacity", value: event.capacity.toLocaleString() },
                ].filter(Boolean).map((item: any, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`flex items-center justify-between py-2 ${
                      index < 2 ? 'border-b border-blue-100' : ''
                    }`}
                  >
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </motion.div>
                ))}
              </div>

              {/*<div className="mt-6 pt-6 border-t border-blue-200">
                <div className="text-sm text-gray-600 mb-2">Share this event</div>
                <div className="flex gap-2">
                  {["Facebook", "Twitter"].map((platform) => (
                    <motion.button
                      key={platform}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-2 px-3 bg-white hover:bg-gray-50 rounded-lg text-sm font-semibold transition-all border border-blue-200 shadow-sm"
                    >
                      {platform}
                    </motion.button>
                  ))}
                </div>
              </div>*/}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}