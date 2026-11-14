"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LearningScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      host.classList.add("learning-scene-fallback");
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(host.clientWidth || 220, host.clientHeight || 180);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const violet = new THREE.PointLight(0x8d6cff, 34, 12);
    violet.position.set(2, 2, 4);
    scene.add(violet);
    const lime = new THREE.PointLight(0xd7ff63, 20, 10);
    lime.position.set(-2, -1, 3);
    scene.add(lime);

    const group = new THREE.Group();
    scene.add(group);

    const crystal = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.86, 1),
      new THREE.MeshPhysicalMaterial({
        color: 0x9274ff, emissive: 0x37206f, emissiveIntensity: 0.42,
        metalness: 0.3, roughness: 0.22, clearcoat: 1, flatShading: true
      })
    );
    crystal.position.set(0.05, 0.05, 0);
    group.add(crystal);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.02, 1),
      new THREE.MeshBasicMaterial({ color: 0xc8b8ff, wireframe: true, transparent: true, opacity: 0.3 })
    );
    group.add(wire);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.28, 0.014, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0x8b6cff, transparent: true, opacity: 0.72 })
    );
    ring.rotation.set(1.1, 0.2, 0.35);
    group.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.48, 0.009, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0xb3d94b, transparent: true, opacity: 0.75 })
    );
    ring2.rotation.set(0.15, 1.1, -0.35);
    group.add(ring2);

    const miniShapes: THREE.Mesh[] = [];
    const shapeSpecs = [
      { geometry: new THREE.OctahedronGeometry(0.19, 0), color: 0xd7ff63, pos: [-1.45, 0.85, 0.1] as [number,number,number] },
      { geometry: new THREE.TetrahedronGeometry(0.16, 0), color: 0xffa8ca, pos: [1.55, -0.65, 0.2] as [number,number,number] },
      { geometry: new THREE.DodecahedronGeometry(0.14, 0), color: 0x9d86ff, pos: [-1.35, -0.75, -0.1] as [number,number,number] },
    ];
    shapeSpecs.forEach((spec, index) => {
      const mesh = new THREE.Mesh(spec.geometry, new THREE.MeshStandardMaterial({
        color: spec.color, emissive: spec.color, emissiveIntensity: 0.18, metalness: 0.18, roughness: 0.28
      }));
      mesh.position.set(...spec.pos);
      mesh.rotation.set(index * 0.7, index * 0.5, 0.2);
      group.add(mesh);
      miniShapes.push(mesh);
    });

    const count = 90;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.7 + Math.random() * 1.05;
      positions[i*3] = Math.cos(angle) * radius;
      positions[i*3+1] = (Math.random() - 0.5) * 3.1;
      positions[i*3+2] = (Math.random() - 0.5) * 1.6;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x9d88ed, size: 0.026, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 0.9;
      pointer.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 0.6;
    };
    const onLeave = () => { pointer.tx = 0; pointer.ty = 0; };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tick = 0;
    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      if (!reduced) {
        tick += 0.006;
        pointer.x += (pointer.tx - pointer.x) * 0.035;
        pointer.y += (pointer.ty - pointer.y) * 0.035;
        group.rotation.y = Math.sin(tick * 0.45) * 0.16 + pointer.x * 0.18;
        group.rotation.x = Math.cos(tick * 0.35) * 0.08 + pointer.y * 0.14;
        crystal.rotation.y += 0.003;
        crystal.rotation.x += 0.0015;
        wire.rotation.y -= 0.0015;
        ring.rotation.z += 0.0018;
        ring2.rotation.x += 0.0012;
        particles.rotation.y += 0.0004;
        miniShapes.forEach((mesh, i) => {
          mesh.rotation.x += 0.003 + i * 0.0005;
          mesh.rotation.y += 0.004;
          mesh.position.y += Math.sin(tick * 1.4 + i * 2) * 0.0008;
        });
      }
      renderer.render(scene, camera);
    };
    const resize = new ResizeObserver(() => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resize.observe(host);
    render();

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      group.traverse(obj => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          const material = obj.material;
          if (Array.isArray(material)) material.forEach(m => m.dispose());
          else material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="learning-scene" ref={hostRef} aria-label="Interactive three-dimensional learning objects" role="img">
    <div className="learning-scene-fallback-mark">✦</div>
    <span className="scene-label">EXPLORE · LEARN · GROW</span>
  </div>;
}
