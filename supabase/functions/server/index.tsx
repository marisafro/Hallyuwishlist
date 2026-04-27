import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-74a49e83/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================
// KPI DATA ENDPOINTS
// ============================================

// Get all interactions for KPI dashboard
app.get("/make-server-74a49e83/interactions", async (c) => {
  try {
    const interactions = await kv.getByPrefix("interaction:");
    return c.json({ interactions });
  } catch (error) {
    console.log(`Error fetching interactions: ${error}`);
    return c.json({ error: "Failed to fetch interactions" }, 500);
  }
});

// Track a new interaction (artist vote, poll vote, event interest)
app.post("/make-server-74a49e83/interactions", async (c) => {
  try {
    const body = await c.req.json();
    const { eventId, artistId, pollId, action, city, userId, ageGroup } = body;
    
    if (!action || !userId) {
      return c.json({ error: "Missing required fields: action, userId" }, 400);
    }

    const interaction = {
      eventId,
      artistId,
      pollId,
      action,
      timestamp: Date.now(),
      city,
      userId,
      ageGroup,
    };

    const key = `interaction:${Date.now()}:${userId}`;
    await kv.set(key, interaction);
    
    return c.json({ success: true, interaction });
  } catch (error) {
    console.log(`Error tracking interaction: ${error}`);
    return c.json({ error: "Failed to track interaction" }, 500);
  }
});

// Get all artist wishes
app.get("/make-server-74a49e83/artist-wishes", async (c) => {
  try {
    const wishes = await kv.getByPrefix("artist:");
    return c.json({ wishes });
  } catch (error) {
    console.log(`Error fetching artist wishes: ${error}`);
    return c.json({ error: "Failed to fetch artist wishes" }, 500);
  }
});

// Add a new artist to the wishlist
app.post("/make-server-74a49e83/add-artist", async (c) => {
  try {
    const body = await c.req.json();
    const { artistName, genre } = body;

    if (!artistName || !genre) {
      return c.json({ error: "Missing required fields: artistName, genre" }, 400);
    }

    // Check if artist already exists
    const existingArtists = await kv.getByPrefix("artist:");
    const artistExists = existingArtists.some((a: any) => a.artistName === artistName);

    if (artistExists) {
      console.log(`Artist already exists: ${artistName}`);
      return c.json({ success: true, message: "Artist already exists", alreadyExists: true });
    }

    // Generate a unique ID (timestamp-based)
    const id = `${Date.now()}`;

    const newArtist = {
      id,
      artistName,
      votes: 0,
      genre,
    };

    await kv.set(`artist:${id}`, newArtist);

    console.log(`New artist added: ${artistName} (${genre})`);

    return c.json({ success: true, artist: newArtist });
  } catch (error) {
    console.log(`Error adding artist: ${error}`);
    return c.json({ error: "Failed to add artist" }, 500);
  }
});

// Check if user has voted for specific artists
app.post("/make-server-74a49e83/check-artist-votes", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, artistIds } = body;
    
    if (!userId || !artistIds || !Array.isArray(artistIds)) {
      return c.json({ error: "Missing required fields: userId, artistIds" }, 400);
    }

    const votedArtists: Record<string, boolean> = {};
    
    for (const artistId of artistIds) {
      const voteKey = `vote:artist:${artistId}:${userId}`;
      const existingVote = await kv.get(voteKey);
      if (existingVote) {
        votedArtists[artistId] = true;
      }
    }
    
    return c.json({ votedArtists });
  } catch (error) {
    console.log(`Error checking artist votes: ${error}`);
    return c.json({ error: "Failed to check votes" }, 500);
  }
});

