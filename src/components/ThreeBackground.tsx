"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import type * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Simplex 2D noise used for both shaders
const noiseGLSL = `
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const darkFragmentShader = `
uniform float time;
varying vec2 vUv;
${noiseGLSL}

void main() {
  vec2 uv = vUv;
  float n1 = snoise(uv * 1.5 + time * 0.05);
  float n2 = snoise(uv * 3.0 - time * 0.02);
  float n3 = snoise(uv * 4.5 + time * 0.08);
  float noise = n1 * 0.5 + n2 * 0.25 + n3 * 0.125;
  
  // Shift smoothstep to favor the dark color (color1) heavily, making clouds sparser
  float mixVal = smoothstep(0.0, 0.6, noise);
  
  // Slightly brighter dark aesthetic colors for the smoke
  vec3 color1 = vec3(0.02, 0.02, 0.03); // Deep dark base
  vec3 color2 = vec3(0.18, 0.18, 0.22); // Brighter smoke highlights
  
  vec3 finalColor = mix(color1, color2, mixVal);
  float dist = distance(uv, vec2(0.5));
  float vignette = smoothstep(0.8, 0.2, dist);
  
  gl_FragColor = vec4(finalColor * vignette, 1.0);
}
`;

const lightFragmentShader = `
uniform float time;
varying vec2 vUv;
${noiseGLSL}

void main() {
  vec2 uv = vUv;
  
  // Creates a highly fluid, organic distortion for the light theme
  float n1 = snoise(uv * 1.5 + time * 0.05);
  float n2 = snoise(uv * 2.5 - time * 0.04);
  float n3 = snoise(uv * 3.5 + time * 0.06);
  
  // Beautiful soft pastel colors for a dynamic, modern light theme
  vec3 color1 = vec3(0.85, 0.85, 0.95); // Lavender shadow
  vec3 color2 = vec3(0.80, 0.90, 0.98); // Sky blue breeze
  vec3 color3 = vec3(0.98, 0.88, 0.85); // Warm peach touch
  
  // Mix them organically
  float mix1 = smoothstep(-0.8, 0.8, n1);
  float mix2 = smoothstep(-0.8, 0.8, n2);
  float mix3 = smoothstep(-0.8, 0.8, n3);
  
  vec3 finalColor = mix(color1, color2, mix1);
  finalColor = mix(finalColor, color3, mix2);
  finalColor = mix(finalColor, color1, mix3 * 0.5); // Feedback loop to blend back
  
  // Slight brightness bump in the center
  float dist = distance(uv, vec2(0.5));
  float glow = smoothstep(0.8, 0.0, dist) * 0.06;
  
  gl_FragColor = vec4(finalColor + glow, 1.0);
}
`;

const DarkSmokePlane = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const uniforms = useMemo(() => ({ time: { value: 0 } }), []);

    useFrame((state) => {
        if (materialRef.current?.uniforms?.time) {
            materialRef.current.uniforms.time.value = state.clock.elapsedTime * 0.8;
        }
    });

    return (
        <mesh>
            <planeGeometry args={[15, 10, 1, 1]} />
            <shaderMaterial
                ref={materialRef}
                fragmentShader={darkFragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
            />
        </mesh>
    );
};

const LightGradientPlane = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const uniforms = useMemo(() => ({ time: { value: 0 } }), []);

    useFrame((state) => {
        if (materialRef.current?.uniforms?.time) {
            materialRef.current.uniforms.time.value = state.clock.elapsedTime * 0.6; // Slightly slower for light mode
        }
    });

    return (
        <mesh>
            <planeGeometry args={[15, 10, 1, 1]} />
            <shaderMaterial
                ref={materialRef}
                fragmentShader={lightFragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
                transparent={false} // perfectly opaque
                depthWrite={false}
            />
        </mesh>
    );
};

export function ThreeBackground() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const currentTheme = theme === 'system' ? resolvedTheme : theme;

    return (
        <div className="pointer-events-none fixed inset-0 -z-10 h-screen w-full transition-opacity duration-1000 bg-white dark:bg-black w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 1] }}
                dpr={[1, 1.5]}
                gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
            >
                {currentTheme === "dark" ? <DarkSmokePlane /> : <LightGradientPlane />}
            </Canvas>
        </div>
    );
}
