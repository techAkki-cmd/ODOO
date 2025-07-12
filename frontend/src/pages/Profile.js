import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, Save, X, Plus, Trash2 } from "lucide-react";

const Profile = ({ onNavigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Marc Demo",
    location: "San Francisco, CA",
    skillsOffered: ["React", "Node.js", "TypeScript"],
    skillsWanted: ["UI Design", "Figma"],
    availability: "weekend",
    profileType: "public",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  });

  const [editData, setEditData] = useState({ ...profileData });
  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");

  const handleSave = () => {
    setProfileData({ ...editData });
    setIsEditing(false);
  };

  const handleDiscard = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
    setNewSkillOffered("");
    setNewSkillWanted("");
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim()) {
      setEditData({
        ...editData,
        skillsOffered: [...editData.skillsOffered, newSkillOffered.trim()]
      });
      setNewSkillOffered("");
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim()) {
      setEditData({
        ...editData,
        skillsWanted: [...editData.skillsWanted, newSkillWanted.trim()]
      });
      setNewSkillWanted("");
    }
  };

  const removeSkillOffered = (index) => {
    setEditData({
      ...editData,
      skillsOffered: editData.skillsOffered.filter((_, i) => i !== index)
    });
  };

  const removeSkillWanted = (index) => {
    setEditData({
      ...editData,
      skillsWanted: editData.skillsWanted.filter((_, i) => i !== index)
    });
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
                onClick={() => onNavigate('home')}
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
                <span className="text-2xl">👤</span>
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                  User Profile
                </h1>
                <p className="text-white/80 text-sm font-medium">
                  Manage your profile information
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleSave}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 border border-emerald-300/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button 
                    onClick={handleDiscard}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-100 border border-red-300/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Discard
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => onNavigate('swapRequests')}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200"
                  >
                    Swap Requests
                  </Button>
                  <Button 
                    onClick={() => onNavigate('home')}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200"
                  >
                    Home
                  </Button>
                </>
              )}
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/30">
                <img 
                  src={profileData.photo}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.header>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Photo Section */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <div className="w-48 h-48 rounded-full overflow-hidden ring-4 ring-purple-200 shadow-lg mx-auto mb-4">
                        <img 
                          src={profileData.photo} 
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Profile Photo</h3>
                      {isEditing && (
                        <Button className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg text-sm">
                          Add/Edit Photo
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Profile Form Section */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2"
              >
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                      {!isEditing && (
                        <Button 
                          onClick={() => setIsEditing(true)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-semibold"
                        >
                          Edit Profile
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          />
                        ) : (
                          <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800">
                            {profileData.name}
                          </div>
                        )}
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Location
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.location}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          />
                        ) : (
                          <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800">
                            {profileData.location}
                          </div>
                        )}
                      </div>

                      {/* Skills Offered */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Skills Offered
                        </label>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {(isEditing ? editData.skillsOffered : profileData.skillsOffered).map((skill, index) => (
                              <span 
                                key={index}
                                className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                              >
                                {skill}
                                {isEditing && (
                                  <button
                                    onClick={() => removeSkillOffered(index)}
                                    className="text-emerald-500 hover:text-emerald-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </span>
                            ))}
                          </div>
                          {isEditing && (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newSkillOffered}
                                onChange={(e) => setNewSkillOffered(e.target.value)}
                                placeholder="Add new skill..."
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                              />
                              <Button
                                onClick={addSkillOffered}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Skills Wanted */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Skills Wanted
                        </label>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {(isEditing ? editData.skillsWanted : profileData.skillsWanted).map((skill, index) => (
                              <span 
                                key={index}
                                className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                              >
                                {skill}
                                {isEditing && (
                                  <button
                                    onClick={() => removeSkillWanted(index)}
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </span>
                            ))}
                          </div>
                          {isEditing && (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newSkillWanted}
                                onChange={(e) => setNewSkillWanted(e.target.value)}
                                placeholder="Add new skill..."
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                              />
                              <Button
                                onClick={addSkillWanted}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Availability */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Availability
                        </label>
                        {isEditing ? (
                          <select
                            value={editData.availability}
                            onChange={(e) => setEditData({ ...editData, availability: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="weekend">Weekend</option>
                            <option value="working">Working Days</option>
                          </select>
                        ) : (
                          <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 capitalize">
                            {profileData.availability}
                          </div>
                        )}
                      </div>

                      {/* Profile Type */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Profile Type
                        </label>
                        {isEditing ? (
                          <select
                            value={editData.profileType}
                            onChange={(e) => setEditData({ ...editData, profileType: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                          </select>
                        ) : (
                          <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 capitalize">
                            {profileData.profileType}
                          </div>
                        )}
                      </div>
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

export default Profile;