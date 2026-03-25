import { motion, AnimatePresence } from "motion/react";
import { X, Users } from "lucide-react";

interface AgeGroupModalProps {
  isOpen: boolean;
  onSelect: (ageGroup: string) => void;
  onClose?: () => void;
}

export function AgeGroupModal({ isOpen, onSelect, onClose }: AgeGroupModalProps) {
  const ageGroups = [
    { value: "10-20", label: "10-20 years", emoji: "🎓" },
    { value: "20-30", label: "20-30 years", emoji: "💼" },
    { value: "30-40", label: "30-40 years", emoji: "👔" },
    { value: "40-50", label: "40-50 years", emoji: "🎯" },
    { value: "50+", label: "50+ years", emoji: "⭐" },
  ];

  const handleSelect = (value: string) => {
    onSelect(value);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-red-50 rounded-3xl shadow-2xl max-w-md w-full border-2 border-blue-200 pointer-events-auto overflow-hidden"
            >
              {/* Animated background */}
              <div className="absolute inset-0 opacity-30">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute size-20 bg-gradient-to-br from-blue-400 to-red-400 rounded-full blur-2xl"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      x: [0, Math.random() * 50 - 25],
                      y: [0, Math.random() * 50 - 25],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                ))}
              </div>

              <div className="relative p-8">
                {/* Close button - only show if onClose is provided */}
                {onClose && (
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 transition-colors"
                  >
                    <X className="size-5 text-gray-700" />
                  </button>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-red-600 rounded-full mb-4 shadow-lg"
                  >
                    <Users className="size-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                    Welcome to Aegean Hallyu!
                  </h2>
                  <p className="text-gray-700">
                    Help us understand our community better by selecting your age group
                  </p>
                </div>

                {/* Age group options */}
                <div className="space-y-3">
                  {ageGroups.map((group, index) => (
                    <motion.button
                      key={group.value}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(group.value)}
                      className="w-full flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 transition-all border-2 border-transparent hover:border-blue-300 shadow-sm"
                    >
                      <span className="text-3xl">{group.emoji}</span>
                      <span className="font-semibold text-gray-900 text-lg">{group.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Info text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 p-4 bg-white/50 rounded-xl border border-blue-200"
                >
                  <p className="text-sm text-gray-600 text-center">
                    🔒 Your information helps event organizers understand the K-pop community in Greece. 
                    No personal data is collected.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