// Vote for an artist
app.post("/make-server-74a49e83/artist-vote", async (c) => {
  try {
    const body = await c.req.json();
    const { artistId, userId, ageGroup } = body;
    
    if (!artistId || !userId) {
      return c.json({ error: "Missing required fields: artistId, userId" }, 400);
    }

    // Get artist data
    const artistKey = `artist:${artistId}`;
    const artist = await kv.get(artistKey);
    
    if (!artist) {
      return c.json({ error: "Artist not found" }, 404);
    }

    // Check if user already voted
    const voteKey = `vote:artist:${artistId}:${userId}`;
    const existingVote = await kv.get(voteKey);
    
    if (existingVote) {
      return c.json({ error: "User already voted for this artist" }, 400);
    }

    // Update votes
    artist.votes = (artist.votes || 0) + 1;
    
    // Mark user as voted (for frontend detection)
    if (!artist.votesByUser) {
      artist.votesByUser = {};
    }
    artist.votesByUser[userId] = true;
    
    // Track vote by user ID and age group (separate record)
    const voteRecord = {
      artistId,
      userId,
      ageGroup: ageGroup || 'unknown',
      timestamp: Date.now(),
    };
    
    await kv.set(voteKey, voteRecord);
    await kv.set(artistKey, artist);
    
    // Create interaction record for KPI tracking
    const interactionKey = `interaction:${Date.now()}:${userId}`;
    const interaction = {
      artistId,
      action: 'wishlist',
      timestamp: Date.now(),
      userId,
      ageGroup: ageGroup || 'unknown',
    };
    await kv.set(interactionKey, interaction);
    
    console.log(`Artist vote recorded: ${artist.artistName} - User: ${userId} - Age: ${ageGroup || 'unknown'}`);
    
    return c.json({ success: true, artist });
  } catch (error) {
    console.log(`Error voting for artist: ${error}`);
    return c.json({ error: "Failed to vote for artist" }, 500);
  }
});

// Get all polls
app.get("/make-server-74a49e83/polls", async (c) => {
  try {
    const polls = await kv.getByPrefix("poll:");
    return c.json({ polls });
  } catch (error) {
    console.log(`Error fetching polls: ${error}`);
    return c.json({ error: "Failed to fetch polls" }, 500);
  }
});

// Check if user has voted in specific polls
app.post("/make-server-74a49e83/check-poll-votes", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, pollIds } = body;
    
    if (!userId || !pollIds || !Array.isArray(pollIds)) {
      return c.json({ error: "Missing required fields: userId, pollIds" }, 400);
    }

    const votedPolls: Record<string, boolean> = {};
    
    for (const pollId of pollIds) {
      const voteKey = `vote:poll:${pollId}:${userId}`;
      const existingVote = await kv.get(voteKey);
      if (existingVote) {
        votedPolls[pollId] = true;
      }
    }
    
    return c.json({ votedPolls });
  } catch (error) {
    console.log(`Error checking poll votes: ${error}`);
    return c.json({ error: "Failed to check votes" }, 500);
  }
});

// Vote in a poll
app.post("/make-server-74a49e83/poll-vote", async (c) => {
  try {
    const body = await c.req.json();
    const { pollId, optionId, userId, ageGroup } = body;
    
    if (!pollId || !optionId || !userId) {
      return c.json({ error: "Missing required fields: pollId, optionId, userId" }, 400);
    }

    // Get poll data
    const pollKey = `poll:${pollId}`;
    const poll = await kv.get(pollKey);
    
    if (!poll) {
      return c.json({ error: "Poll not found" }, 404);
    }

    // Check if user already voted in this poll
    const voteKey = `vote:poll:${pollId}:${userId}`;
    const existingVote = await kv.get(voteKey);
    
    if (existingVote) {
      return c.json({ error: "User already voted in this poll" }, 400);
    }

    // Find the option and update votes
    const option = poll.options.find((o: any) => o.id === optionId);
    if (!option) {
      return c.json({ error: "Option not found" }, 404);
    }

    option.votes = (option.votes || 0) + 1;
    
    // Mark user as voted (for frontend detection)
    if (!option.votesByUser) {
      option.votesByUser = {};
    }
    option.votesByUser[userId] = true;
    
    // Track vote by user ID and age group (separate record)
    const voteRecord = {
      pollId,
      optionId,
      userId,
      ageGroup: ageGroup || 'unknown',
      timestamp: Date.now(),
    };
    
    await kv.set(voteKey, voteRecord);
    await kv.set(pollKey, poll);
    
    // Create interaction record for KPI tracking
    const interactionKey = `interaction:${Date.now()}:${userId}`;
    const interaction = {
      pollId,
      action: 'vote',
      timestamp: Date.now(),
      userId,
      ageGroup: ageGroup || 'unknown',
    };
    await kv.set(interactionKey, interaction);
    
    console.log(`Poll vote recorded: ${poll.question} - Option: ${option.text} - User: ${userId} - Age: ${ageGroup || 'unknown'}`);
    
    return c.json({ success: true, poll });
  } catch (error) {
    console.log(`Error voting in poll: ${error}`);
    return c.json({ error: "Failed to vote in poll" }, 500);
  }
});

