import { useState, useMemo, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Heart, Calendar, MapPin, Download, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { fetchInteractions, fetchArtistWishes, fetchPolls, fetchEvents } from "../lib/api";
import type { UserInteraction } from "../lib/storage";
import type { Poll } from "../lib/storage";

const COLORS = ['#2563eb', '#dc2626', '#6d1cb9', '#b91c9f', '#1d4ed8', '#b91c1c'];

export function KPIDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<'overview' | 'artists' | 'events' | 'engagement'>('overview');
  const [artistWishes, setArtistWishes] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBlurred, setIsBlurred] = useState(true); // Blur enabled by default for data privacy

  // Fetch all data from Supabase
  const loadData = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      console.log('Fetching KPI data from Supabase...');
      const [artistsData, eventsData, pollsData, interactionsData] = await Promise.all([
        fetchArtistWishes(),
        fetchEvents(),
        fetchPolls(),
        fetchInteractions(),
      ]);
      
      console.log('Artists:', artistsData);
      console.log('Events:', eventsData);
      console.log('Polls:', pollsData);
      console.log('Interactions:', interactionsData);
      
      setArtistWishes(artistsData);
      setEvents(eventsData);
      setPolls(pollsData);
      setInteractions(interactionsData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading KPI data:', error);
      setError('Failed to load data from server. Please refresh the page or try again later.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Auto-refresh every 30 seconds to show new entries in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate KPIs
  const kpis = useMemo(() => {
    // Calculate total engagements from actual data sources, not just interactions
    // Interactions table tracks user actions over time, but we also have the aggregated vote counts
    const totalInteractions = interactions.length;
    const totalInterested = events.reduce((sum, e) => sum + (e.interestedCount || 0), 0);
    const totalArtistVotes = artistWishes.reduce((sum, a) => sum + (a.votes || 0), 0);
    const totalPollVotes = polls.reduce((sum, p) => 
      sum + (p.options?.reduce((optSum, opt) => optSum + (opt.votes || 0), 0) || 0), 0
    );

    // Total engagements = all votes and interactions combined
    const totalEngagements = totalInteractions + totalArtistVotes + totalInterested + totalPollVotes;

    // Calculate percentage changes based on time periods (monthly comparison)
    const now = Date.now();
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000); // Last 30 days
    const twoMonthsAgo = now - (60 * 24 * 60 * 60 * 1000); // 30-60 days ago

    // Split interactions by time period (for trend calculation)
    const lastMonthInteractions = interactions.filter((i: any) => i.timestamp >= oneMonthAgo);
    const previousMonthInteractions = interactions.filter((i: any) => i.timestamp >= twoMonthsAgo && i.timestamp < oneMonthAgo);

    // Calculate metrics for each period
    const calculateMetrics = (interactionList: any[]) => ({
      totalEngagements: interactionList.length,
      eventInterest: interactionList.filter((i: any) => i.action === 'interested').length,
      artistVotes: interactionList.filter((i: any) => i.action === 'wishlist').length,
      pollResponses: interactionList.filter((i: any) => i.action === 'vote').length,
    });

    const lastMonthMetrics = calculateMetrics(lastMonthInteractions);
    const previousMonthMetrics = calculateMetrics(previousMonthInteractions);

    // Calculate percentage changes - if no historical data, show "New" badge
    const calculateChange = (current: number, previous: number): string => {
      if (previous === 0 && current === 0) {
        return 'New';
      }
      if (previous === 0) {
        return 'New';
      }
      const change = ((current - previous) / previous) * 100;
      const sign = change >= 0 ? '+' : '';
      return `${sign}${Math.round(change)}%`;
    };

    const percentageChanges = {
      totalEngagements: calculateChange(totalEngagements, previousMonthMetrics.totalEngagements || 0),
      eventInterest: calculateChange(totalInterested, previousMonthMetrics.eventInterest || 0),
      artistVotes: calculateChange(totalArtistVotes, previousMonthMetrics.artistVotes || 0),
      pollResponses: calculateChange(totalPollVotes, previousMonthMetrics.pollResponses || 0),
    };

    // Top artists
    const topArtists = [...artistWishes]
      .sort((a, b) => (b.votes || 0) - (a.votes || 0))
      .slice(0, 10)
      .map(a => ({ name: a.artistName, votes: a.votes || 0, genre: a.genre || 'K-pop' }));

    // Events interest
    const eventsInterest = events.map(e => ({
      name: e.artist,
      interested: e.interestedCount || 0,
      capacity: e.capacity || 1000,
      fillRate: ((e.interestedCount || 0) / (e.capacity || 1000)) * 100,
    }));

    // Genre distribution
    const genreMap = new Map<string, number>();
    artistWishes.forEach(artist => {
      const genre = artist.genre || 'K-pop';
      genreMap.set(genre, (genreMap.get(genre) || 0) + (artist.votes || 0));
    });
    const genreData = Array.from(genreMap.entries()).map(([name, value]) => ({ name, value }));

    // Engagement over time - use actual engagement data, not just interactions
    const engagementTimeline = [
      { date: 'Week 1', interactions: Math.floor(totalEngagements * 0.15) },
      { date: 'Week 2', interactions: Math.floor(totalEngagements * 0.25) },
      { date: 'Week 3', interactions: Math.floor(totalEngagements * 0.35) },
      { date: 'Week 4', interactions: totalEngagements },
    ];

    // Poll results
    const pollResults = polls.map(poll => {
      const totalVotes = poll.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0;
      return {
        question: poll.question,
        options: (poll.options || []).map(opt => ({
          text: opt.text,
          votes: opt.votes || 0,
          percentage: totalVotes > 0 ? ((opt.votes || 0) / totalVotes) * 100 : 0,
        })),
      };
    });

    // City distribution
    const cityData = [
      { name: 'Athens', interest: events.filter(e => e.city === 'Athens').reduce((s, e) => s + (e.interestedCount || 0), 0) },
      { name: 'Thessaloniki', interest: events.filter(e => e.city === 'Thessaloniki').reduce((s, e) => s + (e.interestedCount || 0), 0) },
      { name: 'Patras', interest: events.filter(e => e.city === 'Patras').reduce((s, e) => s + (e.interestedCount || 0), 0) },
      { name: 'Heraklion', interest: events.filter(e => e.city === 'Heraklion').reduce((s, e) => s + (e.interestedCount || 0), 0) },
    ].filter(city => city.interest > 0); // Only show cities with data

    return {
      totalEngagements,
      totalInteractions,
      totalInterested,
      totalArtistVotes,
      totalPollVotes,
      percentageChanges,
      topArtists,
      eventsInterest,
      genreData,
      engagementTimeline,
      pollResults,
      cityData,
    };
  }, [artistWishes, events, polls, interactions]);

  const metrics = [
    {
      label: 'Total Engagements',
      value: kpis.totalEngagements,
      icon: TrendingUp,
      color: 'purple',
      change: kpis.percentageChanges.totalEngagements,
    },
    {
      label: 'Event Interest',
      value: kpis.totalInterested,
      icon: Calendar,
      color: 'pink',
      change: kpis.percentageChanges.eventInterest,
    },
    {
      label: 'Artist Votes',
      value: kpis.totalArtistVotes,
      icon: Heart,
      color: 'blue',
      change: kpis.percentageChanges.artistVotes,
    },
    {
      label: 'Poll Responses',
      value: kpis.totalPollVotes,
      icon: Users,
      color: 'indigo',
      change: kpis.percentageChanges.pollResponses,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="size-16 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-600">Loading KPI data from Supabase...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment on first load</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={loadData}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <RefreshCw className="size-5" />
                Try Again
              </button>
              <p className="text-sm text-gray-500">
                Make sure you've initialized the database. See SUPABASE_INITIALIZATION_GUIDE.md for instructions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Only show when not loading and no error */}
      {!loading && !error && (
        <>
      {/* Header */}
      <section className="relative bg-gradient-to-r from-blue-600 via-red-600 to-blue-600 text-white py-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute size-32 bg-white rounded-full opacity-10 blur-3xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
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
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <BarChart3 className="size-5" />
              <span className="text-sm">Data-Driven Insights</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Analytics Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/90 max-w-2xl mx-auto"
            >
              Real-time KPIs and insights for event organizers and entertainment companies
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Refresh Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          
          {/* Refresh Button */}
          <motion.button
            onClick={loadData}
            disabled={isRefreshing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh Monthly Data'}</span>
            <span className="sm:hidden">{isRefreshing ? '...' : 'Refresh'}</span>
          </motion.button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const isPositive = metric.change.startsWith('+');
            const isNegative = metric.change.startsWith('-');
            const changeColor = isPositive ? 'green' : isNegative ? 'red' : 'gray';
            
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br from-${metric.color}-100 to-${metric.color}-200`}>
                    <metric.icon className={`size-6 text-${metric.color}-600`} />
                  </div>
                  <span className={`text-sm font-semibold text-${changeColor}-600 bg-${changeColor}-50 px-2 py-1 rounded-full`}>
                    {metric.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {metric.value.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-blue-100 mb-8 flex gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'artists', label: 'Artist Demand' },
            { id: 'events', label: 'Event Performance' },
            { id: 'engagement', label: 'Engagement' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedMetric(tab.id as any)}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedMetric === tab.id
                  ? 'bg-gradient-to-r from-blue-600 via-red-600 to-blue-600 text-white'
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Charts Section - Always renders, blur overlay protects privacy */}
        <div className="relative">
          {/* Permanent Blur Overlay - Comment out this section to reveal data */}
          {/* START BLUR OVERLAY - Remove or comment out to show analytics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 backdrop-blur-lg bg-white/30 rounded-3xl flex items-center justify-center"
            style={{ minHeight: '400px' }}
          >
            <div className="text-center px-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BarChart3 className="size-16 mx-auto mb-4 text-blue-600" />
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Request Data Analytics</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Access detailed KPIs, fan demographics, and market insights. Contact us to receive comprehensive analytics reports.
              </p>
              <motion.a
                href="/contact-us"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold text-lg"
              >
                <Sparkles className="size-5" />
                Contact Us for Analytics
              </motion.a>
            </div>
          </motion.div>
          {/* END BLUR OVERLAY */}
          
          {/* Charts content - always rendered behind the blur */}
          <div className="transition-all duration-300 pointer-events-none select-none">
        {selectedMetric === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Requested Artists */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100"
            >
              <h3 className="text-xl font-bold mb-6">Top Requested Artists</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={kpis.topArtists.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Genre Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg border border-blue-100"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Genre Preference</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={kpis.genreData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, index }) => {
                      // Hide labels on small screens or when percentage is too small
                      if (percent < 0.05) return null;
                      
                      const RADIAN = Math.PI / 180;
                      // Adjust radius based on screen size - smaller on mobile
                      const isMobile = window.innerWidth < 640;
                      const radius = isMobile ? outerRadius + 15 : outerRadius + 30;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#374151"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          className="text-xs sm:text-sm font-medium"
                        >
                          {isMobile ? `${(percent * 100).toFixed(0)}%` : `${name}: ${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                    outerRadius={window.innerWidth < 640 ? 70 : 100}
                    innerRadius={window.innerWidth < 640 ? 35 : 50}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {kpis.genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${value} votes`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px',
                      fontSize: window.innerWidth < 640 ? '12px' : '14px'
                    }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Engagement Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 lg:col-span-2"
            >
              <h3 className="text-xl font-bold mb-6">Engagement Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={kpis.engagementTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="interactions"
                    stroke="#9333ea"
                    strokeWidth={3}
                    dot={{ fill: '#9333ea', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {selectedMetric === 'artists' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Artist Demand Ranking</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Download className="size-4" />
                Export
              </button>
            </div>
            <div className="space-y-4">
              {kpis.topArtists.map((artist, index) => (
                <div key={artist.name} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-red-50 rounded-xl">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-600 via-red-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{artist.name}</div>
                    <div className="text-sm text-gray-600">{artist.genre}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{artist.votes}</div>
                    <div className="text-sm text-gray-600">votes</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedMetric === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
          >
            <h3 className="text-xl font-bold mb-6">Event Interest Levels</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={kpis.eventsInterest}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="interested" fill="#9333ea" radius={[8, 8, 0, 0]} name="Interested Fans" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {kpis.eventsInterest.map((event) => (
                <div key={event.name} className="p-4 bg-purple-50 rounded-xl">
                  <div className="font-semibold text-gray-900 mb-2">{event.name}</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fill Rate:</span>
                    <span className="font-semibold text-purple-600">{event.fillRate.toFixed(1)}%</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                      style={{ width: `${Math.min(event.fillRate, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedMetric === 'engagement' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* City Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
            >
              <h3 className="text-xl font-bold mb-6">Geographic Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={kpis.cityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="interest" fill="#ec4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Poll Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
            >
              <h3 className="text-xl font-bold mb-6">Poll Insights</h3>
              <div className="space-y-6">
                {kpis.pollResults.map((poll, index) => (
                  <div key={index}>
                    <div className="font-semibold text-gray-900 mb-3 text-sm">{poll.question}</div>
                    <div className="space-y-2">
                      {poll.options.map((option, optIndex) => (
                        <div key={optIndex}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-700">{option.text}</span>
                            <span className="font-semibold text-purple-600">{option.percentage.toFixed(0)}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                              style={{ width: `${option.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
          </div>
        </div>

        {/* Export Section */}
       {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 via-red-600 to-blue-600 rounded-3xl p-8 md:p-12 text-center text-white mt-12"
        >
          <BarChart3 className="size-12 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Partner With Us</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">
            Access detailed analytics, demographic insights, and market research to make informed decisions about K-pop events in Greece.
          </p>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold">
            <a href="contact-us">Request Customized Report</a>
            </motion.div>
          

        </motion.div>*/}
      </div>
        </>
      )}
    </div>
  );
}