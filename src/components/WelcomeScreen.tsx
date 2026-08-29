import React, { useEffect, useRef } from 'react';
import { ASSETS, MOODS } from '../data/mockData';
import { MoodType, UserProfile, FeedbackEntry } from '../types';
import { FeedbackBox } from './FeedbackBox';

interface WelcomeScreenProps {
  onStartTalking: () => void;
  onStartNeonBuddy: () => void;
  onQuickMoodSelect: (mood: MoodType) => void;
  onGoToHome: () => void;
  userProfile?: UserProfile;
  onOpenProfile: () => void;
  onOpenStressGames: () => void;
  feedbackList?: FeedbackEntry[];
  onSaveFeedback?: (feedback: Omit<FeedbackEntry, 'id' | 'timestamp'>) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartTalking,
  onStartNeonBuddy,
  onQuickMoodSelect,
  onGoToHome,
  userProfile,
  onOpenProfile,
  onOpenStressGames,
  feedbackList = [],
  onSaveFeedback = () => {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const userName = userProfile?.name || 'Taylor';
  const avatarUrl = userProfile?.avatarUrl || ASSETS.studentAvatar;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = aVertexPosition;
        v_texCoord = aTextureCoord;
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;

      void main() {
        vec2 uv = (v_texCoord - 0.5) * 2.0;
        uv.x *= u_resolution.x / u_resolution.y;

        float angle = atan(uv.y, uv.x);
        float radius = length(uv);
        float segments = 8.0;
        angle = mod(angle, 2.0 * 3.14159 / segments);
        angle = abs(angle - 3.14159 / segments);
        uv = vec2(cos(angle), sin(angle)) * radius;

        float t = u_time * 0.25;
        float pattern = sin(uv.x * 9.0 + t) * cos(uv.y * 9.0 - t);
        pattern += sin(radius * 18.0 - t * 2.0) * 0.5;
        
        float mask = smoothstep(0.1, 0.8, pattern);
        
        vec3 colorA = vec3(0.22, 0.48, 0.22); // Forest Green #386a20
        vec3 colorB = vec3(0.72, 0.95, 0.65); // Soft Light Green #b7f397
        vec3 backgroundColor = vec3(0.99, 0.99, 0.96); // Warm soft surface #fcfdf6

        vec3 finalColor = mix(backgroundColor, mix(colorA, colorB, uv.y * 0.5 + 0.5), mask * 0.35);
        float vignette = smoothstep(1.0, 0.15, v_texCoord.y);
        finalColor = mix(backgroundColor, finalColor, vignette);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function compileShader(glContext: WebGLRenderingContext, type: number, source: string) {
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const positionLoc = gl.getAttribLocation(program, 'aVertexPosition');
    const texCoordLoc = gl.getAttribLocation(program, 'aTextureCoord');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    const positions = new Float32Array([
      -1.0, 1.0,
      1.0, 1.0,
      -1.0, -1.0,
      1.0, -1.0,
    ]);

    const texCoords = new Float32Array([
      0.0, 1.0,
      1.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
    ]);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const startTime = Date.now();
    let animationFrameId: number;

    const render = () => {
      if (!canvas) return;
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.99, 0.99, 0.96, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionLoc);

      gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
      gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(texCoordLoc);

      gl.uniform1f(timeLoc, (Date.now() - startTime) * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#fdfdf5] via-[#f7f9f4] to-[#edf4ea] px-4 py-8">
      {/* Interactive WebGL Shader Canvas at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[50vh] z-0 pointer-events-none opacity-85">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#fdfdf5] to-transparent z-10 pointer-events-none"></div>
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
      </div>

      {/* Decorative subtle orbs */}
      <div className="absolute top-[-5%] left-[-5%] w-80 h-80 bg-[#b7f397]/25 rounded-full blur-[90px] pointer-events-none z-0"></div>
      <div className="absolute top-[25%] right-[-5%] w-96 h-96 bg-[#c8e6c9]/35 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Main Sanctuary Card & Welcome Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center text-center">
        {/* Floating Logo Card */}
        <div className="mb-6 w-44 h-44 md:w-56 md:h-56 relative flex items-center justify-center animate-float">
          <div className="w-full h-full bg-[#ffffff]/90 rounded-3xl p-6 shadow-xl shadow-[#386a20]/10 border border-white flex flex-col items-center justify-center">
            <img
              src={ASSETS.logo}
              alt="Yours Truly Logo"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* Greeting Text & Profile Pill */}
        <div className="space-y-2 mb-6 max-w-sm">
          <button
            onClick={onOpenProfile}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#dee5d8] shadow-2xs hover:border-[#b7f397] transition-all cursor-pointer group mb-1"
          >
            <img
              src={avatarUrl}
              alt={userName}
              className="w-5 h-5 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = ASSETS.studentAvatar;
              }}
            />
            <span className="text-xs font-semibold text-[#166534]">
              Welcome back, {userName}
            </span>
            <span className="material-symbols-outlined text-[14px] text-[#52634f] group-hover:text-[#166534]">
              edit
            </span>
          </button>

          <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1a241e] tracking-tight">
            How are you feeling today?
          </h2>
          <p className="font-body text-[#414942] text-sm md:text-base leading-relaxed">
            Your empathetic sanctuary to reflect, decompress, and find balance amidst student life.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="w-full max-w-xs space-y-2.5">
          <button
            id="welcome-start-talking-btn"
            onClick={onStartTalking}
            className="w-full bg-[#386a20] hover:bg-[#2e7d32] text-white font-semibold py-3.5 px-6 rounded-full shadow-lg shadow-[#386a20]/25 hover:shadow-xl hover:shadow-[#386a20]/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <span className="material-symbols-outlined text-[20px]">spa</span>
            <span className="text-sm md:text-base font-medium">Mindful Sanctuary Chat</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform ml-auto">
              arrow_forward
            </span>
          </button>

