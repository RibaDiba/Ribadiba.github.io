"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ *
 * SolShader — React port of Sol's AnimatedBackground WebGL shader.
 * A domain-warped noise field flowing the gold → cream → peach → blush →
 * salmon → coral ramp, plus flowing film grain. Pauses off-screen /
 * hidden, freezes for prefers-reduced-motion, and falls back to a static
 * CSS gradient when WebGL is unavailable.
 * ------------------------------------------------------------------ */

export const SOL_FALLBACK_GRADIENT =
    "linear-gradient(115deg, #ffefa9 0%, #fbe7a0 14%, #ffe8ca 38%, #fdd5bb 55%, #f1948c 78%, #e07370 100%)";

const VERT_SRC = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision highp float;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_dpr;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    v += amp * noise(p);
    p = rot * p * 2.0;
    amp *= 0.5;
  }
  return v;
}

vec3 ramp(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 gold   = vec3(1.000, 0.937, 0.663);
  vec3 cream  = vec3(0.988, 0.953, 0.729);
  vec3 peach  = vec3(1.000, 0.910, 0.792);
  vec3 blush  = vec3(0.992, 0.835, 0.733);
  vec3 salmon = vec3(0.945, 0.580, 0.549);
  vec3 coral  = vec3(0.878, 0.451, 0.439);
  vec3 c = mix(gold, cream, smoothstep(0.00, 0.18, t));
  c = mix(c, peach,  smoothstep(0.18, 0.42, t));
  c = mix(c, blush,  smoothstep(0.42, 0.60, t));
  c = mix(c, salmon, smoothstep(0.60, 0.82, t));
  c = mix(c, coral,  smoothstep(0.82, 1.00, t));
  return c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  float t = u_time * 0.085;
  vec2 p = vec2(uv.x * aspect, uv.y) * 2.2;

  vec2 q = vec2(
    fbm(p + vec2(0.0, t * 1.2)),
    fbm(p + vec2(5.2, 1.3) + vec2(t * 1.0, t * 0.4))
  );
  vec2 r = vec2(
    fbm(p + 2.4 * q + vec2(1.7, 9.2) + vec2(t * 0.9, -t * 0.6)),
    fbm(p + 2.4 * q + vec2(8.3, 2.8) + vec2(-t * 0.7, t * 0.5))
  );
  vec2 s = vec2(
    fbm(p + 2.0 * r + vec2(3.1, 4.7) + t * 0.5),
    fbm(p + 2.0 * r + vec2(6.9, 0.4) - t * 0.45)
  );
  float f = fbm(p + 2.2 * s);

  vec2 axisDir = normalize(vec2(1.0, -0.40 + 0.06 * sin(t * 0.6)));
  float axis = dot(uv - 0.5, axisDir) + 0.5;

  float m = axis + (f - 0.5) * 0.85 + (q.x - 0.5) * 0.42 + (s.y - 0.5) * 0.20;

  vec3 col = ramp(m);

  float streak = smoothstep(0.40, 1.0, r.x) * (1.0 - smoothstep(0.55, 0.95, axis));
  col += vec3(0.07, 0.06, 0.0) * streak;

  col *= 0.94 + 0.12 * f;

  float vig = smoothstep(1.25, 0.30, length((uv - 0.5) * vec2(aspect, 1.0)));
  col *= mix(0.93, 1.0, vig);

  vec2 flow = (q - 0.5) + (r - 0.5);
  vec2 gco = gl_FragCoord.xy / (u_dpr * 2.0)
           + flow * 10.0
           + vec2(u_time * 1.5, u_time * 0.6);
  float fine   = hash(floor(gco));
  float coarse = hash(floor(gco * 0.5));
  float grain  = mix(fine, coarse, 0.4) - 0.5;
  float lumc   = dot(col, vec3(0.299, 0.587, 0.114));
  col += grain * (0.05 + 0.45 * (1.0 - lumc));

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("[sol-shader] shader error:", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
    }
    return sh;
}

