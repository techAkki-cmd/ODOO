import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft } from "lucide-react";

const Request = ({ onNavigate, profileData }) => {
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState("");
  const [selectedWantedSkill, setSelectedWantedSkill] = useState("");
  const [message, setMessage] = useState("");

  // Your available skills - in real app this would come from user's profile
  const yourSkills = ["React", "Node.js", "TypeScript", "JavaScript", "Python", "MongoDB", "Express.js"];

  const handleSubmit = () => {
    if (!selectedOfferedSkill || !selectedWantedSkill) {
      alert("Please select both skills for the swap!");
      return;
    }
    alert(`Swap request sent!\nYour skill: ${selectedOfferedSkill}\nTheir skill: ${selectedWantedSkill}\nMessage: ${message}`);
    // In real app, you would send this data to your backend
    // After successful submission, navigate back to profile
    onNavigate('profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #667eea 0%, transparent 50%), radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%), radial-gradient(circle at 40% 80%, #f093fb 0%, transparent 50%)",
            "radial-gradient(circle at 60% 20%, #667eea 0%, transparent 50%), radial-gradient(circle at 20% 80%, #764ba2 0%, transparent 50%), radial-gradient(circle at 80% 40%, #f093fb 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, #667eea 0%, transparent 50%), radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%), radial-gradient(circle at 40% 80%, #f093fb 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/10 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => onNavigate('profile')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </motion.button>
              
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"
              >
                <span className="text-2xl">⚡</span>
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                  Send Swap Request
                </h1>
                <p className="text-white/80 text-sm font-medium">
                  Connect with {profileData?.name || 'other learners'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                onClick={() => onNavigate('profile')}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200"
              >
                Back to Profile
              </Button>
              <Button 
                onClick={() => onNavigate('home')}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200"
              >
                Home
              </Button>
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/30">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.header>


          <div className="max-w-full w-full mx-auto px-4">
            <div className="flex items-center justify-center">
              {/* Request Form */}
              <motion.div
                className="w-full"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Details</h2>
                    
                    <div className="space-y-6">
                      {/* Choose Offered Skill */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Choose one of your skills to offer
                        </label>
                        <select
                          value={selectedOfferedSkill}
                          onChange={(e) => setSelectedOfferedSkill(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select your skill to offer...</option>
                          {yourSkills.map((skill, index) => (
                            <option key={index} value={skill}>{skill}</option>
                          ))}
                        </select>
                      </div>

                      {/* Choose Wanted Skill */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Choose one of their skills you want to learn
                        </label>
                        <select
                          value={selectedWantedSkill}
                          onChange={(e) => setSelectedWantedSkill(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select skill you want to learn...</option>
                          {profileData?.skillsWanted?.map((skill, index) => (
                            <option key={index} value={skill}>{skill}</option>
                          ))}
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Personal Message
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Write a message to introduce yourself and explain what you'd like to learn..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none h-32"
                        />
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handleSubmit}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          Send Swap Request
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Request;