// Get all events
app.get("/make-server-74a49e83/events", async (c) => {
  try {
    const events = await kv.getByPrefix("event:");
    return c.json({ events });
  } catch (error) {
    console.log(`Error fetching events: ${error}`);
    return c.json({ error: "Failed to fetch events" }, 500);
  }
});

// Add a new event
app.post("/make-server-74a49e83/add-event", async (c) => {
  try {
    const body = await c.req.json();
    const { id, title, artist, date, venue, city, image, description, capacity, interestedCount } = body;

    if (!id || !title || !artist) {
      return c.json({ error: "Missing required fields: id, title, artist" }, 400);
    }

    // Check if event already exists
    const existingEvent = await kv.get(`event:${id}`);
    if (existingEvent) {
      return c.json({ error: "Event already exists", event: existingEvent }, 200);
    }

    const newEvent = {
      id,
      title,
      artist,
      date,
      venue,
      city,
      image,
      description,
      capacity,
      interestedCount: interestedCount || 0,
    };

    await kv.set(`event:${id}`, newEvent);

    console.log(`New event added: ${title}`);

    return c.json({ success: true, event: newEvent });
  } catch (error) {
    console.log(`Error adding event: ${error}`);
    return c.json({ error: "Failed to add event" }, 500);
  }
});

// Update event interest count
app.post("/make-server-74a49e83/event-interest", async (c) => {
  try {
    const body = await c.req.json();
    const { eventId, userId } = body;
    
    if (!eventId || !userId) {
      return c.json({ error: "Missing required fields: eventId, userId" }, 400);
    }

    // Check if user already showed interest
    const interestKey = `interest:${eventId}:${userId}`;
    const existingInterest = await kv.get(interestKey);
    
    if (existingInterest) {
      return c.json({ error: "User already showed interest" }, 400);
    }

    // Get event data
    const eventKey = `event:${eventId}`;
    const event = await kv.get(eventKey);
    
    if (!event) {
      return c.json({ error: "Event not found" }, 404);
    }

    // Update interest count
    event.interestedCount = (event.interestedCount || 0) + 1;
    await kv.set(eventKey, event);

    // Mark user as interested
    const timestamp = Date.now();
    await kv.set(interestKey, { userId, eventId, timestamp });

    // Track interaction for KPI analytics
    const interactionKey = `interaction:${timestamp}:${userId}`;
    const interaction = {
      eventId,
      action: 'interested',
      timestamp,
      userId,
    };
    await kv.set(interactionKey, interaction);

    return c.json({ success: true, event });
  } catch (error) {
    console.log(`Error updating event interest: ${error}`);
    return c.json({ error: "Failed to update event interest" }, 500);
  }
});

// Sync missing events (adds new events from storage.ts without overwriting existing ones)
app.post("/make-server-74a49e83/sync-events", async (c) => {
  try {
    const body = await c.req.json();
    const { events } = body;

    if (!events || !Array.isArray(events)) {
      return c.json({ error: "Missing or invalid events array" }, 400);
    }

    // Get existing events
    const existingEvents = await kv.getByPrefix("event:");
    const existingIds = new Set(existingEvents.map((e: any) => e.id));

    let added = 0;
    let skipped = 0;
    const results: any[] = [];

    for (const event of events) {
      // Skip if event ID already exists
      if (existingIds.has(event.id)) {
        skipped++;
        results.push({ event: event.title, status: 'skipped', reason: 'already exists' });
        continue;
      }

      // Add new event
      const newEvent = {
        id: event.id,
        title: event.title,
        artist: event.artist,
        date: event.date,
        venue: event.venue,
        city: event.city,
        image: event.image,
        description: event.description || "",
        capacity: event.capacity,
        interestedCount: 0,
      };

      await kv.set(`event:${event.id}`, newEvent);
      added++;
      results.push({ event: event.title, status: 'added' });
      console.log(`Added event: ${event.title}`);
    }

    return c.json({
      success: true,
      added,
      skipped,
      total: events.length,
      results,
    });
  } catch (error) {
    console.log(`Error syncing events: ${error}`);
    return c.json({ error: "Failed to sync events" }, 500);
  }
});

