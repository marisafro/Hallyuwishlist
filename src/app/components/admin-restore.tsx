// Admin tool to restore data from before the reset
import { useState } from "react";
import { RefreshCw, AlertCircle, CheckCircle, Database, Download, Upload, RotateCcw, ArrowDownUp } from "lucide-react";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from '/utils/supabase/info';
import artistBackupData from '../../imports/pasted_text/artist-data.json';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-74a49e83`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export function AdminRestore() {
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchCurrentData = async () => {
    setLoading(true);
    try {
      // Get current artists
      const response = await fetch(`${API_BASE}/artist-wishes`, { headers });
      if (response.ok) {
        const data = await response.json();
        console.log('Current artists:', data.wishes);
        setCurrentData(data.wishes);

        const totalVotes = data.wishes?.reduce((sum: number, a: any) => sum + (a.votes || 0), 0) || 0;
        setResult({
          success: true,
          message: `📊 Current Database Status:\n\nArtists: ${data.wishes?.length || 0}\nTotal Votes: ${totalVotes}\n\nVote breakdown:\n${data.wishes?.map((a: any) => `${a.artistName}: ${a.votes} votes`).join('\n')}`
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      setResult({
        success: false,
        message: `❌ Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const exportCurrentData = () => {
    if (!currentData) {
      alert('Please fetch current data first');
      return;
    }

    const dataStr = JSON.stringify(currentData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `artists-backup-${new Date().toISOString()}.json`;
    link.click();

    setResult({
      success: true,
      message: '✅ Data exported! Check your downloads folder for the backup file.'
    });
  };

  const restoreFromFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setRestoring(true);
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      console.log('Restoring from file:', backupData.length, 'records');

      const response = await fetch(`${API_BASE}/restore-data`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ backupData }),
      });

      const data = await response.json();
      console.log('Restore result:', data);

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: `✅ Data Restored Successfully!\n\n` +
            `Artists: ${data.restored.artists}\n` +
            `Interactions: ${data.restored.interactions}\n` +
            `Total Votes: ${data.restored.totalVotes}\n\n` +
            `Vote tallies:\n${Object.entries(data.voteTallies || {}).map(([id, count]) => `Artist ${id}: ${count} votes`).join('\n')}`
        });
      } else {
        setResult({
          success: false,
          message: `❌ Restoration failed: ${data.error || 'Unknown error'}`
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      setResult({
        success: false,
        message: `❌ Error: ${error.message}`
      });
    } finally {
      setRestoring(false);
    }
  };

  const restoreFromBackup = async () => {
    if (!confirm(`This will restore all vote data from the backup file (${artistBackupData.length} records). Continue?`)) {
      return;
    }

    setRestoring(true);
    try {
      console.log('Restoring from embedded backup:', artistBackupData.length, 'records');

      const response = await fetch(`${API_BASE}/restore-data`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ backupData: artistBackupData }),
      });

      const data = await response.json();
      console.log('Restore result:', data);

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: `✅ Data Restored Successfully!\n\n` +
            `Artists: ${data.restored.artists}\n` +
            `Interactions: ${data.restored.interactions}\n` +
            `Total Votes: ${data.restored.totalVotes}\n\n` +
            `Vote tallies:\n${Object.entries(data.voteTallies || {}).map(([id, count]) => `Artist ${id}: ${count} votes`).join('\n')}`
        });
      } else {
        setResult({
          success: false,
          message: `❌ Restoration failed: ${data.error || 'Unknown error'}`
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      setResult({
        success: false,
        message: `❌ Error: ${error.message}`
      });
    } finally {
      setRestoring(false);
    }
  };

  const syncNewArtists = async () => {
    setSyncing(true);
    try {
      console.log('Syncing new artists from code to database...');

      const response = await fetch(`${API_BASE}/initialize`, {
        method: 'POST',
        headers,
      });

      const data = await response.json();
      console.log('Sync result:', data);

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: `✅ Sync Complete!\n\n${data.message}\n\n${data.note || ''}`
        });
      } else {
        setResult({
          success: false,
          message: `❌ Sync failed: ${data.error || 'Unknown error'}`
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      setResult({
        success: false,
        message: `❌ Error: ${error.message}`
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Database className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Recovery & Restoration</h1>
          <p className="text-gray-600">Restore vote data from backup or check current counts</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900">Admin Tools</p>
              <p className="text-sm text-yellow-800 mt-1">
                Restore votes from backup or sync new artists added to the code.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <motion.button
            onClick={restoreFromBackup}
            disabled={restoring}
            whileHover={{ scale: restoring ? 1 : 1.02 }}
            whileTap={{ scale: restoring ? 1 : 0.98 }}
            className={`w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold text-lg flex items-center justify-center gap-2 ${
              restoring ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
          >
            {restoring ? (
              <>
                <RefreshCw className="size-5 animate-spin" />
                Restoring...
              </>
            ) : (
              <>
                <RotateCcw className="size-5" />
                ⚡ One-Click Restore from Backup
              </>
            )}
          </motion.button>

          <motion.button
            onClick={syncNewArtists}
            disabled={syncing}
            whileHover={{ scale: syncing ? 1 : 1.02 }}
            whileTap={{ scale: syncing ? 1 : 0.98 }}
            className={`w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-lg flex items-center justify-center gap-2 ${
              syncing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
          >
            {syncing ? (
              <>
                <RefreshCw className="size-5 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <ArrowDownUp className="size-5" />
                Sync New Artists to Database
              </>
            )}
          </motion.button>

          <div className="border-t border-gray-200 pt-4 space-y-4">
            <motion.button
              onClick={fetchCurrentData}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg flex items-center justify-center gap-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Database className="size-5" />
                  View Current Vote Counts
                </>
              )}
            </motion.button>

            {currentData && (
              <motion.button
                onClick={exportCurrentData}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-lg"
              >
                <Download className="size-5" />
                Export Backup (JSON)
              </motion.button>
            )}

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={restoreFromFile}
                id="restore-file"
                className="hidden"
              />
              <motion.label
                htmlFor="restore-file"
                whileHover={{ scale: restoring ? 1 : 1.02 }}
                whileTap={{ scale: restoring ? 1 : 0.98 }}
                className={`w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-lg flex items-center justify-center gap-2 cursor-pointer ${
                  restoring ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
              >
                {restoring ? (
                  <>
                    <RefreshCw className="size-5 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <Upload className="size-5" />
                    Upload & Restore JSON File
                  </>
                )}
              </motion.label>
            </div>
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
              result.success
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {result.success ? (
              <CheckCircle className="size-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="size-5 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-mono text-sm whitespace-pre-line">{result.message}</p>
            </div>
          </motion.div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Manual Data Entry</h3>
          <p className="text-sm text-gray-700 mb-4">
            If you remember the vote counts from an hour ago, you can tell me what they were and I'll help restore them manually.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <strong>Example:</strong> "SEVENTEEN had 45 votes, IVE had 32 votes, BTS had 67 votes..."
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Once you provide the vote counts, I can write a script to restore them.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
