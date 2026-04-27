import { useState, useEffect } from "react";
import { Heart, Vote, CheckCircle, TrendingUp, Sparkles, Loader2, Star } from "lucide-react";
import { motion } from "motion/react";
import {
  fetchArtistWishes,
  fetchPolls,
  voteForArtist,
  voteInPoll,
  trackInteraction,
  checkArtistVotes,
  checkPollVotes,
  type ArtistWish,
  type Poll,
} from "../lib/api";
import { getUserIdentifier, getUserAgeGroup, setUserAgeGroup } from "../lib/fingerprint";
import { AgeGroupModal } from "./age-group-modal";

export function FanTools() {
  const [artistWishes, setArtistWishes] = useState<ArtistWish[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());
  const [votedArtists, setVotedArtists] = useState<Set<string>>(new Set());
  const [showAgeGroupModal, setShowAgeGroupModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{type: 'artist' | 'poll', id: string, optionId?: string} | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [artists, pollsData] = await Promise.all([
        fetchArtistWishes(),
        fetchPolls(),
      ]);
      
      console.log('Loaded artists:', artists);
      console.log('Loaded polls:', pollsData);
      
      setArtistWishes(artists);
      setPolls(pollsData);
      
      // Check which items the user has already voted for
      const userId = await getUserIdentifier();
      
      // Check artist votes - pass all artist IDs to backend
      const artistIds = artists.map(a => a.id);
      const votedArtistsObj = await checkArtistVotes(userId, artistIds);
      const votedArtistIds = Object.keys(votedArtistsObj).filter(id => votedArtistsObj[id]);
      setVotedArtists(new Set(votedArtistIds));
      
      // Check poll votes - pass all poll IDs to backend
      const pollIds = pollsData.map(p => p.id);
      const votedPollsObj = await checkPollVotes(userId, pollIds);
      const votedPollIdsList = Object.keys(votedPollsObj).filter(id => votedPollsObj[id]);
      setVotedPolls(new Set(votedPollIdsList));
      
      // Check for age group
      const ageGroup = getUserAgeGroup();
      if (!ageGroup) {
        setShowAgeGroupModal(true);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgeGroupSelect = (ageGroup: string) => {
    setUserAgeGroup(ageGroup);
    setShowAgeGroupModal(false);
    
    // Execute pending action if any
    if (pendingAction) {
      if (pendingAction.type === 'artist') {
        executeArtistVote(pendingAction.id);
      } else if (pendingAction.type === 'poll' && pendingAction.optionId) {
        executePollVote(pendingAction.id, pendingAction.optionId);
      }
      setPendingAction(null);
    }
  };

  const executeArtistVote = async (artistId: string) => {
    try {
      const userId = await getUserIdentifier();
      const ageGroup = getUserAgeGroup();
      
      // Vote for the artist (includes age group tracking)
      await voteForArtist(artistId, userId, ageGroup || undefined);
      
      // Optimistically update UI without full reload - just increment the vote count
      setArtistWishes(prevWishes => 
        prevWishes.map(artist => 
          artist.id === artistId 
            ? { ...artist, votes: (artist.votes || 0) + 1 }
            : artist
        )
      );
      
      // Mark as voted
      setVotedArtists(new Set([...votedArtists, artistId]));
    } catch (error) {
      console.error('Error voting for artist:', error);
      alert('Failed to vote. You may have already voted for this artist.');
    }
  };

  const executePollVote = async (pollId: string, optionId: string) => {
    try {
      const userId = await getUserIdentifier();
      const ageGroup = getUserAgeGroup();
      
      // Vote in the poll (includes age group tracking)
      await voteInPoll(pollId, optionId, userId, ageGroup || undefined);
      
      // Optimistically update UI without full reload - just increment the vote count
      setPolls(prevPolls =>
        prevPolls.map(poll =>
          poll.id === pollId
            ? {
                ...poll,
                options: poll.options.map(opt =>
                  opt.id === optionId
                    ? { ...opt, votes: (opt.votes || 0) + 1 }
                    : opt
                )
              }
            : poll
        )
      );
      
      // Mark as voted
      setVotedPolls(new Set([...votedPolls, pollId]));
    } catch (error) {
      console.error('Error voting in poll:', error);
      alert('Failed to vote. You may have already voted in this poll.');
    }
  };

  const handleArtistVote = async (artistId: string) => {
    if (votedArtists.has(artistId)) return;
    
    const ageGroup = getUserAgeGroup();
    if (!ageGroup) {
      setPendingAction({ type: 'artist', id: artistId });
      setShowAgeGroupModal(true);
      return;
    }
    
    await executeArtistVote(artistId);
  };

  const handlePollVote = async (pollId: string, optionId: string) => {
    if (votedPolls.has(pollId)) return;
    
    const ageGroup = getUserAgeGroup();
    if (!ageGroup) {
      setPendingAction({ type: 'poll', id: pollId, optionId });
      setShowAgeGroupModal(true);
      return;
    }
    
    await executePollVote(pollId, optionId);
  };

  // Separate artists by genre
  const boyGroups = [...artistWishes].filter(a => a.genre === "Boy Group").sort((a, b) => b.votes - a.votes);
  const girlGroups = [...artistWishes].filter(a => a.genre === "Girl Group").sort((a, b) => b.votes - a.votes);
  const soloArtists = [...artistWishes].filter(a => a.genre === "Solo Artist").sort((a, b) => b.votes - a.votes);
  const coedGroups = [...artistWishes].filter(a => a.genre === "Co-ed Group").sort((a, b) => b.votes - a.votes);

  return (
    <div className="min-h-screen">
      {/* Age Group Modal */}
      <AgeGroupModal
        isOpen={showAgeGroupModal}
        onSelect={handleAgeGroupSelect}
      />

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
          ))}</div>
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
              <Heart className="size-5" />
              <span className="text-sm">Make Your Voice Heard</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Fan Tools & Engagement
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/90 max-w-2xl mx-auto"
            >
              Vote for artists you want to see, participate in polls, and help shape K-pop events in Greece
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Loading State */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Loader2 className="size-12 mx-auto animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading fan tools...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-8">
            {/* Artist Wishlist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl p-8 shadow-lg border border-blue-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Heart className="size-6 text-blue-600" />
                      </motion.div>
                      Artist Wishlist
                    </h2>
                    <p className="text-gray-700">Vote for artists you want to see perform in Greece</p>
                  </div>
                </div>

                {/* Boy Groups */}
                {boyGroups.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Boy Groups</h3>
                    <div className="space-y-3">
                      {boyGroups.map((artist, index) => (
                        <ArtistWishCard
                          key={artist.id}
                          artist={artist}
                          onVote={handleArtistVote}
                          hasVoted={votedArtists.has(artist.id)}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Girl Groups */}
                {girlGroups.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-red-600">Girl Groups</h3>
                    <div className="space-y-3">
                      {girlGroups.map((artist, index) => (
                        <ArtistWishCard
                          key={artist.id}
                          artist={artist}
                          onVote={handleArtistVote}
                          hasVoted={votedArtists.has(artist.id)}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Solo Artists */}
                {soloArtists.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-purple-600">Solo Artists</h3>
                    <div className="space-y-3">
                      {soloArtists.map((artist, index) => (
                        <ArtistWishCard
                          key={artist.id}
                          artist={artist}
                          onVote={handleArtistVote}
                          hasVoted={votedArtists.has(artist.id)}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Co-ed Groups */}
                {coedGroups.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-orange-600">Co-ed Groups</h3>
                    <div className="space-y-3">
                      {coedGroups.map((artist, index) => (
                        <ArtistWishCard
                          key={artist.id}
                          artist={artist}
                          onVote={handleArtistVote}
                          hasVoted={votedArtists.has(artist.id)}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <a href="contact-us">Request Another Artist</a>
            </motion.div>

            {/* Community Polls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl p-8 shadow-lg border border-blue-200">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Vote className="size-6 text-red-600" />
                    </motion.div>
                    Community Polls
                  </h2>
                  <p className="text-gray-700">Help us understand what the community wants</p>
                </div>

                <div className="space-y-8">
                  {polls.map((poll, index) => (
                    <PollCard
                      key={poll.id}
                      poll={poll}
                      onVote={handlePollVote}
                      hasVoted={votedPolls.has(poll.id)}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Impact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 via-red-600 to-blue-600 rounded-3xl p-8 md:p-12 text-center text-white mt-12 relative overflow-hidden shadow-2xl"
          >
            {/* Animated sparkles */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                >
                  <Sparkles className="size-4 text-white" />
                </motion.div>
              ))}
            </div>
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp className="size-12 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Your Voice Matters</h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Event organizers and entertainment companies use this data to decide which artists to bring to Greece.
                Your votes and feedback directly influence future events!
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function ArtistWishCard({
  artist,
  onVote,
  hasVoted,
  index,
}: {
  artist: ArtistWish;
  onVote: (id: string) => void;
  hasVoted: boolean;
  index: number;
}) {
  // Show NEW badge if artist was added within the last 3 weeks (21 days)
  const THREE_WEEKS_MS = 21 * 24 * 60 * 60 * 1000;
  const isNew = artist.createdAt && (Date.now() - artist.createdAt) < THREE_WEEKS_MS;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 5, scale: 1.02 }}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-blue-200 shadow-sm"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-gray-900 truncate">{artist.artistName}</div>
          {isNew && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full shadow-sm"
            >
              <Star className="size-3" />
              NEW
            </motion.span>
          )}
        </div>
        <div className="text-sm text-gray-600">{artist.genre}</div>
      </div>
      <div className="flex items-center gap-3">
        <motion.button
          onClick={() => onVote(artist.id)}
          disabled={hasVoted}
          whileHover={!hasVoted ? { scale: 1.05 } : {}}
          whileTap={!hasVoted ? { scale: 0.95 } : {}}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold transition-all shadow-sm ${
            hasVoted
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-red-600 text-white hover:shadow-lg'
          }`}
        >
          {hasVoted ? (
            <>
              <CheckCircle className="size-4" />
              <span className="hidden sm:inline">Voted</span>
            </>
          ) : (
            <>
              <Heart className="size-4" />
              <span className="hidden sm:inline">Vote</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

function PollCard({
  poll,
  onVote,
  hasVoted,
  index,
}: {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
  hasVoted: boolean;
  index: number;
}) {
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border border-blue-200 rounded-xl p-6 bg-white"
    >
      <h3 className="font-semibold text-gray-900 mb-4">{poll.question}</h3>
      <div className="space-y-3">
        {poll.options.map((option, optionIndex) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          return (
            <motion.button
              key={option.id}
              onClick={() => onVote(poll.id, option.id)}
              disabled={hasVoted}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: optionIndex * 0.05 }}
              whileHover={!hasVoted ? { x: 5, scale: 1.01 } : {}}
              className={`w-full text-left transition-all relative overflow-hidden rounded-lg ${
                hasVoted ? 'cursor-not-allowed' : 'hover:shadow-md'
              }`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1 px-4 py-3">
                  <span className="font-medium text-gray-900">{option.text}</span>
                  {hasVoted && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-sm font-semibold text-blue-600"
                    >
                      {percentage.toFixed(0)}%
                    </motion.span>
                  )}
                </div>
              </div>
              {hasVoted && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: optionIndex * 0.1 }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-100 to-red-100 rounded-lg"
                  style={{ zIndex: 0 }}
                />
              )}
              {!hasVoted && (
                <div className="absolute inset-0 border-2 border-blue-200 rounded-lg" />
              )}
            </motion.button>
          );
        })}
      </div>
      {hasVoted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-gray-600"
        >
          Thank you for participating!
        </motion.div>
      )}
    </motion.div>
  );
}