// Sync missing artists (adds new artists from storage.ts without overwriting existing ones)
app.post("/make-server-74a49e83/sync-artists", async (c) => {
  try {
    const body = await c.req.json();
    const { artists } = body; // Array of { id, artistName, genre }

    if (!artists || !Array.isArray(artists)) {
      return c.json({ error: "Missing or invalid artists array" }, 400);
    }

    // Get existing artists
    const existingArtists = await kv.getByPrefix("artist:");
    const existingNames = new Set(existingArtists.map((a: any) => a.artistName));
    const existingIds = new Set(existingArtists.map((a: any) => a.id));

    let added = 0;
    let skipped = 0;
    const results: any[] = [];

    for (const artist of artists) {
      // Skip if artist name already exists (duplicate check by name)
      if (existingNames.has(artist.artistName)) {
        skipped++;
        results.push({ artist: artist.artistName, status: 'skipped', reason: 'already exists' });
        continue;
      }

      // Skip if ID already exists (prevent ID collision)
      if (existingIds.has(artist.id)) {
        skipped++;
        results.push({ artist: artist.artistName, status: 'skipped', reason: 'ID collision' });
        continue;
      }

      // Add new artist (with votes: 0)
      const newArtist = {
        id: artist.id,
        artistName: artist.artistName,
        votes: 0,
        genre: artist.genre || "K-pop",
      };

      await kv.set(`artist:${artist.id}`, newArtist);
      added++;
      results.push({ artist: artist.artistName, status: 'added' });
      console.log(`Added artist: ${artist.artistName}`);
    }

    return c.json({
      success: true,
      added,
      skipped,
      total: artists.length,
      results,
    });
  } catch (error) {
    console.log(`Error syncing artists: ${error}`);
    return c.json({ error: "Failed to sync artists" }, 500);
  }
});

