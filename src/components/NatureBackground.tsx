import React, { useEffect, useRef, useState } from 'react';

export type NatureSceneId = 'forest' | 'bamboo' | 'sakura' | 'meadow' | 'stream' | 'rainy';

export interface NatureScene {
  id: NatureSceneId;
  name: string;
  subtitle: string;
  icon: string;
  badge: string;
  gradient: string;
  overlayGradient: string;
  sunbeamColor: string;
  particleType: 'leaf' | 'bamboo_leaf' | 'sakura_petal' | 'firefly' | 'water_glimmer' | 'raindrop';
  primaryHue: [number, number, number]; // RGB
  secondaryHue: [number, number, number];
  ambientMood: string;
}

export const NATURE_SCENES: NatureScene[] = [
  {
    id: 'forest',
    name: 'Sunlit Forest Canopy',
    subtitle: 'Warm dappled sunbeams & oak foliage',
    icon: 'forest',
    badge: '🌲 Forest Sanctuary',
    gradient: 'from-[#eaf5e9] via-[#dcedc8]/60 to-[#f1f8e9]',
    overlayGradient: 'radial-gradient(ellipse at 50% 0%, rgba(183, 243, 151, 0.45) 0%, rgba(244, 249, 241, 0.95) 75%)',
    sunbeamColor: 'rgba(254, 240, 138, 0.22)',
    particleType: 'leaf',
    primaryHue: [56, 142, 60],
    secondaryHue: [139, 195, 74],
    ambientMood: 'Deep grounding peace',
  },
  {
    id: 'bamboo',
    name: 'Misty Bamboo Grove',
    subtitle: 'Calming jade mist & vertical stillness',
    icon: 'spa',
    badge: '🎋 Bamboo Grove',
    gradient: 'from-[#e0f2f1] via-[#b2dfdb]/50 to-[#e8f5e9]',
    overlayGradient: 'radial-gradient(ellipse at 50% 15%, rgba(128, 203, 196, 0.38) 0%, rgba(240, 253, 250, 0.96) 80%)',
    sunbeamColor: 'rgba(204, 251, 241, 0.25)',
    particleType: 'bamboo_leaf',
    primaryHue: [0, 121, 107],
    secondaryHue: [77, 182, 172],
    ambientMood: 'Zen focus & quietude',
  },
  {
    id: 'sakura',
    name: 'Cherry Blossom Meadow',
    subtitle: 'Delicate pink petals on a gentle spring breeze',
    icon: 'local_florist',
    badge: '🌸 Sakura Breeze',
    gradient: 'from-[#fdf2f8] via-[#fce7f3]/60 to-[#fff1f2]',
    overlayGradient: 'radial-gradient(ellipse at 50% 10%, rgba(244, 114, 182, 0.28) 0%, rgba(255, 241, 242, 0.96) 75%)',
    sunbeamColor: 'rgba(253, 164, 175, 0.2)',
    particleType: 'sakura_petal',
    primaryHue: [236, 72, 153],
    secondaryHue: [251, 113, 133],
    ambientMood: 'Gentle warmth & compassion',
  },
  {
    id: 'meadow',
    name: 'Golden Hour Meadow',
    subtitle: 'Amber twilight glow & dancing fireflies',
    icon: 'wb_twilight',
    badge: '🌅 Golden Meadow',
    gradient: 'from-[#fef3c7]/70 via-[#fed7aa]/50 to-[#fefce8]',
    overlayGradient: 'radial-gradient(ellipse at 50% 20%, rgba(251, 191, 36, 0.35) 0%, rgba(254, 243, 199, 0.94) 80%)',
    sunbeamColor: 'rgba(245, 158, 11, 0.26)',
    particleType: 'firefly',
    primaryHue: [217, 119, 6],
    secondaryHue: [245, 158, 11],
    ambientMood: 'Soothing evening warmth',
  },
  {
    id: 'stream',
    name: 'Mountain Stream Ripples',
    subtitle: 'Cool azure water glimmers & river stones',
    icon: 'water',
    badge: '🌊 Mountain Stream',
    gradient: 'from-[#e0f2fe] via-[#bae6fd]/50 to-[#ecfeff]',
    overlayGradient: 'radial-gradient(ellipse at 50% 15%, rgba(56, 189, 248, 0.3) 0%, rgba(240, 249, 255, 0.95) 75%)',
    sunbeamColor: 'rgba(186, 230, 253, 0.28)',
    particleType: 'water_glimmer',
    primaryHue: [2, 132, 199],
    secondaryHue: [56, 189, 248],
    ambientMood: 'Clarity & flowing renewal',
  },
  {
    id: 'rainy',
    name: 'Rainy Woodland Retreat',
    subtitle: 'Soft rain streaks, gentle mist & petrichor',
    icon: 'water_drop',
    badge: '🌧️ Rainy Woodland',
    gradient: 'from-[#f1f5f9] via-[#e2e8f0]/70 to-[#f8fafc]',
    overlayGradient: 'radial-gradient(ellipse at 50% 0%, rgba(148, 163, 184, 0.35) 0%, rgba(248, 250, 252, 0.96) 80%)',
    sunbeamColor: 'rgba(203, 213, 225, 0.2)',
    particleType: 'raindrop',
    primaryHue: [71, 85, 105],
    secondaryHue: [100, 116, 139],
    ambientMood: 'Deep acoustic comfort',
  },
];

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  oscillationSpeed: number;
  oscillationOffset: number;
  colorR: number;
  colorG: number;
  colorB: number;
}

