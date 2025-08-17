'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  featured?: boolean;
}

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Senior Full Stack Developer',
      company: 'TechCorp',
      avatar: '👩‍💻',
      quote: "Codexis completely changed how I understand large codebases. What used to take hours of grep and file jumping now takes minutes of spatial exploration. It's like having a GPS for code.",
      rating: 5,
      featured: true
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      role: 'Engineering Manager',
      company: 'StartupXYZ',
      avatar: '👨‍💼',
      quote: "Onboarding new developers used to be a nightmare. Now they can literally walk through our architecture on day one. Our ramp-up time decreased by 60%.",
      rating: 5,
      featured: true
    },
    {
      id: '3',
      name: 'Dr. Emily Watson',
      role: 'Principal Software Architect',
      company: 'Enterprise Systems',
      avatar: '👩‍🔬',
      quote: "The 3D visualization revealed architectural issues we never spotted in traditional code reviews. Codexis makes complex systems intuitive and beautiful.",
      rating: 5
    },
    {
      id: '4',
      name: 'Alex Kim',
      role: 'DevOps Engineer',
      company: 'CloudFirst',
      avatar: '👨‍🔧',
      quote: "Debugging microservices has never been easier. Watching data flow through the system in real-time is absolutely game-changing for troubleshooting.",
      rating: 5
    },
    {
      id: '5',
      name: 'Jordan Taylor',
      role: 'Frontend Lead',
      company: 'DesignTech',
      avatar: '🎨',
      quote: "As someone who thinks visually, Codexis finally made backend code accessible to me. I can now contribute to full-stack projects with confidence.",
      rating: 5
    },
    {
      id: '6',
      name: 'David Park',
      role: 'CTO',
      company: 'InnovateLabs',
      avatar: '👔',
      quote: "ROI was immediate. Our code quality improved, bugs decreased, and developer satisfaction went through the roof. This is the future of software development.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}>
          ⭐
        </span>
      ))}
    </div>
  );

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Developers Love Codexis
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of developers who have transformed their coding experience with spatial code exploration.
          </p>
        </div>

        {/* Featured Testimonials */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {testimonials.filter(t => t.featured).map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                  <p className="text-purple-400">{testimonial.role}</p>
                  <p className="text-gray-400 text-sm">{testimonial.company}</p>
                </div>
                <StarRating rating={testimonial.rating} />
              </div>
              <blockquote className="text-gray-300 text-lg leading-relaxed italic">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>

        {/* Rotating Testimonial Carousel */}
        <div className="relative bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-3xl p-12 border border-purple-500/20 backdrop-blur-sm">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                {testimonials[activeTestimonial].avatar}
              </div>
              <StarRating rating={testimonials[activeTestimonial].rating} />
            </div>
            
            <blockquote className="text-2xl md:text-3xl text-white font-light leading-relaxed mb-8 max-w-4xl mx-auto">
              "{testimonials[activeTestimonial].quote}"
            </blockquote>
            
            <div className="text-center">
              <h4 className="text-xl font-bold text-white">{testimonials[activeTestimonial].name}</h4>
              <p className="text-purple-400">{testimonials[activeTestimonial].role}</p>
              <p className="text-gray-400">{testimonials[activeTestimonial].company}</p>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeTestimonial === index
                    ? 'bg-purple-500 scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700/50">
            <div className="text-4xl font-bold text-purple-400 mb-2">60%</div>
            <div className="text-gray-300">Faster Developer Onboarding</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700/50">
            <div className="text-4xl font-bold text-blue-400 mb-2">85%</div>
            <div className="text-gray-300">Reduction in Code Navigation Time</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700/50">
            <div className="text-4xl font-bold text-green-400 mb-2">40%</div>
            <div className="text-gray-300">Fewer Bugs in Production</div>
          </div>
        </div>

        {/* Company Logos */}
        <div className="mt-16">
          <p className="text-center text-gray-400 mb-8">Trusted by developers at</p>
          <div className="flex flex-wrap justify-center items-center space-x-8 opacity-60">
            {['TechCorp', 'StartupXYZ', 'Enterprise Systems', 'CloudFirst', 'DesignTech', 'InnovateLabs'].map((company) => (
              <div key={company} className="text-gray-500 font-semibold text-lg mb-4">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}