// Initialize default data (call this once to set up initial data)
app.post("/make-server-74a49e83/initialize", async (c) => {
  try {
    // Initialize artist wishes with REAL data (starting from 0)
    const defaultArtists = [
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
      { id: "26", artistName: "YOUNGJI", votes: 0, genre: "Solo Artist", createdAt: 1777017600000 }, // April 27, 2026
      { id: "27", artistName: "NMIXX", votes: 0, genre: "Girl Group", createdAt: 1777017600000 }, // April 27, 2026
      { id: "28", artistName: "KATSEYE", votes: 0, genre: "Girl Group", createdAt: 1777017600000 }, // April 27, 2026
      { id: "29", artistName: "8TURN", votes: 0, genre: "Boy Group", createdAt: 1777017600000}, // April 27, 2026
    ];

    // SAFE MODE: Only add artists that don't exist (preserve existing votes)
    const existingArtists = await kv.getByPrefix("artist:");
    const existingIds = new Set(existingArtists.map((a: any) => a.id));

    for (const artist of defaultArtists) {
      if (!existingIds.has(artist.id)) {
        await kv.set(`artist:${artist.id}`, artist);
        console.log(`Added new artist: ${artist.artistName}`);
      } else {
        console.log(`Skipped existing artist: ${artist.artistName}`);
      }
    }

    // Initialize polls
    const defaultPolls = [
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

    // SAFE MODE: Only add polls that don't exist (preserve existing votes)
    const existingPolls = await kv.getByPrefix("poll:");
    const existingPollIds = new Set(existingPolls.map((p: any) => p.id));

    for (const poll of defaultPolls) {
      if (!existingPollIds.has(poll.id)) {
        await kv.set(`poll:${poll.id}`, poll);
        console.log(`Added new poll: ${poll.question}`);
      } else {
        console.log(`Skipped existing poll: ${poll.question}`);
      }
    }

    // Initialize events
    const defaultEvents = [
      {
        id: "4",
        title: "Choom KPOP FESTIVAL - Thessaloniki",
        artist: "Choom KPOP FESTIVAL",
        date: "2026-03-29",
        venue: "Ioannis Vellidis Convention Center",
        city: "Thessaloniki",
        price: "1",
        image: "https://choomkpopfestival.gr/wp-content/uploads/2025/09/choom-logo-homepage.png",
        description: "...",
        capacity: 5000,
        interestedCount: 0,
      },
      {
        id: "3",
        title: "LEVEL10KCONVENTION 2026 Thessaloniki",
        artist: "LEVEL10KCONVENTION",
        date: "2026-06-27",
        venue: "WE",
        city: "Thessaloniki",
        price: "1",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe7vkEn_Ql1o9zp-wI0R0cihdhiIKXtrgKEw&s",
        description: "...",
        capacity: 3000,
        interestedCount: 0,
      },
      {
        id: "2",
        title: "TRENDZ",
        artist: "TRENDZ",
        date: "2026-04-08",
        venue: "WE",
        city: "Thessaloniki",
        price: "1",
        image: "https://www.more.com/getattachment/ff0c40be-504d-401b-a1d7-a8428bd96e32/TRENDZ-(KR)-FOR-THE-FIRST-TIME-LIVE-IN-THESSA834cd.png",
        description: "...",
        capacity: 1500,
        interestedCount: 0,
      },
      {
        id: "1",
        title: "LEVEL10KCONVENTION 2026 - Athens",
        artist: "LEVEL10KCONVENTION",
        date: "2026-08-10",
        venue: "TBA",
        city: "Athens",
        price: "1",
        image: "https://instagram.fath4-2.fna.fbcdn.net/v/t51.82787-19/648754418_17982580757950936_3335102880794334532_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=instagram.fath4-2.fna.fbcdn.net&_nc_cat=104&_nc_oc=Q6cZ2QHsUphbGGawX2Vn5xb1hYDJOPDhSv2H2Y7faB1NjSXdmDAw6gBoK0CjhiaIozQUx0AwIQmxxm4okYqa8HPzl0L7&_nc_ohc=idkYRY57mLsQ7kNvwGrvyhi&_nc_gid=cb-3fP-pI5m1nKFzgz1_Jw&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_AfxHSh6J0jNyv-onnEqUyzCnJEzzYlkd9c2cQda4f9C19g&oe=69B3C4AA&_nc_sid=7d3ac5",
        description: "...",
        capacity: 2000,
        interestedCount: 0,
      },
    ];

    // SAFE MODE: Only add events that don't exist (preserve existing interest counts)
    const existingEvents = await kv.getByPrefix("event:");
    const existingEventIds = new Set(existingEvents.map((e: any) => e.id));

    for (const event of defaultEvents) {
      if (!existingEventIds.has(event.id)) {
        await kv.set(`event:${event.id}`, event);
        console.log(`Added new event: ${event.title}`);
      } else {
        console.log(`Skipped existing event: ${event.title}`);
      }
    }

    return c.json({
      success: true,
      message: "Safe initialization complete - existing data preserved",
      note: "Only missing artists/polls/events were added. All existing votes and data remain intact."
    });
  } catch (error) {
    console.log(`Error initializing data: ${error}`);
    return c.json({ error: "Failed to initialize data" }, 500);
  }
});

// Archive monthly data (NEVER resets - only creates backups for historical records)
app.post("/make-server-74a49e83/monthly-archive", async (c) => {
  try {
    const now = Date.now();
    const archiveDate = new Date().toISOString().slice(0, 7); // Format: YYYY-MM

    // Get all current interactions
    const interactions = await kv.getByPrefix("interaction:");

    // Archive interactions for the month (BACKUP ONLY - no deletion)
    const archiveKey = `archive:${archiveDate}`;
    const archiveData = {
      timestamp: now,
      date: archiveDate,
      interactions,
      totalCount: interactions.length,
    };
    await kv.set(archiveKey, archiveData);

    // Get current state of artists, polls, and events for historical record
    const artists = await kv.getByPrefix("artist:");
    const polls = await kv.getByPrefix("poll:");
    const events = await kv.getByPrefix("event:");

    // Save monthly snapshot (BACKUP ONLY - original data stays intact)
    const snapshotKey = `snapshot:${archiveDate}`;
    const snapshot = {
      timestamp: now,
      date: archiveDate,
      artists,
      polls,
      events,
      totalVotes: artists.reduce((sum, a) => sum + (a.votes || 0), 0),
      totalInteractions: interactions.length,
    };
    await kv.set(snapshotKey, snapshot);

    // IMPORTANT: We NEVER delete or reset any data
    // All votes, interactions, and user data are preserved permanently
    // Analytics will show cumulative data from the beginning

    return c.json({
      success: true,
      message: "Monthly snapshot saved - all data preserved (nothing deleted)",
      archive: archiveDate,
      interactionsArchived: interactions.length,
      totalVotesPreserved: snapshot.totalVotes,
      note: "This endpoint only creates backups. No data was deleted or reset."
    });
  } catch (error) {
    console.log(`Error during monthly archive: ${error}`);
    return c.json({ error: "Failed to archive monthly data" }, 500);
  }
});

// Get monthly archives (for historical data viewing)
app.get("/make-server-74a49e83/archives", async (c) => {
  try {
    const archives = await kv.getByPrefix("archive:");
    const snapshots = await kv.getByPrefix("snapshot:");

    return c.json({ archives, snapshots });
  } catch (error) {
    console.log(`Error fetching archives: ${error}`);
    return c.json({ error: "Failed to fetch archives" }, 500);
  }
});

// RESTORE DATA from backup JSON (recovers votes from interaction records)
app.post("/make-server-74a49e83/restore-data", async (c) => {
  try {
    const body = await c.req.json();
    const { backupData } = body;

    if (!backupData || !Array.isArray(backupData)) {
      return c.json({ error: "Invalid backup data format" }, 400);
    }

    console.log(`Starting data restoration from ${backupData.length} records...`);

    // Parse the backup data
    const interactions: any[] = [];
    const artists: any[] = [];
    const polls: any[] = [];
    const events: any[] = [];

    for (const record of backupData) {
      const parsedValue = JSON.parse(record.value);

      if (record.key.startsWith("interaction:")) {
        interactions.push(parsedValue);
      } else if (record.key.startsWith("artist:")) {
        artists.push(parsedValue);
      } else if (record.key.startsWith("poll:")) {
        polls.push(parsedValue);
      } else if (record.key.startsWith("event:")) {
        events.push(parsedValue);
      }
    }

    console.log(`Parsed: ${interactions.length} interactions, ${artists.length} artists, ${polls.length} polls, ${events.length} events`);

    // Count votes from interactions
    const artistVoteCounts = new Map<string, number>();
    for (const interaction of interactions) {
      if (interaction.action === "wishlist" && interaction.artistId) {
        const count = artistVoteCounts.get(interaction.artistId) || 0;
        artistVoteCounts.set(interaction.artistId, count + 1);
      }
    }

    console.log(`Vote tallies:`, Object.fromEntries(artistVoteCounts));

    // Update artists with correct vote counts
    let updatedCount = 0;
    for (const artist of artists) {
      const voteCount = artistVoteCounts.get(artist.id) || 0;
      const updatedArtist = { ...artist, votes: voteCount };
      await kv.set(`artist:${artist.id}`, updatedArtist);
      console.log(`Restored ${artist.artistName}: ${voteCount} votes`);
      updatedCount++;
    }

    // Restore interactions
    let restoredInteractions = 0;
    for (const interaction of interactions) {
      const key = `interaction:${interaction.timestamp}:${interaction.userId}`;
      await kv.set(key, interaction);
      restoredInteractions++;
    }

    // Restore polls
    for (const poll of polls) {
      await kv.set(`poll:${poll.id}`, poll);
    }

    // Restore events
    for (const event of events) {
      await kv.set(`event:${event.id}`, event);
    }

    const totalVotes = Array.from(artistVoteCounts.values()).reduce((a, b) => a + b, 0);

    return c.json({
      success: true,
      message: "Data successfully restored from backup",
      restored: {
        artists: updatedCount,
        interactions: restoredInteractions,
        polls: polls.length,
        events: events.length,
        totalVotes: totalVotes,
      },
      voteTallies: Object.fromEntries(artistVoteCounts),
    });
  } catch (error) {
    console.log(`Error restoring data: ${error}`);
    return c.json({ error: `Failed to restore data: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);