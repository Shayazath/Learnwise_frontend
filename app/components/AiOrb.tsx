"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AiOrb() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      host.classList.add("orb-fallback");
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.z = 5.1;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(host.clientWidth || 120, host.clientHeight || 120);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const ambient = new THREE.AmbientLight(0xb9aaff, 1.7);
    scene.add(ambient);

    const keyLight = new THREE.PointLight(0xc6b5ff, 42, 12);
    keyLight.position.set(3, 3, 4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xd7ff63, 22, 10);
    rimLight.position.set(-3, -2, 2);
    scene.add(rimLight);

    const coreGeometry = new THREE.IcosahedronGeometry(1.02, 5);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8a6cff,
      emissive: 0x382078,
      emissiveIntensity: 0.7,
      metalness: 0.28,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      transparent: true,
      opacity: 0.94,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    const inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.63, 2),
      new THREE.MeshBasicMaterial({
        color: 0xc9baff,
        wireframe: true,
        transparent: true,
        opacity: 0.28,
      })
    );
    group.add(inner);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xc2adff,
      transparent: true,
      opacity: 0.58,
    });
    const ringOne = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.012, 8, 120), ringMaterial);
    ringOne.rotation.set(1.08, 0.25, 0.3);
    group.add(ringOne);

    const ringTwo = new THREE.Mesh(
      new THREE.TorusGeometry(1.52, 0.008, 8, 120),
      new THREE.MeshBasicMaterial({ color: 0xd7ff63, transparent: true, opacity: 0.62 })
    );
    ringTwo.rotation.set(0.25, 1.1, -0.4);
    group.add(ringTwo);

    const particleCount = 170;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.65 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xb9a7ff,
        size: 0.022,
        transparent: true,
        opacity: 0.72,
        sizeAttenuation: true,
      })
    );
    group.add(particles);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 1.1;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.7;
    };
    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let raf = 0;
    const animate = () => {
      raf = window.requestAnimationFrame(animate);
      if (!reducedMotion) {
        frame += 0.006;
        pointer.x += (target.x - pointer.x) * 0.035;
        pointer.y += (target.y - pointer.y) * 0.035;
        group.rotation.y = frame * 0.45 + pointer.x * 0.28;
        group.rotation.x = Math.sin(frame * 0.6) * 0.08 + pointer.y * 0.2;
        ringOne.rotation.z += 0.0015;
        ringTwo.rotation.x += 0.001;
        particles.rotation.y -= 0.00045;
        core.scale.setScalar(1 + Math.sin(frame * 1.8) * 0.018);
      }
      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(() => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(host);
    animate();

    return () => {
      window.cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      coreGeometry.dispose();
      coreMaterial.dispose();
      inner.geometry.dispose();
      (inner.material as THREE.Material).dispose();
      ringOne.geometry.dispose();
      ringMaterial.dispose();
      ringTwo.geometry.dispose();
      (ringTwo.material as THREE.Material).dispose();
      particleGeometry.dispose();
      (particles.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="ai-orb" ref={hostRef} role="img" aria-label="Animated three-dimensional LearnYah AI orb">
      <div className="ai-orb-fallback-mark">✳</div>
      <span className="ai-orb-caption">LearnYah AI</span>
    </div>
  );
}
