
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function EnergyOrb() {
  const orbRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.12;
      orbRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }

    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.08;
      ringRef.current.rotation.z += delta * 0.035;
    }
  });

  return (
    <group>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
        <mesh ref={orbRef}>
          <icosahedronGeometry args={[1.35, 5]} />
          <meshPhysicalMaterial
            color="#7770ff"
            emissive="#3825c8"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.55}
            wireframe
            transparent
            opacity={0.72}
          />
        </mesh>

        <mesh scale={0.88}>
          <sphereGeometry args={[1.35, 48, 48]} />
          <meshPhysicalMaterial
            color="#17113f"
            emissive="#3521a8"
            emissiveIntensity={0.65}
            roughness={0.25}
            metalness={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>

      <group ref={ringRef}>
        <mesh rotation={[1.15, 0.35, 0.4]}>
          <torusGeometry args={[1.85, 0.012, 12, 160]} />
          <meshBasicMaterial color="#8c83ff" transparent opacity={0.8} />
        </mesh>

        <mesh rotation={[0.4, 1.1, 0.9]}>
          <torusGeometry args={[2.05, 0.008, 12, 160]} />
          <meshBasicMaterial color="#39bfff" transparent opacity={0.65} />
        </mesh>
      </group>

      <pointLight position={[2, 2, 3]} color="#8275ff" intensity={5} />
      <pointLight position={[-3, -2, 1]} color="#268dff" intensity={3} />
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.8} />

        <Stars
          radius={80}
          depth={45}
          count={1100}
          factor={2}
          saturation={0}
          fade
          speed={0.4}
        />

        <EnergyOrb />
      </Canvas>
    </div>
  );
}
