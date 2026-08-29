import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StressGameType } from '../types';
import { playBubblePop, playKalimbaNote, playSandRakeSound } from '../utils/audioSynth';

interface StressReliefGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BubbleTheme = 'rainbow' | 'sage' | 'neon' | 'strawberry';

interface ZenItem {
  id: string;
  type: 'stone' | 'lotus' | 'bamboo' | 'crystal';
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface RippleNode {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  opacity: number;
}

export const StressReliefGamesModal: React.FC<StressReliefGamesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeGame, setActiveGame] = useState<StressGameType>('popit');

  // --- POP-IT GAME STATE ---
  const [bubbleTheme, setBubbleTheme] = useState<BubbleTheme>('rainbow');
  const [infiniteMode, setInfiniteMode] = useState<boolean>(true);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const [bubbles, setBubbles] = useState<boolean[]>(() => Array(36).fill(false)); // false = unpopped, true = popped

  // --- ZEN SAND GARDEN STATE ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRaking, setIsRaking] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'rake' | 'stone' | 'lotus' | 'bamboo' | 'crystal'>('rake');
  const [zenItems, setZenItems] = useState<ZenItem[]>([]);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // --- RIPPLES & KALIMBA STATE ---
  const rippleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripplesRef = useRef<RippleNode[]>([]);
  const [activeNotesCount, setActiveNotesCount] = useState(0);

  // Initialize and redraw Zen Sand Garden
  const initSandCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill serene sand texture
    ctx.fillStyle = '#f5efe6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grain texture
    ctx.fillStyle = 'rgba(215, 204, 185, 0.35)';
    for (let i = 0; i < 4000; i++) {
      const gx = Math.random() * canvas.width;
      const gy = Math.random() * canvas.height;
      ctx.fillRect(gx, gy, 1.5, 1.5);
    }
  }, []);

  useEffect(() => {
    if (isOpen && activeGame === 'zensand') {
      setTimeout(initSandCanvas, 50);
    }
  }, [isOpen, activeGame, initSandCanvas]);

  // Handle Sand Canvas Raking
  const handleRakeStart = (x: number, y: number) => {
    if (selectedTool === 'rake') {
      setIsRaking(true);
      lastPointRef.current = { x, y };
      drawRakeLine(x, y);
    } else {
      // Place item
      const newItem: ZenItem = {
        id: `item-${Date.now()}-${Math.random()}`,
        type: selectedTool,
        x,
        y,
        rotation: Math.random() * 360,
        scale: 0.85 + Math.random() * 0.3,
      };
      setZenItems((prev) => [...prev, newItem]);
      playKalimbaNote(Math.floor(Math.random() * 8));
    }
  };

  const drawRakeLine = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !lastPointRef.current) return;

    // Draw multi-tine rake grooves (3 parallel wave lines)
    const offsets = [-8, 0, 8];
    const dx = x - lastPointRef.current.x;
    const dy = y - lastPointRef.current.y;
    const angle = Math.atan2(dy, dx) + Math.PI / 2;

    offsets.forEach((offset) => {
      const ox = Math.cos(angle) * offset;
      const oy = Math.sin(angle) * offset;

      ctx.beginPath();
      ctx.moveTo(lastPointRef.current!.x + ox, lastPointRef.current!.y + oy);
      ctx.lineTo(x + ox, y + oy);
      ctx.strokeStyle = '#d7ccb9';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Highlight groove ridge
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current!.x + ox + 1, lastPointRef.current!.y + oy + 1);
      ctx.lineTo(x + ox + 1, y + oy + 1);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    lastPointRef.current = { x, y };
    if (Math.random() > 0.6) {
      playSandRakeSound();
    }
  };

  const handleRakeMove = (x: number, y: number) => {
    if (!isRaking || selectedTool !== 'rake') return;
    drawRakeLine(x, y);
  };

  const handleRakeEnd = () => {
    setIsRaking(false);
    lastPointRef.current = null;
  };

  // --- POP IT HANDLERS ---
  const handlePopBubble = (index: number) => {
    if (bubbles[index]) return; // already popped

    playBubblePop(index % 6);
    setPoppedCount((prev) => prev + 1);

    setBubbles((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    if (infiniteMode) {
      // Unpop after delay so user can keep popping forever
      setTimeout(() => {
        setBubbles((prev) => {
          const next = [...prev];
          next[index] = false;
          return next;
        });
      }, 2200);
    }
  };

  const handlePopAll = () => {
    bubbles.forEach((_, idx) => {
      setTimeout(() => {
        playBubblePop(idx % 6);
        setBubbles((prev) => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
        setPoppedCount((prev) => prev + 1);
      }, idx * 30);
    });
  };

  const handleResetBubbles = () => {
    setBubbles(Array(36).fill(false));
  };

  // --- RIPPLES ANIMATION LOOP ---
  const triggerRipple = (x: number, y: number) => {
    const colors = [
      'rgba(46, 125, 50, 0.8)',
      'rgba(56, 189, 248, 0.8)',
      'rgba(168, 85, 247, 0.8)',
      'rgba(234, 179, 8, 0.8)',
      'rgba(244, 114, 182, 0.8)',
      'rgba(20, 184, 166, 0.8)',
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const noteIdx = Math.floor((x / 500) * 8);
    playKalimbaNote(noteIdx);
    setActiveNotesCount((prev) => prev + 1);

    ripplesRef.current.push({
      id: Date.now() + Math.random(),
      x,
      y,
      radius: 10,
      maxRadius: 180 + Math.random() * 80,
      color,
      opacity: 0.9,
    });
  };

  useEffect(() => {
    if (activeGame !== 'ripples' || !isOpen) return;

    let animId: number;
    const canvas = rippleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.15)'; // trails effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ripplesRef.current.forEach((r, index) => {
        r.radius += 2.5;
        r.opacity = Math.max(0, 0.9 * (1 - r.radius / r.maxRadius));

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color.replace('0.8', `${r.opacity}`);
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(0, r.radius - 12), 0, Math.PI * 2);
        ctx.strokeStyle = r.color.replace('0.8', `${r.opacity * 0.4}`);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (r.radius >= r.maxRadius) {
          ripplesRef.current.splice(index, 1);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeGame, isOpen]);

  if (!isOpen) return null;

  const getBubbleColor = (index: number, isPopped: boolean) => {
    const row = Math.floor(index / 6);
    if (bubbleTheme === 'rainbow') {
      const rainbowColors = [
        'bg-rose-400 border-rose-500 shadow-rose-300',
        'bg-amber-400 border-amber-500 shadow-amber-300',
        'bg-yellow-300 border-yellow-400 shadow-yellow-200',
        'bg-emerald-400 border-emerald-500 shadow-emerald-300',
        'bg-sky-400 border-sky-500 shadow-sky-300',
        'bg-purple-400 border-purple-500 shadow-purple-300',
      ];
      return isPopped
        ? 'bg-neutral-200 border-neutral-300 opacity-60 scale-90 inset-shadow'
        : rainbowColors[row];
    }
    if (bubbleTheme === 'sage') {
      const sageColors = [
        'bg-[#a3e635] border-[#84cc16]',
        'bg-[#86efac] border-[#4ade80]',
        'bg-[#6ee7b7] border-[#34d399]',
        'bg-[#5eead4] border-[#2dd4bf]',
        'bg-[#86efac] border-[#4ade80]',
        'bg-[#a3e635] border-[#84cc16]',
      ];
      return isPopped
        ? 'bg-[#dcfce7] border-[#bbf7d0] opacity-60 scale-90'
        : sageColors[row];
    }
    if (bubbleTheme === 'neon') {
      const neonColors = [
        'bg-[#00f0ff] border-[#00c8d7] shadow-[0_0_12px_#00f0ff]',
        'bg-[#ff007f] border-[#d6006b] shadow-[0_0_12px_#ff007f]',
        'bg-[#39ff14] border-[#2ed10f] shadow-[0_0_12px_#39ff14]',
        'bg-[#b026ff] border-[#931ad6] shadow-[0_0_12px_#b026ff]',
        'bg-[#00f0ff] border-[#00c8d7] shadow-[0_0_12px_#00f0ff]',
        'bg-[#ff007f] border-[#d6006b] shadow-[0_0_12px_#ff007f]',
      ];
      return isPopped
        ? 'bg-[#1e293b] border-[#334155] opacity-50 scale-90'
        : neonColors[row];
    }
    // Strawberry milk
    return isPopped
      ? 'bg-[#fce7f3] border-[#fbcfe8] opacity-60 scale-90'
      : 'bg-[#f472b6] border-[#db2777] shadow-pink-200';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#dee5d8] overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 bg-[#fcfdf6] border-b border-[#dee5d8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e0f2fe] flex items-center justify-center text-[#0284c7]">
              <span className="material-symbols-outlined text-[24px]">sports_esports</span>
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#0f172a]">
                Sanctuary Stress Relief Play
              </h3>
              <p className="font-body text-xs text-[#52634f]">
                Tactile, calming sensory interactions to reset racing thoughts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#72796f] hover:bg-[#eaede6] hover:text-[#1a1c19] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Game Mode Switcher */}
        <div className="grid grid-cols-3 bg-[#f8faf7] p-2 gap-2 border-b border-[#dee5d8]">
          <button
            onClick={() => setActiveGame('popit')}
            className={`py-2 px-3 rounded-2xl font-heading text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeGame === 'popit'
                ? 'bg-[#2e7d32] text-white shadow-xs'
                : 'text-[#52634f] hover:bg-[#eaede6]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">radio_button_checked</span>
            <span>🫧 Sensory Pop-It</span>
          </button>

          <button
            onClick={() => setActiveGame('zensand')}
            className={`py-2 px-3 rounded-2xl font-heading text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeGame === 'zensand'
                ? 'bg-[#2e7d32] text-white shadow-xs'
                : 'text-[#52634f] hover:bg-[#eaede6]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">nature</span>
            <span>🪨 Zen Sand Garden</span>
          </button>

          <button
            onClick={() => setActiveGame('ripples')}
            className={`py-2 px-3 rounded-2xl font-heading text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeGame === 'ripples'
                ? 'bg-[#2e7d32] text-white shadow-xs'
                : 'text-[#52634f] hover:bg-[#eaede6]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">music_note</span>
            <span>💫 Calming Ripples</span>
          </button>
        </div>

        {/* Game Viewports */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 flex flex-col items-center justify-center min-h-[380px]">
          {/* GAME 1: BUBBLE POP-IT */}
          {activeGame === 'popit' && (
            <div className="w-full flex flex-col items-center space-y-5 animate-fadeIn">
              {/* Controls bar */}
              <div className="w-full flex flex-wrap items-center justify-between gap-3 text-xs bg-[#f8faf7] p-3 rounded-2xl border border-[#dee5d8]">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-[#1b5e20] text-sm">
                    {poppedCount} Popped
                  </span>
                  <span className="text-[#72796f]">|</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[#43483e]">
                    <input
                      type="checkbox"
                      checked={infiniteMode}
                      onChange={(e) => setInfiniteMode(e.target.checked)}
                      className="accent-[#2e7d32] rounded"
                    />
                    <span>Infinite Sensory Loop</span>
                  </label>
                </div>

                {/* Theme Selector */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setBubbleTheme('rainbow')}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      bubbleTheme === 'rainbow'
                        ? 'bg-white border-[#2e7d32] text-[#2e7d32] shadow-2xs'
                        : 'bg-[#f0f2eb] border-transparent text-[#52634f]'
                    }`}
                  >
                    🌈 Rainbow
                  </button>
                  <button
                    onClick={() => setBubbleTheme('sage')}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      bubbleTheme === 'sage'
                        ? 'bg-white border-[#2e7d32] text-[#2e7d32] shadow-2xs'
                        : 'bg-[#f0f2eb] border-transparent text-[#52634f]'
                    }`}
                  >
                    🍵 Sage
                  </button>
                  <button
                    onClick={() => setBubbleTheme('neon')}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      bubbleTheme === 'neon'
                        ? 'bg-white border-[#00f0ff] text-[#00c8d7] shadow-2xs'
                        : 'bg-[#f0f2eb] border-transparent text-[#52634f]'
                    }`}
                  >
                    ⚡ Neon
                  </button>
                  <button
                    onClick={() => setBubbleTheme('strawberry')}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      bubbleTheme === 'strawberry'
                        ? 'bg-white border-[#ec4899] text-[#db2777] shadow-2xs'
                        : 'bg-[#f0f2eb] border-transparent text-[#52634f]'
                    }`}
                  >
                    🍓 Berry
                  </button>
                </div>
              </div>

              {/* Pop-it Silicone Pad Grid */}
              <div
                className={`p-5 rounded-3xl border-4 shadow-xl transition-all duration-300 ${
                  bubbleTheme === 'neon'
                    ? 'bg-[#0a0f1d] border-[#1e293b] shadow-[0_0_30px_rgba(0,240,255,0.15)]'
                    : 'bg-[#faf9f6] border-[#dee5d8] shadow-md'
                }`}
              >
                <div className="grid grid-cols-6 gap-2.5 sm:gap-3.5">
                  {bubbles.map((isPopped, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handlePopBubble(index)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-150 transform flex items-center justify-center cursor-pointer active:scale-90 ${getBubbleColor(
                        index,
                        isPopped
                      )} ${
                        isPopped
                          ? 'shadow-inner translate-y-0.5'
                          : 'hover:scale-105 shadow-md -translate-y-0.5'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full opacity-40 ${
                          isPopped ? 'bg-black/20' : 'bg-white'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePopAll}
                  className="px-4 py-2 rounded-full bg-[#dcfce7] text-[#15803d] hover:bg-[#bbf7d0] text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>Pop All Burst</span>
                </button>
                <button
                  onClick={handleResetBubbles}
                  className="px-4 py-2 rounded-full bg-[#f0f2eb] text-[#43483e] hover:bg-[#dee5d8] text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  <span>Reset Pad</span>
                </button>
              </div>
            </div>
          )}

          {/* GAME 2: ZEN SAND GARDEN */}
          {activeGame === 'zensand' && (
            <div className="w-full flex flex-col items-center space-y-4 animate-fadeIn">
              {/* Tool Palette */}
              <div className="flex flex-wrap items-center justify-center gap-2 bg-[#f8faf7] p-2.5 rounded-2xl border border-[#dee5d8] text-xs">
                <span className="font-heading font-bold text-[#1b5e20] mr-1">Rake & Place:</span>
                <button
                  onClick={() => setSelectedTool('rake')}
                  className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all ${
                    selectedTool === 'rake'
                      ? 'bg-[#2e7d32] text-white shadow-2xs'
                      : 'bg-white text-[#43483e] border border-[#dee5d8]'
                  }`}
                >
                  <span>🧹 Bamboo Rake</span>
                </button>
                <button
                  onClick={() => setSelectedTool('stone')}
                  className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all ${
                    selectedTool === 'stone'
                      ? 'bg-[#2e7d32] text-white shadow-2xs'
                      : 'bg-white text-[#43483e] border border-[#dee5d8]'
                  }`}
                >
                  <span>🪨 River Stone</span>
                </button>
                <button
                  onClick={() => setSelectedTool('lotus')}
                  className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all ${
                    selectedTool === 'lotus'
                      ? 'bg-[#2e7d32] text-white shadow-2xs'
                      : 'bg-white text-[#43483e] border border-[#dee5d8]'
                  }`}
                >
                  <span>🌸 Lotus Blossom</span>
                </button>
                <button
                  onClick={() => setSelectedTool('bamboo')}
                  className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all ${
                    selectedTool === 'bamboo'
                      ? 'bg-[#2e7d32] text-white shadow-2xs'
                      : 'bg-white text-[#43483e] border border-[#dee5d8]'
                  }`}
                >
                  <span>🎋 Bamboo Stalk</span>
                </button>
                <button
                  onClick={() => setSelectedTool('crystal')}
                  className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all ${
                    selectedTool === 'crystal'
                      ? 'bg-[#2e7d32] text-white shadow-2xs'
                      : 'bg-white text-[#43483e] border border-[#dee5d8]'
                  }`}
                >
                  <span>💎 Jade Crystal</span>
                </button>
              </div>

              {/* Sand Canvas Frame */}
              <div className="relative rounded-3xl p-3 bg-[#8c6d48] shadow-xl border-4 border-[#6d5030] overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={520}
                  height={320}
                  onMouseDown={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    handleRakeStart(e.clientX - rect.left, e.clientY - rect.top);
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    handleRakeMove(e.clientX - rect.left, e.clientY - rect.top);
                  }}
                  onMouseUp={handleRakeEnd}
                  onMouseLeave={handleRakeEnd}
                  onTouchStart={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    handleRakeStart(touch.clientX - rect.left, touch.clientY - rect.top);
                  }}
                  onTouchMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    handleRakeMove(touch.clientX - rect.left, touch.clientY - rect.top);
                  }}
                  onTouchEnd={handleRakeEnd}
                  className="rounded-2xl cursor-crosshair touch-none w-full max-w-[520px] h-[320px]"
                />

                {/* Render Placed Zen Elements */}
                {zenItems.map((item) => (
                  <div
                    key={item.id}
                    className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 select-none animate-fadeIn"
                    style={{
                      left: `${item.x + 12}px`,
                      top: `${item.y + 12}px`,
                      transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
                    }}
                  >
                    {item.type === 'stone' && (
                      <div className="w-12 h-9 rounded-[50%_60%_70%_40%] bg-gradient-to-br from-[#4b5563] to-[#1f2937] shadow-lg border border-[#6b7280]/40 flex items-center justify-center">
                        <div className="w-4 h-2 rounded-full bg-white/20 -mt-2 -ml-2" />
                      </div>
                    )}
                    {item.type === 'lotus' && (
                      <div className="text-3xl drop-shadow-md">🌸</div>
                    )}
                    {item.type === 'bamboo' && (
                      <div className="text-3xl drop-shadow-md">🎋</div>
                    )}
                    {item.type === 'crystal' && (
                      <div className="text-3xl drop-shadow-md">💎</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action helpers */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    initSandCanvas();
                    setZenItems([]);
                    playSandRakeSound();
                  }}
                  className="px-4 py-2 rounded-full bg-[#f0f2eb] hover:bg-[#dcedc8] text-[#1b5e20] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#c8e6c9]"
                >
                  <span className="material-symbols-outlined text-[16px]">cleaning_services</span>
                  <span>Smooth Fresh Sand</span>
                </button>
                <p className="text-xs text-[#72796f]">
                  Drag to rake ripples • Tap to place stones & flowers
                </p>
              </div>
            </div>
          )}

          {/* GAME 3: CALMING RIPPLES & KALIMBA */}
          {activeGame === 'ripples' && (
            <div className="w-full flex flex-col items-center space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between w-full max-w-lg bg-[#0f172a] text-white px-4 py-2.5 rounded-2xl text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                  <span className="font-heading font-semibold text-[#e2e8f0]">
                    Pentatonic Soundscape
                  </span>
                </div>
                <span className="text-[#94a3b8]">{activeNotesCount} Notes Played</span>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#1e293b]">
                <canvas
                  ref={rippleCanvasRef}
                  width={520}
                  height={320}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    triggerRipple(e.clientX - rect.left, e.clientY - rect.top);
                  }}
                  onTouchStart={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    triggerRipple(touch.clientX - rect.left, touch.clientY - rect.top);
                  }}
                  className="bg-[#0b1120] cursor-pointer touch-none w-full max-w-[520px] h-[320px]"
                />

                {/* Calming center breathing guide indicator */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-sky-400/30 animate-ping opacity-25" />
                  <div className="absolute text-sky-200/50 text-xs font-heading font-medium tracking-widest uppercase">
                    Tap Anywhere To Sound Chimes
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#52634f]">
                <span className="material-symbols-outlined text-[16px] text-[#0284c7]">
                  graphic_eq
                </span>
                <span>Harmonically tuned to calming C-major pentatonic scale</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-3.5 bg-[#fcfdf6] border-t border-[#dee5d8] flex items-center justify-between text-xs text-[#52634f]">
          <span>Take deep breaths while interacting ✨</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-semibold rounded-full shadow-xs transition-all"
          >
            Done & Relaxed
          </button>
        </div>
      </div>
    </div>
  );
};
