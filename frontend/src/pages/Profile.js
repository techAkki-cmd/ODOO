import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, Save, X, Plus, Trash2, Camera } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // ✅ UPDATED: Real profile data from backend
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    bio: "",
    skillsOffered: [],
    skillsWanted: [],
    availability: "weekend",
    isProfilePublic: true,
    profilePhoto: "",
    averageRating: 0,
    completedSwaps: 0,
    totalReviews: 0
  });

  const [editData, setEditData] = useState({ ...profileData });
  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");

  // API configuration
  const API_BASE_URL = 'http://localhost:8080/api';

  // ✅ Load user profile data on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profile/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load profile');
      }

      const userData = await response.json();
      setProfileData(userData);
      setEditData(userData);
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save profile changes to backend
  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/auth');
        return;
      }

      // Update basic profile info
      const profileUpdateResponse = await fetch(`${API_BASE_URL}/profile/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: editData.firstName,
          lastName: editData.lastName,
          bio: editData.bio,
          location: editData.location,
          isProfilePublic: editData.isProfilePublic,
          availability: editData.availability.toUpperCase()
        })
      });

      if (!profileUpdateResponse.ok) {
        throw new Error('Failed to update profile');
      }

      // Update skills
      const skillsUpdateResponse = await fetch(`${API_BASE_URL}/profile/me/skills`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skillsOffered: editData.skillsOffered,
          skillsWanted: editData.skillsWanted
        })
      });

      if (!skillsUpdateResponse.ok) {
        throw new Error('Failed to update skills');
      }

      // Update local state
      setProfileData({ ...editData });
      setIsEditing(false);

      // Show success message
      alert('Profile updated successfully!');

    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
    setNewSkillOffered("");
    setNewSkillWanted("");
    setError(null);
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

  // ✅ Handle photo upload
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch(`${API_BASE_URL}/profile/me/photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        // Reload profile data to get updated photo URL
        await loadUserProfile();
        alert('Profile photo updated successfully!');
      } else {
        throw new Error('Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Failed to upload photo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="bg-white/20 p-8 rounded-2xl backdrop-blur-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
          />
          <p className="text-white font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* All your existing background elements... */}
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

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* ✅ UPDATED Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate('/')}
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
                    disabled={saving}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 border border-emerald-300/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    onClick={handleDiscard}
                    disabled={saving}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-100 border border-red-300/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Discard
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate('/swaprequests')}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200"
                  >
                    Swap Requests
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200"
                  >
                    Home
                  </Button>
                </>
              )}
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/30">
                <img
                  src={profileData.profilePhoto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.header>

          {/* ✅ Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 text-center max-w-4xl mx-auto">
                <p className="text-white font-medium">{error}</p>
                <Button
                  onClick={() => setError(null)}
                  className="mt-2 bg-white/20 hover:bg-white/30 text-white rounded-lg"
                >
                  Dismiss
                </Button>
              </div>
            </motion.div>
          )}

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ✅ UPDATED Profile Photo Section */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <div className="w-48 h-48 rounded-full overflow-hidden ring-4 ring-purple-200 shadow-lg mx-auto mb-4 relative">
                        <img
                          src={profileData.profilePhoto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                        {isEditing && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="w-8 h-8 text-white" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Profile Photo</h3>

                      {/* ✅ Profile Stats */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Rating:</span>
                          <span className="font-semibold">⭐ {profileData.averageRating?.toFixed(1) || '0.0'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Swaps:</span>
                          <span className="font-semibold">{profileData.completedSwaps || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Reviews:</span>
                          <span className="font-semibold">{profileData.totalReviews || 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* ✅ UPDATED Profile Form Section */}
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
                      {/* ✅ UPDATED First Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.firstName || ""}
                            onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          />
                        ) : (
                          <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800">
                            {profileData.firstName || "Not set"}
                          </div>
                        )}
                      </div>

                      {/* ✅ UPDATED Last Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.lastName || ""}
                            onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          />
                        ) : (
                          <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800">
                            {profileData.lastName || "Not set"}
                          </div>
                        )}
                      </div>

                      {/* ✅ Email (Read-only) */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800">
                          {profileData.email}
                        </div>
                      </div>

                      {/* ✅ Bio */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Bio
                        </label>
                        {isEditing ? (
                          <textarea
                            value={editData.bio || ""}
                            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            placeholder="Tell others about yourself and your expertise..."
                          />
                        ) : (
                          <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 min-h-[100px]">
                            {profileData.bio || "No bio added yet"}
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
                            value={editData.location || ""}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g., San Francisco, CA"
                          />
                        ) : (
                          <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800">
                            {profileData.location || "Not set"}
                          </div>
                        )}
                      </div>

                      {/* Skills Offered - Same as your original code */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Skills Offered
                        </label>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {(isEditing ? editData.skillsOffered : profileData.skillsOffered)?.map((skill, index) => (
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

                      {/* Skills Wanted - Same as your original code */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Skills Wanted
                        </label>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {(isEditing ? editData.skillsWanted : profileData.skillsWanted)?.map((skill, index) => (
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

                      {/* ✅ UPDATED Availability */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Availability
                        </label>
                        {isEditing ? (
                          <select
                            value={editData.availability?.toLowerCase() || "weekend"}
                            onChange={(e) => setEditData({ ...editData, availability: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="weekend">Weekend</option>
                            <option value="working">Working Days</option>
                            <option value="flexible">Flexible</option>
                          </select>
                        ) : (
                          <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 capitalize">
                            {profileData.availability?.toLowerCase() || "weekend"}
                          </div>
                        )}
                      </div>

                      {/* ✅ UPDATED Profile Type */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Profile Type
                        </label>
                        {isEditing ? (
                          <select
                            value={editData.isProfilePublic ? "public" : "private"}
                            onChange={(e) => setEditData({ ...editData, isProfilePublic: e.target.value === "public" })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                          </select>
                        ) : (
                          <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 capitalize">
                            {profileData.isProfilePublic ? "Public" : "Private"}
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
