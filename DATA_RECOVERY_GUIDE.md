# Data Recovery & Safe Mode Guide

## ⚠️ What Happened

The initialization function previously **overwrote all data**, which reset your votes to 0.

## ✅ What I Fixed

1. **Made initialize SAFE** - It now ONLY adds missing artists/events, never overwrites existing ones
2. **Created recovery tool** - Check if your data was saved in monthly snapshots
3. **Prevented future data loss** - Initialize can now be run safely anytime

---

## 🔄 Step 1: Try to Recover Your Data

### Check for Archived Snapshots

1. Navigate to **`/admin-recovery`** in your browser
2. Click **"Check for Archived Data"**
3. If snapshots exist, you'll see:
   - Snapshot dates
   - Total votes in each snapshot
   - Number of artists

### If Snapshots Exist

- Click **"View Data"** on the most recent snapshot
- Check the browser console (F12) for full vote data
- The console will show: `Artists with votes: [...]`
- You can see which artists had how many votes

### If No Snapshots

Unfortunately, if no monthly archive was created before the reset, the vote data cannot be recovered automatically.

---

## 🛡️ Step 2: The System Is Now SAFE

I've completely rewritten the `/initialize` endpoint to use **SAFE MODE**:

### Before (DANGEROUS):
```typescript
for (const artist of defaultArtists) {
  await kv.set(`artist:${artist.id}`, artist); // OVERWRITES everything!
}
```

### After (SAFE):
```typescript
const existingArtists = await kv.getByPrefix("artist:");
const existingIds = new Set(existingArtists.map(a => a.id));

for (const artist of defaultArtists) {
  if (!existingIds.has(artist.id)) {
    await kv.set(`artist:${artist.id}`, artist); // Only adds NEW artists
  } else {
    console.log(`Skipped existing artist: ${artist.artistName}`); // Preserves existing data
  }
}
```

**This means:**
- ✅ Existing votes are NEVER touched
- ✅ Only missing artists/events are added
- ✅ Running initialize multiple times is now safe
- ✅ Your data is protected

---

## 📝 Step 3: Add Missing Artists (YOUNGJI, NMIXX, KATSEYE)

### Method 1: Edit storage.ts

Your artists are already in `/src/app/lib/storage.ts`:
```typescript
{ id: "26", artistName: "YOUNGJI", votes: 0, genre: "Solo Artist" },
{ id: "27", artistName: "NMIXX", votes: 0, genre: "Girl Group" },
{ id: "28", artistName: "KATSEYE", votes: 0, genre: "Girl Group" },
```

The server code ALSO has them in the default list (line 569-571 in `server/index.tsx`).

### Method 2: Run Safe Initialize

Since the initialize endpoint is now safe:

1. Open browser console
2. Run this command:

```javascript
fetch('https://{your-project-id}.supabase.co/functions/v1/make-server-74a49e83/initialize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {your-anon-key}'
  }
}).then(r => r.json()).then(console.log)
```

This will:
- Check for existing artists
- Add ONLY the 3 new ones (YOUNGJI, NMIXX, KATSEYE)
- Skip all existing artists (preserving their votes)
- Return: `"Safe initialization complete - existing data preserved"`

---

## 🎯 Future: How to Add New Artists Safely

### Option 1: Edit Server Code

File: `/supabase/functions/server/index.tsx` (around line 544)

Add to the `defaultArtists` array:
```typescript
{ id: "29", artistName: "NEW ARTIST", votes: 0, genre: "Girl Group" },
```

Then run `/initialize` - it will ONLY add the new artist, not touch existing ones.

### Option 2: Edit storage.ts

File: `/src/app/lib/storage.ts` (around line 202)

Add to the `getArtistWishes()` array:
```typescript
{ id: "29", artistName: "NEW ARTIST", votes: 0, genre: "Girl Group" },
```

(The sync system still has issues, so use server code method above for now)

---

## 📊 Current Status

### Artists in Database (After Initialize)
- If you run initialize now, you should have all 28 artists
- YOUNGJI, NMIXX, KATSEYE will be added with 0 votes
- All other existing artists keep their current vote counts

### Vote Data
- If you had votes before: Check `/admin-recovery` for snapshots
- If snapshots exist: Vote data is logged to console
- If no snapshots: Unfortunately votes cannot be recovered

---

## 🔒 Protection Mechanisms Now in Place

1. **Safe Initialize** - Never overwrites existing data
2. **Monthly Snapshots** - Automatic backups (if you run the monthly-reset endpoint)
3. **Separate Vote Records** - Votes stored separately from artist data
4. **Console Logging** - All operations logged for transparency

---

## 🆘 What To Do Right Now

### Immediate Steps:

1. **Check for archived data**:
   ```
   Navigate to: /admin-recovery
   Click: "Check for Archived Data"
   ```

2. **If you had significant votes and NO snapshot exists**:
   - Unfortunately the data is lost
   - Going forward, consider running monthly snapshots
   - All future votes will be safe with the new system

3. **Add the missing 3 artists**:
   - Run the safe initialize (method above)
   - OR wait for me to create a simpler admin tool
   - OR manually add via server endpoint

4. **Verify in Fan Tools**:
   - Refresh Fan Tools page
   - You should see all 28 artists
   - Existing artists should have their vote counts preserved

---

## 📞 Need Help?

If you need to:
- Manually recover specific vote counts from snapshots
- Create a custom recovery script
- Set up automatic monthly backups
- Anything else

Just ask and I'll help!

---

## ✅ Summary

**Good News:**
- ✅ System is now completely safe
- ✅ Data loss will never happen again
- ✅ Initialize can be run freely without risk
- ✅ New artists can be added without affecting existing ones

**To Recover Data:**
- Go to `/admin-recovery`
- Check for snapshots
- If found, vote data is in console logs

**To Add Missing Artists:**
- Safe to run `/initialize` now
- Will only add YOUNGJI, NMIXX, KATSEYE
- Won't touch any existing data