          <button
            id="welcome-start-neon-btn"
            onClick={onStartNeonBuddy}
            className="w-full bg-[#090e1a] hover:bg-[#111928] text-cyan-300 border border-cyan-400/40 hover:border-cyan-400 font-semibold py-3.5 px-6 rounded-full shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <span className="material-symbols-outlined text-[20px] text-cyan-400">bolt</span>
            <span className="text-sm md:text-base font-medium">⚡ Neon Buddy (Public Cover)</span>
            <span className="material-symbols-outlined text-[18px] text-cyan-400 group-hover:translate-x-1 transition-transform ml-auto">
              arrow_forward
            </span>
          </button>

          <button
            id="welcome-games-btn"
            onClick={onOpenStressGames}
            className="w-full bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] border border-[#7dd3fc] font-semibold py-3 px-6 rounded-full shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 text-xs md:text-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">sports_esports</span>
            <span>🫧 Play Stress Relief Games</span>
          </button>

          <button
            id="welcome-checkin-btn"
            onClick={onGoToHome}
            className="w-full bg-white/90 hover:bg-white text-[#2e7d32] border border-[#c8e6c9] font-medium py-2.5 px-6 rounded-full shadow-xs hover:shadow-md transition-all duration-200 text-xs md:text-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">self_improvement</span>
            <span>Check in with yourself</span>
          </button>
        </div>

        {/* Quick Feeling Shortcuts */}
        <div className="mt-8 pt-4 border-t border-[#e8eae0]/60 w-full max-w-md">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#55624c] block mb-3">
            Quick Check-in
          </span>
          <div className="flex justify-center gap-2 flex-wrap">
            {MOODS.map((m) => (
              <button
                key={m.type}
                id={`welcome-quick-mood-${m.type}`}
                onClick={() => onQuickMoodSelect(m.type)}
                className="bg-white/80 hover:bg-white text-[#33691e] px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#dee5d8] shadow-2xs hover:shadow-xs hover:border-[#b7f397] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#386a20]">
                  {m.icon}
                </span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Student Feedback & Suggestion Box at the Start at the Bottom */}
        <FeedbackBox
          userProfile={userProfile}
          feedbackList={feedbackList}
          onSaveFeedback={onSaveFeedback}
        />
      </div>
    </div>
  );
};
