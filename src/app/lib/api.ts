// API utilities for Supabase backend communication
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-74a49e83`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// ============================================
// TYPES
// ============================================

export interface ArtistWish {
  id: string;
  artistName: string;
  votes: number;
  genre: string;
  votesByUser?: Record<string, boolean>;
  createdAt?: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  votesByUser?: Record<string, boolean>;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
}

// ============================================
// INTERACTIONS API
// ============================================

export async function fetchInteractions() {
  try {
    const response = await fetch(`${API_BASE}/interactions`, { headers });
    if (!response.ok) throw new Error('Failed to fetch interactions');
    const data = await response.json();
    return data.interactions || [];
  } catch (error) {
    console.error('Error fetching interactions:', error);
    return [];
  }
}

export async function trackInteraction(interaction: {
  eventId?: string;
  artistId?: string;
  pollId?: string;
  action: 'interested' | 'vote' | 'wishlist';
  city?: string;
  userId: string;
  ageGroup?: string;
}) {
  try {
    const response = await fetch(`${API_BASE}/interactions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(interaction),
    });
    if (!response.ok) throw new Error('Failed to track interaction');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error tracking interaction:', error);
    throw error;
  }
}

// ============================================
// ARTIST WISHES API
// ============================================

export async function fetchArtistWishes() {
  try {
    const response = await fetch(`${API_BASE}/artist-wishes`, { headers });
    if (!response.ok) throw new Error('Failed to fetch artist wishes');
    const data = await response.json();
    return data.wishes || [];
  } catch (error) {
    console.error('Error fetching artist wishes:', error);
    return [];
  }
}

export async function checkArtistVotes(userId: string, artistIds: string[]) {
  try {
    const response = await fetch(`${API_BASE}/check-artist-votes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, artistIds }),
    });
    if (!response.ok) throw new Error('Failed to check artist votes');
    const data = await response.json();
    return data.votedArtists || {};
  } catch (error) {
    console.error('Error checking artist votes:', error);
    return {};
  }
}

export async function voteForArtist(artistId: string, userId: string, ageGroup?: string) {
  try {
    const response = await fetch(`${API_BASE}/artist-vote`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ artistId, userId, ageGroup }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to vote for artist');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error voting for artist:', error);
    throw error;
  }
}

export async function addArtist(artistName: string, genre: string) {
  try {
    const response = await fetch(`${API_BASE}/add-artist`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ artistName, genre }),
    });

    // Log response details for debugging
    console.log('Add artist response status:', response.status);

    // Get response text first
    const responseText = await response.text();
    console.log('Add artist response text:', responseText);

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', responseText);
      throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}`);
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add artist');
    }

    return data;
  } catch (error) {
    console.error('Error adding artist:', error);
    throw error;
  }
}

// ============================================
// POLLS API
// ============================================

export async function fetchPolls() {
  try {
    const response = await fetch(`${API_BASE}/polls`, { headers });
    if (!response.ok) throw new Error('Failed to fetch polls');
    const data = await response.json();
    return data.polls || [];
  } catch (error) {
    console.error('Error fetching polls:', error);
    return [];
  }
}

export async function checkPollVotes(userId: string, pollIds: string[]) {
  try {
    const response = await fetch(`${API_BASE}/check-poll-votes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, pollIds }),
    });
    if (!response.ok) throw new Error('Failed to check poll votes');
    const data = await response.json();
    return data.votedPolls || {};
  } catch (error) {
    console.error('Error checking poll votes:', error);
    return {};
  }
}

export async function voteInPoll(pollId: string, optionId: string, userId: string, ageGroup?: string) {
  try {
    const response = await fetch(`${API_BASE}/poll-vote`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ pollId, optionId, userId, ageGroup }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to vote in poll');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error voting in poll:', error);
    throw error;
  }
}

// ============================================
// EVENTS API
// ============================================

export async function fetchEvents() {
  try {
    const response = await fetch(`${API_BASE}/events`, { headers });
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function addEventInterest(eventId: string, userId: string) {
  try {
    const response = await fetch(`${API_BASE}/event-interest`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ eventId, userId }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add event interest');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding event interest:', error);
    throw error;
  }
}

// ============================================
// INITIALIZATION API
// ============================================

export async function initializeData() {
  try {
    const response = await fetch(`${API_BASE}/initialize`, {
      method: 'POST',
      headers,
    });
    if (!response.ok) throw new Error('Failed to initialize data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error initializing data:', error);
    throw error;
  }
}