'use client';

import { useState, useEffect } from 'react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  demo: {
    type: 'visualization' | 'animation' | 'interaction';
    content: string[];
  };
}

export default function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const features: Feature[] = [
    {
      id: 'spatial-nav',
      title: '3D Spatial Navigation',
      description: 'Navigate through your codebase like exploring a real city. Functions become rooms you can enter, classes become buildings you can walk around.',
      icon: '🏙️',
      gradient: 'from-purple-500 to-pink-500',
      demo: {
        type: 'visualization',
        content: [
          'Walk through the main() function entrance',
          'Navigate to the UserService building',
          'Explore the authentication neighborhood',
          'Fly over to the database district'
        ]
      }
    },
    {
      id: 'live-flow',
      title: 'Live Data Flow Visualization',
      description: 'Watch your code come alive with animated data flows. See exactly how information moves through your application in real-time.',
      icon: '⚡',
      gradient: 'from-blue-500 to-cyan-500',
      demo: {
        type: 'animation',
        content: [
          'API request flows in as blue particles',
          'Data streams through validation pipeline',
          'Database queries pulse with activity',
          'Response travels back to user interface'
        ]
      }
    },
    {
      id: 'ai-exploration',
      title: 'AI-Powered Code Exploration',
      description: 'Ask questions in natural language and instantly teleport to relevant code. No more grep or file hunting.',
      icon: '🧠',
      gradient: 'from-green-500 to-emerald-500',
      demo: {
        type: 'interaction',
        content: [
          '"Show me authentication logic"',
          '"Where is user data validated?"',
          '"Find all database connections"',
          '"Explain this error handling"'
        ]
      }
    },
    {
      id: 'visual-debug',
      title: 'Visual Debugging & Health',
      description: 'Bugs appear as red creatures, security issues as black smoke, test coverage as green vines. Instantly see your code health.',
      icon: '🔍',
      gradient: 'from-orange-500 to-red-500',
      demo: {
        type: 'visualization',
        content: [
          'Red bugs crawling on broken functions',
          'Green vines covering tested code',
          'Warning signs on deprecated methods',
          'Performance bottlenecks glowing hot'
        ]
      }
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, features.length]);

  const currentFeature = features[activeFeature];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Revolutionary Features
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Experience the future of code exploration with features that transform how you understand and navigate software.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Feature List */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                activeFeature === index
                  ? 'bg-gradient-to-br from-gray-800/80 to-gray-700/80 border-purple-500/50 shadow-lg shadow-purple-500/20'
                  : 'bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
              }`}
              onClick={() => {
                setActiveFeature(index);
                setIsAutoPlaying(false);
              }}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Auto-play Control */}
          <div className="flex items-center justify-center pt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400' : 'bg-gray-500'}`}></div>
              <span className="text-sm">{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
            </button>
          </div>
        </div>

        {/* Feature Demo */}
        <div className="relative">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
            {/* Demo Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-8 h-8 bg-gradient-to-br ${currentFeature.gradient} rounded-lg flex items-center justify-center text-lg`}>
                {currentFeature.icon}
              </div>
              <h4 className="text-xl font-bold text-white">{currentFeature.title}</h4>
            </div>

            {/* Demo Content */}
            <div className="space-y-4">
              {currentFeature.demo.content.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 transition-all duration-500 ${
                    index <= (Date.now() / 1000) % currentFeature.demo.content.length
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-50 translate-x-2'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentFeature.gradient} flex-shrink-0`}></div>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            {/* Interactive Elements */}
            <div className="mt-8 relative h-32 overflow-hidden">
              {currentFeature.demo.type === 'visualization' && (
                <div className="flex space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg animate-pulse"></div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-lg animate-pulse delay-150"></div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-lg animate-pulse delay-300"></div>
                </div>
              )}

              {currentFeature.demo.type === 'animation' && (
                <div className="relative">
                  <div className="absolute left-0 top-4 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="absolute left-16 top-8 w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                  <div className="absolute left-32 top-2 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-400"></div>
                  <div className="absolute left-48 top-6 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-600"></div>
                </div>
              )}

              {currentFeature.demo.type === 'interaction' && (
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-400">$ ask codexis "show me authentication"</div>
                  <div className="text-gray-400 mt-2">🔍 Searching codebase...</div>
                  <div className="text-purple-400 mt-1">📍 Found 3 authentication modules</div>
                  <div className="text-blue-400 mt-1">✨ Teleporting to AuthService...</div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveFeature(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeFeature === index
                    ? 'bg-purple-500 scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}