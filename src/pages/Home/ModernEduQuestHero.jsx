import React, { useState, useEffect } from "react";
import { Search, Play, Users, BookOpen, Award, ArrowRight, Star, Clock, TrendingUp } from "lucide-react";

const ModernEduQuestHero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const heroSlides = [
    {
      title: "Transform Your Career with Expert-Led Courses",
      subtitle: "Join over 50,000+ students mastering in-demand skills",
      highlight: "AI & Machine Learning",
      bg: "from-purple-900 via-blue-900 to-indigo-900"
    },
    {
      title: "Learn from Industry Leaders & Innovators",
      subtitle: "Premium content crafted by top professionals",
      highlight: "Web Development",
      bg: "from-blue-900 via-indigo-900 to-purple-900"
    },
    {
      title: "Build Real Projects, Get Real Results",
      subtitle: "Hands-on learning with portfolio-ready projects",
      highlight: "Data Science",
      bg: "from-indigo-900 via-purple-900 to-pink-900"
    }
  ];

  const features = [
    { icon: <Users className="w-5 h-5" />, text: "50K+ Active Students", count: "50,000+" },
    { icon: <BookOpen className="w-5 h-5" />, text: "500+ Premium Courses", count: "500+" },
    { icon: <Award className="w-5 h-5" />, text: "Industry Certificates", count: "100%" },
    { icon: <Star className="w-5 h-5" />, text: "4.9/5 Student Rating", count: "4.9/5" }
  ];

  const popularCategories = [
    "Web Development", "Data Science", "AI & ML", "Design", "Business", "Marketing"
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const currentHero = heroSlides[currentSlide];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900">
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentHero.bg} transition-all duration-1000`}>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              <div className="w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
            </div>
          ))}
        </div>

        {/* Geometric Shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Stats Bar */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex flex-wrap justify-center gap-8 text-white">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 opacity-90">
                  {feature.icon}
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Heading */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-400 text-black text-sm font-bold rounded-full mb-6 animate-bounce">
                  🚀 New: {currentHero.highlight} Bootcamp Available
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                  {currentHero.title.split(' ').slice(0, 3).join(' ')}
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {currentHero.title.split(' ').slice(3).join(' ')}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                {currentHero.subtitle}
              </p>
            </div>

            {/* Search Section */}
            <div className={`mb-12 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="max-w-2xl mx-auto">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-2 flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-3 px-4">
                      <Search className="w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        placeholder="What do you want to learn today?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 py-3 text-lg bg-transparent outline-none text-gray-800 placeholder-gray-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    >
                      Search Courses
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Popular Categories */}
              <div className="mt-6">
                <p className="text-gray-300 mb-3">Popular: </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {popularCategories.map((category, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 bg-white/10 backdrop-blur text-white rounded-full text-sm hover:bg-white/20 transition-all duration-200 border border-white/20"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3">
                Start Learning Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group bg-white/10 backdrop-blur text-white px-8 py-4 rounded-xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center gap-3">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Stats Grid */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {features.map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-2 text-cyan-400 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {feature.count}
                    </div>
                    <div className="text-sm text-gray-300">
                      {feature.text.replace(/^\d+[\w\+\s]*/, '')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-cyan-400 w-8' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernEduQuestHero;