import { Link } from "react-router";
import { Calendar, Heart, BarChart3, Sparkles, TrendingUp, Users, Star, Menu } from "lucide-react";
import { motion } from "motion/react";
import { format } from "date-fns";


export function ContactUs() {
  
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
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Contact Us<br />
              <motion.span
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
           
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
            >
              Companies' Inquiries & Fan Suggestions
            </motion.p>
          
            
        <h3 className="text-align:center"> hallyuwishlist@gmail.com</h3>
          </motion.div>
        </div>
         </section>
        </div>
     
  
    );}
   