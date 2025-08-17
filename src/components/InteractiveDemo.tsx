'use client';

import { useState, useEffect, useRef } from 'react';

interface CodeBlock {
  id: string;
  type: 'function' | 'class' | 'module';
  name: string;
  position: { x: number; y: number; z: number };
  color: string;
  connections: string[];
}

export default function InteractiveDemo() {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const codeBlocks: CodeBlock[] = [
    {
      id: 'auth',
      type: 'module',
      name: 'Authentication',
      position: { x: 0, y: 0, z: 0 },
      color: 'from-purple-500 to-purple-700',
      connections: ['user', 'login']
    },
    {
      id: 'user',
      type: 'class',
      name: 'User',
      position: { x: 200, y: 50, z: 10 },
      color: 'from-blue-500 to-blue-700',
      connections: ['profile', 'settings']
    },
    {
      id: 'login',
      type: 'function',
      name: 'validateLogin()',
      position: { x: 100, y: 150, z: 5 },
      color: 'from-green-500 to-green-700',
      connections: ['auth']
    },
    {
      id: 'profile',
      type: 'function',
      name: 'getUserProfile()',
      position: { x: 300, y: 100, z: 15 },
      color: 'from-orange-500 to-orange-700',
      connections: ['user']
    },
    {
      id: 'settings',
      type: 'function',
      name: 'updateSettings()',
      position: { x: 250, y: 200, z: 8 },
      color: 'from-pink-500 to-pink-700',
      connections: ['user']
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'module':
        return '🏢';
      case 'class':
        return '🏠';
      case 'function':
        return '🚪';
      default:
        return '📦';
    }
  };

  const getBlockSize = (type: string) => {
    switch (type) {
      case 'module':
        return 'w-24 h-24';
      case 'class':
        return 'w-20 h-20';
      case 'function':
        return 'w-16 h-16';
      default:
        return 'w-16 h-16';
    }
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-3xl overflow-hidden border border-gray-700/50">
      {/* 3D Scene Container */}
      <div className="absolute inset-0 perspective-1000">
        <div className="relative w-full h-full transform-gpu" style={{ transform: 'rotateX(15deg) rotateY(-10deg)' }}>
          
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {codeBlocks.map(block => 
              block.connections.map(connectionId => {
                const connectedBlock = codeBlocks.find(b => b.id === connectionId);
                if (!connectedBlock) return null;
                
                return (
                  <line
                    key={`${block.id}-${connectionId}`}
                    x1={block.position.x + 50}
                    y1={block.position.y + 50}
                    x2={connectedBlock.position.x + 50}
                    y2={connectedBlock.position.y + 50}
                    stroke="url(#connectionGradient)"
                    strokeWidth="2"
                    className={`transition-all duration-1000 ${isAnimating ? 'opacity-80' : 'opacity-40'}`}
                    strokeDasharray="5,5"
                    strokeDashoffset={isAnimating ? "-10" : "0"}
                  />
                );
              })
            )}
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Code Blocks */}
          {codeBlocks.map((block) => (
            <div
              key={block.id}
              className={`absolute transform transition-all duration-500 cursor-pointer group ${getBlockSize(block.type)}`}
              style={{
                left: block.position.x,
                top: block.position.y,
                transform: `translateZ(${block.position.z}px) ${selectedBlock === block.id ? 'scale(1.1)' : 'scale(1)'}`,
              }}
              onClick={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
              onMouseEnter={() => setSelectedBlock(block.id)}
              onMouseLeave={() => setSelectedBlock(null)}
            >
              <div 
                className={`w-full h-full bg-gradient-to-br ${block.color} rounded-xl shadow-lg flex flex-col items-center justify-center text-white text-sm font-medium transition-all duration-300 group-hover:shadow-2xl ${
                  selectedBlock === block.id ? 'ring-2 ring-white/50' : ''
                } ${isAnimating ? 'animate-pulse-glow' : ''}`}
              >
                <div className="text-2xl mb-1">{getBlockIcon(block.type)}</div>
                <div className="text-xs text-center px-1 leading-tight">{block.name}</div>
              </div>

              {/* Hover Tooltip */}
              {selectedBlock === block.id && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap z-10">
                  {block.type.charAt(0).toUpperCase() + block.type.slice(1)}: {block.name}
                </div>
              )}
            </div>
          ))}

          {/* Floating Data Particles */}
          {isAnimating && (
            <>
              <div className="absolute w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ left: '120px', top: '180px' }}></div>
              <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-ping delay-300" style={{ left: '220px', top: '120px' }}></div>
              <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping delay-500" style={{ left: '180px', top: '80px' }}></div>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 flex space-x-2">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1 rounded-lg transition-all backdrop-blur-sm"
        >
          {isAnimating ? 'Pause' : 'Animate'}
        </button>
        <button
          onClick={() => setSelectedBlock(null)}
          className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1 rounded-lg transition-all backdrop-blur-sm"
        >
          Reset View
        </button>
      </div>

      {/* Info Panel */}
      {selectedBlock && (
        <div className="absolute top-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-xs backdrop-blur-sm">
          <h4 className="font-semibold mb-2">Code Block Info</h4>
          <p className="text-sm mb-1">
            <span className="text-gray-300">Type:</span> {codeBlocks.find(b => b.id === selectedBlock)?.type}
          </p>
          <p className="text-sm mb-1">
            <span className="text-gray-300">Name:</span> {codeBlocks.find(b => b.id === selectedBlock)?.name}
          </p>
          <p className="text-sm">
            <span className="text-gray-300">Connections:</span> {codeBlocks.find(b => b.id === selectedBlock)?.connections.length || 0}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg backdrop-blur-sm">
        <div className="text-xs font-semibold mb-2">Legend</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏢</span>
            <span>Module</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏠</span>
            <span>Class</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🚪</span>
            <span>Function</span>
          </div>
        </div>
      </div>
    </div>
  );
}