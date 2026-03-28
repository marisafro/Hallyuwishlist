# Supabase Initialization Guide for Aegean Hallyu

## 1. Full Edge Function Source Code

The `/make-server-74a49e83/initialize` endpoint is located in `/supabase/functions/server/index.tsx`.

### Complete Endpoint Code:

```typescript
app.post("/make-server-74a49e83/initialize", async (c) => {
  try {
    // Initialize artist wishes
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
    ];

    for (const artist of defaultArtists) {
      await kv.set(`artist:${artist.id}`, artist);
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

    for (const poll of defaultPolls) {
      await kv.set(`poll:${poll.id}`, poll);
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
        image: "https://instagram.fath4-2.fna.fbcdn.net/v/t51.82787-19/648754418_17982580757950936_3335102880794334532_n.jpg",
        description: "...",
        capacity: 2000,
        interestedCount: 0,
      },
    ];

    for (const event of defaultEvents) {
      await kv.set(`event:${event.id}`, event);
    }

    return c.json({ success: true, message: "Default data initialized" });
  } catch (error) {
    console.log(`Error initializing data: ${error}`);
    return c.json({ error: "Failed to initialize data" }, 500);
  }
});
```

### What This Does:
- Creates 25 K-pop artists in the database with 0 votes
- Creates 2 polls with their options
- Creates 4 events with details (capacity, venue, date, etc.)
- All data is stored in Supabase KV store with prefixed keys

---

## 2. Exact HTTP POST Request

### Your Project Details:
- **Project ID**: `fijkrfrsizekurnotioe`
- **Full URL**: `https://fijkrfrsizekurnotioe.supabase.co/functions/v1/make-server-74a49e83/initialize`

### Request Details:

**Method**: `POST`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpamtyZnJzaXpla3Vybm90aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg3MTYsImV4cCI6MjA4ODU2NDcxNn0.kVHBGa4XhSc70sllk49Ib7rKVn7kAPTbahOvx4fsJ4I
```

**Request Body**: 
```
(empty body - no JSON needed)
```

---

## 3. Expected Response

### Success Response:

**Status Code**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "Default data initialized"
}
```

### Error Response (if something goes wrong):

**Status Code**: `500 Internal Server Error`

**Response Body**:
```json
{
  "error": "Failed to initialize data"
}
```

---

## How to Make the Request

### Option 1: Using cURL (Terminal/Command Line)

```bash
curl -X POST \
  https://fijkrfrsizekurnotioe.supabase.co/functions/v1/make-server-74a49e83/initialize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpamtyZnJzaXpla3Vybm90aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg3MTYsImV4cCI6MjA4ODU2NDcxNn0.kVHBGa4XhSc70sllk49Ib7rKVn7kAPTbahOvx4fsJ4I"
```

### Option 2: Using Postman

1. Open Postman
2. Create a new request
3. Set method to **POST**
4. URL: `https://fijkrfrsizekurnotioe.supabase.co/functions/v1/make-server-74a49e83/initialize`
5. Go to **Headers** tab:
   - Add `Content-Type`: `application/json`
   - Add `Authorization`: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpamtyZnJzaXpla3Vybm90aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg3MTYsImV4cCI6MjA4ODU2NDcxNn0.kVHBGa4XhSc70sllk49Ib7rKVn7kAPTbahOvx4fsJ4I`
6. Leave **Body** empty (or select "none")
7. Click **Send**

### Option 3: Using JavaScript/Fetch (Browser Console)

```javascript
fetch('https://fijkrfrsizekurnotioe.supabase.co/functions/v1/make-server-74a49e83/initialize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpamtyZnJzaXpla3Vybm90aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg3MTYsImV4cCI6MjA4ODU2NDcxNn0.kVHBGa4XhSc70sllk49Ib7rKVn7kAPTbahOvx4fsJ4I'
  }
})
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

### Option 4: Using Python

```python
import requests

url = "https://fijkrfrsizekurnotioe.supabase.co/functions/v1/make-server-74a49e83/initialize"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpamtyZnJzaXpla3Vybm90aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg3MTYsImV4cCI6MjA4ODU2NDcxNn0.kVHBGa4XhSc70sllk49Ib7rKVn7kAPTbahOvx4fsJ4I"
}

response = requests.post(url, headers=headers)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")
```

---

## After Initialization

Once you run the initialization successfully, your Supabase database will contain:

### KV Store Keys Created:

**Artists** (25 keys):
```
artist:1 → { id: "1", artistName: "SEVENTEEN", votes: 0, genre: "Boy Group" }
artist:2 → { id: "2", artistName: "TXT (Tomorrow X Together)", votes: 0, genre: "Boy Group" }
...
artist:25 → { id: "25", artistName: "TRENDZ", votes: 0, genre: "Boy Group" }
```

**Polls** (2 keys):
```
poll:1 → { id: "1", question: "...", options: [...] }
poll:2 → { id: "2", question: "...", options: [...] }
```

**Events** (4 keys):
```
event:1 → { id: "1", title: "LEVEL10KCONVENTION 2026 - Athens", ... }
event:2 → { id: "2", title: "TRENDZ", ... }
event:3 → { id: "3", title: "LEVEL10KCONVENTION 2026 Thessaloniki", ... }
event:4 → { id: "4", title: "Choom KPOP FESTIVAL - Thessaloniki", ... }
```

### Verify Initialization:

You can verify the data was created by visiting your KPI Dashboard at:
`/kpi-dashboard`

The dashboard will show:
- All 25 artists with 0 votes
- Poll results
- Event listings
- KPI metrics

---

## Monthly Data Archival

To archive data at the end of each month, make another POST request:

**URL**: `https://fijkrfrsizekurnotioe.supabase.co/functions/v1/make-server-74a49e83/monthly-reset`

**Headers**: Same as initialization

**Expected Response**:
```json
{
  "success": true,
  "message": "Monthly data archived successfully",
  "archive": "2026-03",
  "interactionsArchived": 1234
}
```

This creates monthly snapshots and archives for historical analysis.

---

## Troubleshooting

### If you get a 404 error:
- Make sure your Edge Function is deployed in Supabase
- Check that the function is named exactly `make-server-74a49e83`

### If you get a CORS error:
- The function has CORS enabled for all origins
- Make sure you're including the Authorization header

### If you get a 401 Unauthorized:
- Verify your Authorization token is correct
- The token should match the one in `/utils/supabase/info.tsx`

### If you get a 500 error:
- Check the Supabase Edge Function logs in your Supabase dashboard
- The error will be logged with details about what went wrong

---

## Summary

**Initialization is a one-time setup** that populates your database with:
- ✅ 25 K-pop artists
- ✅ 2 polls with options
- ✅ 4 events

**You only need to run this once** when first setting up the application.

After initialization, all fan interactions (votes, polls, event interest) will be automatically tracked and the KPI dashboard will show real-time analytics with monthly comparisons.
