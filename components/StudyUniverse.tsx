
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function StudyUniverse() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId = 0;
    let frame = 0;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0x9b8aff, 1.5));

    const violetLight = new THREE.PointLight(0x8b5cf6, 45, 15);
    violetLight.position.set(-3, 2, 4);
    scene.add(violetLight);

    const cyanLight = new THREE.PointLight(0x22d3ee, 35, 15);
    cyanLight.position.set(3, -2, 3);
    scene.add(cyanLight);

    const pinkLight = new THREE.PointLight(0xec4899, 25, 15);
    pinkLight.position.set(0, 3, -3);
    scene.add(pinkLight);

    // Main knowledge core
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const coreGeometry = new THREE.IcosahedronGeometry(1.25, 5);

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      metalness: 0.55,
      roughness: 0.18,
      transmission: 0.12,
      thickness: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      emissive: 0x32116b,
      emissiveIntensity: 0.7,
    });

    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    coreGroup.add(core);

    // Inner glowing energy sphere
    const innerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.2,
      })
    );

    coreGroup.add(innerSphere);

    // Fine wireframe around the core
    const wireframe = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.38, 3),
      new THREE.MeshBasicMaterial({
        color: 0xc4b5fd,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      })
    );

    coreGroup.add(wireframe);

    // Energy rings
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const ringColors = [
      0xa78bfa,
      0x22d3ee,
      0xec4899,
    ];

    const ringConfigs = [
      { radius: 2.05, x: 0.95, y: 0.2, z: 0.35 },
      { radius: 2.35, x: 0.2, y: 1.05, z: 0.15 },
      { radius: 2.6, x: 1.2, y: 0.4, z: 1.2 },
    ];

    ringConfigs.forEach((config, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(config.radius, 0.009, 8, 240),
        new THREE.MeshBasicMaterial({
          color: ringColors[index],
          transparent: true,
          opacity: 0.8,
        })
      );

      ring.rotation.set(config.x, config.y, config.z);
      ringGroup.add(ring);
    });

    // Orbiting glowing nodes
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    const nodes: {
      mesh: THREE.Mesh;
      radius: number;
      speed: number;
      offset: number;
      vertical: number;
    }[] = [];

    const nodeColors = [
      0x22d3ee,
      0xc084fc,
      0xf472b6,
      0xa3e635,
      0xfbbf24,
      0x818cf8,
    ];

    for (let i = 0; i < 6; i++) {
      const geometry = new THREE.SphereGeometry(
        i % 2 === 0 ? 0.075 : 0.055,
        24,
        24
      );

      const material = new THREE.MeshBasicMaterial({
        color: nodeColors[i],
      });

      const node = new THREE.Mesh(geometry, material);

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 16, 16),
        new THREE.MeshBasicMaterial({
          color: nodeColors[i],
          transparent: true,
          opacity: 0.15,
        })
      );

      node.add(glow);
      nodeGroup.add(node);

      nodes.push({
        mesh: node,
        radius: 2.1 + (i % 3) * 0.3,
        speed: 0.22 + i * 0.035,
        offset: (i / 6) * Math.PI * 2,
        vertical: 0.55 + (i % 2) * 0.5,
      });
    }

    // Fine particle field
    const particleCount = 1600;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      particlePositions[i3] = (Math.random() - 0.5) * 11;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 5 - 1;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc4b5fd,
      size: 0.018,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(
      particleGeometry,
      particleMaterial
    );

    scene.add(particles);

    // Light trails
    const trails = new THREE.Group();
    scene.add(trails);

    for (let i = 0; i < 3; i++) {
      const points: THREE.Vector3[] = [];

      for (let j = 0; j <= 180; j++) {
        const angle = (j / 180) * Math.PI * 2;

        const radius = 2.8 + i * 0.15;

        points.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * (1.3 + i * 0.2),
            Math.sin(angle * 2 + i) * 0.3
          )
        );
      }

      const curve = new THREE.CatmullRomCurve3(points);

      const trail = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 180, 0.006, 6, false),
        new THREE.MeshBasicMaterial({
          color: ringColors[i],
          transparent: true,
          opacity: 0.55,
        })
      );

      trail.rotation.x = i * 0.5;
      trail.rotation.y = i * 0.65;

      trails.add(trail);
    }

    // Mouse interaction
    const mouse = new THREE.Vector2(0, 0);
    const targetRotation = new THREE.Vector2(0, 0);

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      targetRotation.x = mouse.y * 0.2;
      targetRotation.y = mouse.x * 0.3;
    };

    container.addEventListener("pointermove", onPointerMove);

    const onResize = () => {
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    // Animation
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      frame++;

      // Central core movement
      coreGroup.rotation.y += 0.0025;
      coreGroup.rotation.x += 0.001;

      coreGroup.rotation.x +=
        (targetRotation.x - coreGroup.rotation.x) * 0.012;

      coreGroup.rotation.y +=
        (targetRotation.y - coreGroup.rotation.y) * 0.012;

      const pulse = 1 + Math.sin(elapsed * 1.6) * 0.025;

      core.scale.setScalar(pulse);
      innerSphere.scale.setScalar(0.95 + Math.sin(elapsed * 2) * 0.06);

      wireframe.rotation.y -= 0.0015;
      wireframe.rotation.x += 0.001;

      // Ring movement
      ringGroup.rotation.y += 0.0018;
      ringGroup.rotation.x += 0.0008;

      // Orbiting nodes
      nodes.forEach((node, index) => {
        const angle = elapsed * node.speed + node.offset;

        node.mesh.position.set(
          Math.cos(angle) * node.radius,
          Math.sin(angle * 1.1) * node.vertical,
          Math.sin(angle) * node.radius * 0.55
        );

        const nodePulse = 1 + Math.sin(elapsed * 3 + index) * 0.2;
        node.mesh.scale.setScalar(nodePulse);
      });

      trails.rotation.y = Math.sin(elapsed * 0.18) * 0.2;
      trails.rotation.z = Math.cos(elapsed * 0.15) * 0.12;

      particles.rotation.y = elapsed * 0.008;
      particles.rotation.x = Math.sin(elapsed * 0.1) * 0.04;

      violetLight.intensity = 40 + Math.sin(elapsed * 2) * 8;
      cyanLight.intensity = 30 + Math.cos(elapsed * 1.5) * 8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();

          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => material.dispose());
        }
      });

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      aria-label="Interactive animated 3D knowledge core"
    />
  );
}

