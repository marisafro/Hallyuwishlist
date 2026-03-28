const BASE_URL = "https://fijkrfrsizekurnotioe.supabase.co/functions/v1/make-server-74a49e83";

export async function fetchArtistWishes() {
  const res = await fetch(`${BASE_URL}/artist-wishes`);
  const data = await res.json();
  return data.wishes || [];
}

export async function fetchEvents() {
  const res = await fetch(`${BASE_URL}/events`);
  const data = await res.json();
  return data.events || [];
}

export async function fetchPolls() {
  const res = await fetch(`${BASE_URL}/polls`);
  const data = await res.json();
  return data.polls || [];
}

export async function fetchInteractions() {
  const res = await fetch(`${BASE_URL}/interactions`);
  const data = await res.json();
  return data.interactions || [];
}