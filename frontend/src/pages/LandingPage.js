import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Shield,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import heroImage from "../assets/hero-bg.jpg"; // Make sure the path is correct

const features = [
  {
    icon: Search,
    title: "Find Skills",
    description: "Browse through thousands of skills offered by our community members",
  },
  {
    icon: BookOpen,
    title: "Share Knowledge",
    description: "List your expertise and help others while learning new skills yourself",
  },
  {
    icon: Shield,
    title: "Safe Swapping",
    description: "Secure platform with ratings and reviews for trusted exchanges",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <style>{`
        .bg-gradient-primary {
          background-image: linear-gradient(to right, #7F5AF0, #2CB1FF);
        }
        .bg-gradient-hero {
          background-image: linear-gradient(to right, #7F5AF0cc, #2CB1FFcc);
        }
      `}</style>

      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center text-white">
              <Users size={20} />
            </div>
            <span className="font-bold text-lg text-transparent bg-gradient-primary bg-clip-text">
              SkillSwap
            </span>
          </div>
          <div className="hidden md:flex gap-6">
            <Link to="/browse-skills" className="hover:text-blue-500">Browse Skills</Link>
            <a href="#how-it-works" className="hover:text-blue-500">How It Works</a>
            <a href="#community" className="hover:text-blue-500">Community</a>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 hover:bg-gray-100 rounded-md">Sign In</button>
            <button className="px-4 py-2 bg-gradient-primary text-white rounded-md hover:opacity-90 transition">Join Now</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero z-10 opacity-80" />
        <img
          src={heroImage}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-20 py-32 px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Share Skills,<br />
            <span className="bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              Grow Together
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Connect with people around the world to exchange knowledge, learn new skills,
            and build meaningful relationships through our secure skill-swapping platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-gradient-primary rounded-md text-white flex items-center justify-center gap-2 hover:opacity-90 transition">
              Start Swapping Skills
              <ArrowRight size={20} />
            </button>
            <Link to="/browse-skills">
              <button className="px-6 py-3 border border-white text-white rounded-md hover:bg-white/10 transition">
                Browse Skills
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SkillSwap?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-primary rounded-full text-white">
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-6 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} SkillSwap. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