interface NatureBackgroundProps {
  currentScene: NatureScene;
  isAutoCycling?: boolean;
  onSelectScene?: (scene: NatureScene) => void;
  onToggleAutoCycle?: () => void;
  showControls?: boolean;
}

export const NatureBackground: React.FC<NatureBackgroundProps> = ({
  currentScene,
  isAutoCycling = true,
  onSelectScene,
  onToggleAutoCycle,
  showControls = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  // Initialize and manage nature particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const initParticles = () => {
      const count = width < 768 ? 32 : 55;
      const particles: Particle[] = [];
      const [r1, g1, b1] = currentScene.primaryHue;
      const [r2, g2, b2] = currentScene.secondaryHue;

      for (let i = 0; i < count; i++) {
        const factor = Math.random();
        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);

        let size = Math.random() * 8 + 6;
        let speedX = (Math.random() - 0.4) * 0.8;
        let speedY = Math.random() * 0.7 + 0.3;

        if (currentScene.particleType === 'firefly') {
          size = Math.random() * 4 + 2;
          speedX = (Math.random() - 0.5) * 0.6;
          speedY = (Math.random() - 0.5) * 0.6;
        } else if (currentScene.particleType === 'raindrop') {
          size = Math.random() * 14 + 10;
          speedX = (Math.random() - 0.5) * 0.4 - 0.3;
          speedY = Math.random() * 4 + 4;
        } else if (currentScene.particleType === 'water_glimmer') {
          size = Math.random() * 6 + 3;
          speedX = (Math.random() - 0.5) * 0.5;
          speedY = (Math.random() - 0.5) * 0.3;
        }

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          speedX,
          speedY,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02,
          opacity: Math.random() * 0.55 + 0.25,
          oscillationSpeed: Math.random() * 0.02 + 0.01,
          oscillationOffset: Math.random() * Math.PI * 2,
          colorR: r,
          colorG: g,
          colorB: b,
        });
      }
      particlesRef.current = particles;
    };

    initParticles();

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle atmospheric animated sunbeams / light streaks
      ctx.save();
      const beamCount = 4;
      for (let i = 0; i < beamCount; i++) {
        const beamAngle = Math.PI / 4 + Math.sin(time * 0.2 + i) * 0.08;
        const originX = width * (0.2 + i * 0.22);
        const gradient = ctx.createLinearGradient(
          originX,
          0,
          originX + Math.cos(beamAngle) * height,
          height
        );
        gradient.addColorStop(0, currentScene.sunbeamColor);
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        const beamWidth = width * 0.22;
        ctx.moveTo(originX - beamWidth * 0.5, 0);
        ctx.lineTo(originX + beamWidth * 0.5, 0);
        ctx.lineTo(originX + Math.cos(beamAngle) * height + beamWidth, height);
        ctx.lineTo(originX + Math.cos(beamAngle) * height - beamWidth, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Render Nature Particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Interaction with mouse cursor
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.x -= (dx / dist) * force * 1.5;
            p.y -= (dy / dist) * force * 1.5;
          }
        }

        // Particle Movement
        p.rotation += p.rotSpeed;
        const wave = Math.sin(time * p.oscillationSpeed * 60 + p.oscillationOffset);

        if (currentScene.particleType === 'firefly') {
          p.x += p.speedX + wave * 0.4;
          p.y += p.speedY + Math.cos(time + p.oscillationOffset) * 0.4;
          // Pulse opacity for fireflies
          const pulse = (Math.sin(time * 2 + p.oscillationOffset) + 1) * 0.35 + 0.15;
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.colorR}, ${p.colorG}, ${p.colorB}, ${pulse})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = `rgb(${p.colorR}, ${p.colorG}, ${p.colorB})`;
          ctx.fill();
          ctx.restore();
        } else if (currentScene.particleType === 'raindrop') {
          p.x += p.speedX;
          p.y += p.speedY;

          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${p.colorR}, ${p.colorG}, ${p.colorB}, ${p.opacity * 0.6})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.size);
          ctx.stroke();
          ctx.restore();
        } else if (currentScene.particleType === 'water_glimmer') {
          p.x += p.speedX + wave * 0.3;
          p.y += p.speedY;
          const glimmer = (Math.sin(time * 3 + p.oscillationOffset) + 1) * 0.4 + 0.1;

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.colorR}, ${p.colorG}, ${p.colorB}, ${glimmer})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(186, 230, 253, 0.8)';
          ctx.fill();
          ctx.restore();
        } else if (currentScene.particleType === 'sakura_petal') {
          // Sakura petal: organic teardrop shape fluttering
          p.x += p.speedX + wave * 0.8;
          p.y += p.speedY;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation + wave * 0.3);
          ctx.beginPath();
          ctx.fillStyle = `rgba(${p.colorR}, ${p.colorG}, ${p.colorB}, ${p.opacity})`;
          // Draw delicate petal
          ctx.ellipse(0, 0, p.size * 0.65, p.size, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Leaf (Forest or Bamboo)
          p.x += p.speedX + wave * 0.9;
          p.y += p.speedY;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation + wave * 0.4);
          ctx.beginPath();
          ctx.fillStyle = `rgba(${p.colorR}, ${p.colorG}, ${p.colorB}, ${p.opacity})`;
          if (currentScene.particleType === 'bamboo_leaf') {
            // Elongated slender bamboo leaf
            ctx.ellipse(0, 0, p.size * 0.3, p.size * 1.3, 0, 0, Math.PI * 2);
          } else {
            // Standard rounded oak / forest leaf
            ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.9, Math.PI / 6, 0, Math.PI * 2);
          }
          ctx.fill();
          ctx.restore();
        }

        // Screen wrap-around
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        } else if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentScene]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-1000">
      {/* Dynamic Nature Ambient Gradient Base */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${currentScene.gradient} transition-colors duration-1000 ease-in-out`}
      />

      {/* Layered Organic Nature Radial Vignette */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{
          background: currentScene.overlayGradient,
          opacity: 0.92,
        }}
      />

      {/* Interactive Floating Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Bottom Nature Horizon Silhouette Layers with Organic Curves */}
      <div className="absolute bottom-0 left-0 right-0 h-48 opacity-25 pointer-events-none overflow-hidden transition-all duration-1000">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full object-cover text-[#2e7d32] fill-current opacity-30 transform translate-y-12"
        >
          <path d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,181.3C672,171,768,117,864,117.3C960,117,1056,171,1152,181.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Nature Atmosphere Switcher Floating Bar (Optional Pill) */}
      {showControls && onSelectScene && (
        <div className="absolute top-20 right-4 sm:right-6 pointer-events-auto z-20 hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#dee5d8] shadow-sm">
          {NATURE_SCENES.map((scene) => {
            const isSelected = currentScene.id === scene.id;
            return (
              <button
                key={scene.id}
                onClick={() => onSelectScene(scene)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#386a20] text-white shadow-xs scale-105'
                    : 'text-[#52634f] hover:text-[#1a241e] hover:bg-[#f0f2eb]'
                }`}
                title={`${scene.name} — ${scene.subtitle}`}
              >
                <span className="material-symbols-outlined text-[15px]">{scene.icon}</span>
                <span className="hidden xl:inline text-[11px]">{scene.name.split(' ')[0]}</span>
              </button>
            );
          })}

          {onToggleAutoCycle && (
            <button
              onClick={onToggleAutoCycle}
              className={`p-1 rounded-full text-xs transition-all cursor-pointer ${
                isAutoCycling
                  ? 'text-[#2e7d32] bg-[#e8f5e9] border border-[#a5d6a7]'
                  : 'text-[#8d9588] hover:text-[#52634f]'
              }`}
              title={isAutoCycling ? 'Auto-cycling nature scenes (Every 30s)' : 'Scene locked'}
            >
              <span
                className={`material-symbols-outlined text-[16px] ${
                  isAutoCycling ? 'animate-spin-slow' : ''
                }`}
              >
                autorenew
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
