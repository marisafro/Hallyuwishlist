import { Link } from "react-router";
import { Calendar, Heart, BarChart3, Sparkles, TrendingUp, Users, Star } from "lucide-react";
import { motion } from "motion/react";
import { getEvents } from "../lib/storage";
import { format } from "date-fns";
<meta name="google-site-verification" content="NHE9tKYzKIdXvbQo1irlOx4dQgJGKfNpgni8CstVouY" />

export function Home() {
  const events = getEvents().slice(0, 3); // Show first 3 upcoming events

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-red-600 to-blue-800 opacity-95" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
                      mixBlendMode: 'overlay',
          }}
        />
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
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
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="size-5" />
              <span className="text-sm">Greece's Premier K-pop Event Platform</span>
            </motion.div>
            <motion.h1 id="Aegean1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Where Greece Meets<br />
              <motion.span id="Aegean2"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                    "0 0 40px rgba(239, 68, 68, 0.5)",
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-gradient-to-r from-blue-200 to-red-200 bg-clip-text text-transparent"
              >
                Hallyu Wave
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
            >
              Bringing world-class K-pop concerts, exclusive events, and a thriving fan community to Greece
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/events"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold shadow-lg"
                >
                  <Calendar className="size-5" />
                  Browse Events
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/fan-tools"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl hover:bg-white/20 transition-colors font-semibold shadow-lg"
                >
                  <Heart className="size-5" />
                  Fan Tools
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
          
        >
          <h2 id="why" className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
            Why Hallyu Wishlist?
          </h2>
          <p  className="text-lg text-gray-700 max-w-1xl mx-auto">
            Connecting Greek fans with Korean culture through data-driven insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Calendar,
              title: "Premium Events",
              description: "Access to the biggest K-pop concerts and exclusive fan meetings across Greece",
              color: "blue",
              delay: 0,
            },
            {
              icon: Heart,
              title: "Fan Engagement",
              description: "Vote for artists, participate in polls, and connect with the community",
              color: "red",
              delay: 0.1,
            },
            {
              icon: BarChart3,
              title: "Data Insights",
              description: "Real-time analytics and KPIs for event organizers and entertainment companies",
              color: "blue",
              delay: 0.2,
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-blue-200"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`inline-flex p-3 rounded-xl mb-4 bg-gradient-to-br from-${feature.color}-600 to-red-600 shadow-lg`}
              >
                <feature.icon className="size-6 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 id="why" className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <p className="text-gray-700">Don't miss out on these amazing concerts</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to="/events"
              className="hidden sm:inline-flex items-center gap-2 text-blue-600 hover:text-red-600 font-semibold transition-colors"
            >
              View All
              <TrendingUp className="size-5" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Link to={`/events/${event.id}`} className="group block">
                <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-blue-200">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <motion.img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-blue-600/20"
                    />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-white text-sm font-semibold mb-1">{event.artist}</div>
                      <div className="text-white/90 text-xs">{event.venue}</div>
                    </div>
                    <motion.div
                      className="absolute top-4 right-4"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="size-6 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        {format(new Date(event.date), "MMM dd, yyyy")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="size-4" />
                        <span>{event.interestedCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link
            to="/events"
            className="inline-flex sm:hidden items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold shadow-md"
          >
            View All Events
            <TrendingUp className="size-5" />
          </Link>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 via-red-600 to-blue-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute size-20 bg-white rounded-full blur-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to Join?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            >
              Engage with the community, vote for your favorite artists, and help shape the future of K-pop in Greece
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/fan-tools"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold shadow-lg"
              >
                <Heart className="size-5" />
                Explore Fan Tools
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