interface SolShaderProps {
    className?: string;
    style?: React.CSSProperties;
}

export default function SolShader({ className, style }: SolShaderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.style.background = SOL_FALLBACK_GRADIENT;

        const gl = (canvas.getContext("webgl", { antialias: false, alpha: false }) ||
            canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
        if (!gl) return;

        const vert = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
        const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
        if (!vert || !frag) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vert);
        gl.attachShader(program, frag);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("[sol-shader] link error:", gl.getProgramInfoLog(program));
            return;
        }
        gl.useProgram(program);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const aPos = gl.getAttribLocation(program, "a_pos");
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        const uRes = gl.getUniformLocation(program, "u_resolution");
        const uTime = gl.getUniformLocation(program, "u_time");
        const uDpr = gl.getUniformLocation(program, "u_dpr");

        const DPR_CAP = 1.5;
        const QUALITY_FLOOR = 0.5;
        let qualityScale = 1;

        const resize = () => {
            const eff = Math.min(window.devicePixelRatio || 1, DPR_CAP) * qualityScale;
            const w = Math.max(1, Math.round(canvas.clientWidth * eff));
            const h = Math.max(1, Math.round(canvas.clientHeight * eff));
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
                gl.viewport(0, 0, w, h);
            }
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform1f(uDpr, eff);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let raf = 0;
        let running = false;
        let onScreen = true;
        const start = performance.now();

        const renderFrame = (now: number) => {
            gl.uniform1f(uTime, (now - start) / 1000);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        const FRAME_MS = 1000 / 60;
        let nextFrame = 0;
        let winFrames = 0;
        let winStart = 0;
        const sampleQuality = (now: number) => {
            if (winStart === 0) winStart = now;
            winFrames++;
            const elapsed = now - winStart;
            if (elapsed < 1000) return;
            const fps = (winFrames * 1000) / elapsed;
            if (fps < 55 && qualityScale > QUALITY_FLOOR) {
                qualityScale = Math.max(QUALITY_FLOOR, qualityScale * 0.8);
                resize();
            }
            winFrames = 0;
            winStart = now;
        };

        const loop = (now: number) => {
            raf = requestAnimationFrame(loop);
            if (now < nextFrame) return;
            nextFrame = Math.max(nextFrame + FRAME_MS, now);
            renderFrame(now);
            sampleQuality(now);
        };

        const startLoop = () => {
            if (running || reduceMotion || document.hidden || !onScreen) return;
            running = true;
            nextFrame = 0;
            winStart = 0;
            winFrames = 0;
            raf = requestAnimationFrame(loop);
        };
        const stopLoop = () => {
            running = false;
            cancelAnimationFrame(raf);
        };

        if (reduceMotion) {
            renderFrame(start + 8000);
        } else {
            startLoop();
        }

        const onVisibility = () => (document.hidden ? stopLoop() : startLoop());
        document.addEventListener("visibilitychange", onVisibility);

        const io = new IntersectionObserver(
            ([entry]) => {
                onScreen = entry.isIntersecting;
                if (onScreen) startLoop();
                else stopLoop();
            },
            { threshold: 0 }
        );
        io.observe(canvas);

        const onLost = (e: Event) => {
            e.preventDefault();
            stopLoop();
        };
        canvas.addEventListener("webglcontextlost", onLost);
        canvas.addEventListener("webglcontextrestored", startLoop);

        return () => {
            stopLoop();
            ro.disconnect();
            io.disconnect();
            document.removeEventListener("visibilitychange", onVisibility);
            canvas.removeEventListener("webglcontextlost", onLost);
            canvas.removeEventListener("webglcontextrestored", startLoop);
            gl.deleteProgram(program);
            gl.deleteShader(vert);
            gl.deleteShader(frag);
            if (buf) gl.deleteBuffer(buf);
        };
    }, []);

    return <canvas ref={canvasRef} className={className} style={{ background: SOL_FALLBACK_GRADIENT, ...style }} />;
}
