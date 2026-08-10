"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Props = { active: boolean };

/** Ease matching the site's cubic-bezier(0.22, 1, 0.36, 1). */
const easeOut = (p: number) => 1 - Math.pow(1 - p, 4);

/**
 * Assembly choreography. Offsets are in each node's local space —
 * parts fly in from outside the frame and settle into formation.
 * Delays are seconds after the piece becomes active.
 */
const PARTS: Array<{
  names: string[];
  offset: [number, number, number];
  spin?: [number, number, number];
  delay: number;
  dur: number;
}> = [
  { names: ["Main case", "Logo", "Screen.001"], offset: [0, 0.10, 0.55], spin: [0, -0.35, 0], delay: 0.7, dur: 1.1 },
  { names: ["Floppy disk"], offset: [0.22, 0.05, 0.5], spin: [0, 0, 0.4], delay: 1.25, dur: 0.9 },
  { names: ["Keyboard", "keyboard Cable"], offset: [0, -0.32, 0.38], delay: 1.1, dur: 1.0 },
  { names: ["Mouse", "Mouse cable"], offset: [0.5, -0.08, 0.22], delay: 1.35, dur: 0.9 },
  { names: ["Card The Personal Computer"], offset: [0, -0.05, 0.12], delay: 1.9, dur: 0.8 },
  { names: ["Card 1984"], offset: [0, -0.05, 0.12], delay: 2.1, dur: 0.8 },
];

const TOTAL = Math.max(...PARTS.map((p) => p.delay + p.dur)) + 0.1;

export default function MacintoshArt3D({ active }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const startRef = useRef<number | null>(null);
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    activeRef.current = active;
    if (active) kickRef.current();
  }, [active]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0xcfcabe, 1.35));
    const key = new THREE.DirectionalLight(0xfff2e0, 1.5);
    key.position.set(-2.5, 2.5, 3.5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.9);
    fill.position.set(2.5, 1, 3);
    scene.add(fill);

    // Frame bounds: 1.90 × 1.26, front face z ≈ -0.087. Straight-on camera.
    const fov = 30;
    const halfH = 0.6305 * 1.04;
    const dist = halfH / Math.tan(((fov / 2) * Math.PI) / 180);
    const camera = new THREE.PerspectiveCamera(fov, 2400 / 1593, 0.01, 100);
    camera.position.set(-0.001, -0.001, -0.087 + dist);
    camera.lookAt(-0.001, -0.001, -0.087);

    type Anim = {
      node: THREE.Object3D;
      basePos: THREE.Vector3;
      baseQuat: THREE.Quaternion;
      fromPos: THREE.Vector3;
      fromQuat: THREE.Quaternion;
      delay: number;
      dur: number;
    };
    const anims: Anim[] = [];
    const fadeMats: Array<{ mat: THREE.Material & { opacity: number }; delay: number; dur: number }> = [];

    let disposed = false;
    let raf = 0;
    let loaded = false;

    const renderOnce = () => renderer.render(scene, camera);

    const applyProgress = (t: number) => {
      let done = true;
      for (const a of anims) {
        const p = Math.min(Math.max((t - a.delay) / a.dur, 0), 1);
        if (p < 1) done = false;
        const e = easeOut(p);
        a.node.position.lerpVectors(a.fromPos, a.basePos, e);
        a.node.quaternion.slerpQuaternions(a.fromQuat, a.baseQuat, e);
      }
      for (const f of fadeMats) {
        const p = Math.min(Math.max((t - f.delay) / f.dur, 0), 1);
        if (p < 1) done = false;
        f.mat.opacity = easeOut(p);
      }
      return done;
    };

    const tick = () => {
      if (disposed) return;
      const t = (performance.now() - (startRef.current ?? performance.now())) / 1000;
      const done = applyProgress(t);
      renderOnce();
      if (!done && t < TOTAL + 1) raf = requestAnimationFrame(tick);
    };

    kickRef.current = () => {
      if (!loaded || disposed || startRef.current !== null) return;
      startRef.current = performance.now();
      raf = requestAnimationFrame(tick);
    };

    new GLTFLoader().load("/art/macintosh_final.glb", (gltf) => {
      if (disposed) return;
      gltf.scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (!mat) return;
        if (/glass/i.test(mat.name)) {
          mat.transparent = true;
          mat.opacity = 0.1;
          mat.roughness = 0.05;
          mat.depthWrite = false;
          mesh.renderOrder = 10;
        }
        if (/^Card /.test(mat.name)) {
          mat.transparent = true;
        }
      });

      // GLTFLoader sanitizes node names (spaces become underscores)
      const findNode = (name: string) =>
        gltf.scene.getObjectByName(name) ??
        gltf.scene.getObjectByName(name.replace(/[\s.]/g, "_")) ??
        gltf.scene.getObjectByName(name.replace(/\s/g, "_"));

      for (const part of PARTS) {
        for (const name of part.names) {
          const node = findNode(name);
          if (!node) continue;
          const basePos = node.position.clone();
          const baseQuat = node.quaternion.clone();
          const fromPos = basePos.clone().add(new THREE.Vector3(...part.offset));
          const spin = new THREE.Quaternion().setFromEuler(new THREE.Euler(...(part.spin ?? [0, 0, 0])));
          const fromQuat = baseQuat.clone().multiply(spin);
          node.position.copy(fromPos);
          node.quaternion.copy(fromQuat);
          anims.push({ node, basePos, baseQuat, fromPos, fromQuat, delay: part.delay, dur: part.dur });
          node.traverse((c) => {
            const m = (c as THREE.Mesh).material as THREE.Material & { opacity: number };
            if (m && /^Card /.test(m.name)) {
              m.opacity = 0;
              fadeMats.push({ mat: m, delay: part.delay, dur: part.dur });
            }
          });
        }
      }

      scene.add(gltf.scene);
      loaded = true;
      renderOnce();
      if (activeRef.current) kickRef.current();
    });

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (loaded) renderOnce();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className="h-full w-full" />;
}
