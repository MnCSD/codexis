'use client';

import { useState, useEffect } from 'react';
import BrunoStyleDemo from '@/components/BrunoStyleDemo';
import FeatureShowcase from '@/components/FeatureShowcase';
import TestimonialsSection from '@/components/TestimonialsSection';
import ParticleBackground from '@/components/ParticleBackground';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
      
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-sm animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-sm animate-float-delayed"></div>
        <div className="absolute bottom-40 left-32 w-40 h-40 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-sm animate-float-slow"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
            <span className="text-2xl font-bold text-white">Codexis</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
            Get Early Access
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-2 mb-6">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-300 text-sm font-medium">Revolutionary Code Visualization</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[0.9]">
                  Don't <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 animate-gradient-x">read</span> your codebase.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 animate-gradient-x animation-delay-1000">Walk</span> through it.
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                  Experience your code as a <span className="text-purple-400 font-semibold">living 3D city</span> where functions become rooms, classes become buildings, and complex architectures become explorable worlds.
                </p>
              </div>

              <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button className="group bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-purple-500/30 relative overflow-hidden">
                    <span className="relative z-10">Start Exploring</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button className="group border-2 border-gray-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300 relative overflow-hidden">
                    <span className="flex items-center space-x-2">
                      <span>Watch Demo</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1m-6 4h1m4 0h1" />
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-purple-400 mb-1">60%</div>
                    <div className="text-sm text-gray-400">Faster Onboarding</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-blue-400 mb-1">85%</div>
                    <div className="text-sm text-gray-400">Less Navigation Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-green-400 mb-1">10x</div>
                    <div className="text-sm text-gray-400">Better Comprehension</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - 3D Demo */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-10 scale-95'}`}>
              <div className="relative">
                {/* Demo Container */}
                <div className="relative bg-gradient-to-br from-gray-900/50 to-black/50 rounded-3xl border border-gray-700/50 backdrop-blur-sm overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10"></div>
                  
                  {/* Demo Header */}
                  <div className="relative z-10 p-6 border-b border-gray-700/50">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-400 text-sm font-mono">codexis://explore/your-project</span>
                    </div>
                    <h3 className="text-white font-semibold text-lg">Your Code as a Living City</h3>
                    <p className="text-gray-400 text-sm">Move mouse to explore • Click blocks to interact</p>
                  </div>
                  
                  {/* 3D Demo */}
                  <div className="relative z-10 h-96">
                    <BrunoStyleDemo />
                  </div>
                  
                  {/* Glow Effects */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl blur-lg -z-10"></div>
                </div>

                {/* Floating UI Elements */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-semibold animate-pulse">
                  Interactive Demo
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                  Real-time Physics
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="text-center pb-8">
          <div className="inline-flex flex-col items-center space-y-2 text-gray-400">
            <span className="text-sm">Discover Features</span>
            <div className="w-0.5 h-8 bg-gradient-to-b from-purple-500 to-transparent animate-pulse"></div>
            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20 bg-black/20">
        <FeatureShowcase />
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 px-6 py-20 bg-gradient-to-br from-purple-950/30 to-blue-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Early Access Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join the revolution at special beta pricing. Limited spots available for pioneering developers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Explorer</h3>
                <div className="text-4xl font-bold text-purple-400 mb-2">Free</div>
                <p className="text-gray-300">Perfect for individual developers</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Up to 3 repositories</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Basic 3D visualization</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Community support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-gray-500">×</span>
                  <span className="text-gray-500">AI-powered navigation</span>
                </li>
              </ul>
              <button className="w-full border border-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
                Start Free
              </button>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 rounded-3xl p-8 border-2 border-purple-500/50 backdrop-blur-sm relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  $29<span className="text-lg text-gray-300">/month</span>
                </div>
                <p className="text-gray-300">For serious developers and teams</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Unlimited repositories</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Advanced 3D features</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">AI-powered exploration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Real-time collaboration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Priority support</span>
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg">
                Start Pro Trial
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-blue-400 mb-2">Custom</div>
                <p className="text-gray-300">For large organizations</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Everything in Pro</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">On-premise deployment</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Custom integrations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Dedicated support</span>
                </li>
              </ul>
              <button className="w-full border border-blue-500 text-blue-400 py-3 rounded-xl font-semibold hover:bg-blue-500/10 transition-all">
                Contact Sales
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">Special beta pricing - 50% off for early adopters</p>
            <p className="text-sm text-gray-500">All plans include 30-day money-back guarantee</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your Development Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join the beta and be among the first developers to experience spatial code exploration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-xl font-semibold text-xl hover:scale-105 transform transition-all shadow-lg hover:shadow-purple-500/25">
              Request Beta Access
            </button>
            <button className="border border-gray-600 text-white px-12 py-4 rounded-xl font-semibold text-xl hover:bg-white/10 transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded"></div>
            <span className="text-xl font-bold text-white">Codexis</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; 2024 Codexis. Revolutionizing how developers understand code.
          </p>
        </div>
      </footer>
    </main>
  );
}
