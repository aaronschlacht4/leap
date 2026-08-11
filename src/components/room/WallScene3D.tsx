"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type Props = {
  /** sunlight builds and shadows appear */
  light: boolean;
  /** the framed piece hangs itself, then its parts assemble */
  art: boolean;
};

/** Ease matching the site's cubic-bezier(0.22, 1, 0.36, 1). */
const easeOut = (p: number) => 1 - Math.pow(1 - p, 4);
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

/** Assembly choreography — offsets in local space, delays after `art`. */
const PARTS: Array<{
  names: string[];
  offset: [number, number, number];
  spin?: [number, number, number];
  delay: number;
  dur: number;
}> = [
  // translation only — the case, logo, and screen have different pivots,
  // so any spin makes the screen drift out of the bezel mid-flight
  { names: ["Main case", "Logo", "Screen.001"], offset: [0, 0.12, 0.55], delay: 1.0, dur: 1.1 },
  { names: ["Floppy disk"], offset: [0.22, 0.05, 0.5], spin: [0, 0, 0.4], delay: 1.55, dur: 0.9 },
  { names: ["Keyboard", "keyboard Cable"], offset: [0, -0.32, 0.38], delay: 1.4, dur: 1.0 },
  { names: ["Mouse", "Mouse cable"], offset: [0.5, -0.08, 0.22], delay: 1.65, dur: 0.9 },
  { names: ["Card The Personal Computer"], offset: [0, -0.04, 0.1], delay: 2.2, dur: 0.8 },
  { names: ["Card 1984"], offset: [0, -0.04, 0.1], delay: 2.4, dur: 0.8 },
];

const HANG_DUR = 0.9; // the frame settling onto the wall
const LIGHT_DUR = 2.4; // sunlight build
const ASSEMBLY_TOTAL = Math.max(...PARTS.map((p) => p.delay + p.dur));

export default function WallScene3D({ light, art }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef(light);
  const artRef = useRef(art);
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    lightRef.current = light;
    artRef.current = art;
    kickRef.current();
  }, [light, art]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x413c37);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    // The wall — a dark museum wall; the piece carries its own light
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 24),
      new THREE.MeshStandardMaterial({ color: 0x575049, roughness: 0.97, metalness: 0, envMapIntensity: 0.03 })
    );
    wall.position.z = -0.012;
    wall.receiveShadow = true;
    scene.add(wall);

    // Lighting — ambient base always on; warm key builds during `light`
    const hemi = new THREE.HemisphereLight(0xd8d2c8, 0x1f1c19, 0.28);
    scene.add(hemi);
    // Dim room accent from the upper left — just enough to model the
    // frame's white exterior against the dark wall
    const key = new THREE.SpotLight(0xffeeda, 0);
    key.position.set(-2.1, 3.5, 2.3);
    key.target.position.set(0, 0.3, 0);
    scene.add(key.target);
    key.angle = 0.7;
    key.penumbra = 0.98;
    key.decay = 1.3;
    key.distance = 0;
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 14;
    key.shadow.bias = -0.0003;
    key.shadow.normalBias = 0.02;
    key.shadow.radius = 7;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0);
    fill.position.set(2.6, 1.2, 3.4);
    scene.add(fill);

    // ~40mm lens, slight off-axis angle — not straight-on
    const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
    const FRAME_W = 2.6; // world width the frame needs on screen (with margin)
    const placeCamera = () => {
      const aspect = camera.aspect;
      const base = 4.4;
      const forWidth = FRAME_W / (2 * Math.tan((camera.fov / 2) * Math.PI / 180) * aspect);
      const d = Math.max(base, forWidth);
      camera.position.set(0.45, 0.22, d);
      camera.lookAt(0, 0.03, 0.3);
    };

    // The framed piece — hung on the wall, back flush against it
    const artGroup = new THREE.Group();
    artGroup.position.set(0, 0.06, 0.715);
    artGroup.visible = false;
    scene.add(artGroup);

    // Interior LED strip — four recessed spots along the top of the box
    // casting scalloped pools down the back board and grounding every
    // object inside with its own shadow (they ride inside artGroup, so
    // they switch on with the piece)
    for (const x of [-0.55, -0.185, 0.185, 0.55]) {
      const led = new THREE.SpotLight(0xfff4e6, 8);
      led.position.set(x, 0.56, -0.32);
      led.target.position.set(x, -0.15, -0.5);
      led.angle = 0.5;
      led.penumbra = 0.6;
      led.decay = 1.4;
      led.distance = 0;
      led.castShadow = true;
      led.shadow.mapSize.set(1024, 1024);
      led.shadow.camera.near = 0.1;
      led.shadow.camera.far = 3;
      led.shadow.bias = -0.0004;
      led.shadow.normalBias = 0.01;
      led.shadow.radius = 5;
      artGroup.add(led);
      artGroup.add(led.target);
    }
    // Light spilling out of the lit case onto the surrounding wall —
    // the warm halo that makes the box read as the room's light source
    const spill = new THREE.PointLight(0xfff0dd, 1.6, 5, 2);
    spill.position.set(0, 0.1, 0.4);
    artGroup.add(spill);

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
    let loaded = false;
    let raf = 0;
    let lightStart: number | null = null;
    let artStart: number | null = null;

    const renderOnce = () => renderer.render(scene, camera);

    const step = () => {
      const now = performance.now();
      let busy = false;

      if (lightRef.current && lightStart === null) lightStart = now;
      if (artRef.current && artStart === null) artStart = now;

      if (lightStart !== null) {
        const p = clamp01((now - lightStart) / 1000 / LIGHT_DUR);
        const e = easeOut(p);
        key.intensity = 3.4 * e;
        fill.intensity = 0.05 * e;
        key.position.x = -3.2 + 1.1 * e;
        if (p < 1) busy = true;
      }

      if (artStart !== null && loaded) {
        artGroup.visible = true;
        const t = (now - artStart) / 1000;
        // the frame hangs itself first
        const hp = easeOut(clamp01(t / HANG_DUR));
        artGroup.position.y = 0.06 + 0.16 * (1 - hp);
        artGroup.scale.setScalar(0.97 + 0.03 * hp);
        // then the parts fly into formation — hidden until their turn
        for (const a of anims) {
          const p = clamp01((t - a.delay) / a.dur);
          a.node.visible = p > 0;
          const e = easeOut(p);
          a.node.position.lerpVectors(a.fromPos, a.basePos, e);
          a.node.quaternion.slerpQuaternions(a.fromQuat, a.baseQuat, e);
        }
        for (const f of fadeMats) {
          f.mat.opacity = easeOut(clamp01((t - f.delay) / f.dur));
        }
        if (t < ASSEMBLY_TOTAL + 0.2) busy = true;
      }

      renderOnce();
      if (busy && !disposed) raf = requestAnimationFrame(step);
      else raf = 0;
    };

    kickRef.current = () => {
      if (disposed || raf) return;
      raf = requestAnimationFrame(step);
    };

    new GLTFLoader().load("/art/macintosh_final.glb", (gltf) => {
      if (disposed) return;

      // matte-painted white frame — clean, no showy reflections
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4,
        metalness: 0,
        envMapIntensity: 0.15,
      });
      // near-invisible — at 5% opacity the glass was laying a milky
      // veil over the whole interior
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.02,
        roughness: 0.02,
        metalness: 0,
        envMapIntensity: 0.15,
        depthWrite: false,
      });

      gltf.scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (!mat) return;
        if (!mat.name || /default/i.test(mat.name) || /^Material\.\d+$/.test(mat.name)) {
          // the frame shipped without a material — white-on-white gallery frame
          mesh.material = frameMat;
        } else if (/^beige 2$/i.test(mat.name)) {
          // the case plastic shipped colorless — classic Macintosh tan
          mat.color.set(0xd3c5a6);
          mat.roughness = 0.5;
          mat.envMapIntensity = 0.15;
        } else if (/glass/i.test(mat.name)) {
          mesh.material = glassMat;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
          mesh.renderOrder = 20;
        } else if (mat.name === "Screen") {
          // two separate blowouts here: the emissive-strength extension
          // over-glows the desktop, and roughness 0 mirrors the interior
          // LEDs as a white blob across the glass
          mat.emissiveIntensity = 0.9;
          mat.roughness = 0.45;
          mat.envMapIntensity = 0;
        } else {
          mat.envMapIntensity = 0.15;
          if (/^Card /.test(mat.name)) {
            mat.transparent = true;
            mesh.castShadow = false;
            mesh.renderOrder = 5;
          }
        }
      });

      // GLTFLoader sanitizes node names (spaces become underscores)
      const findNode = (name: string) =>
        gltf.scene.getObjectByName(name) ??
        gltf.scene.getObjectByName(name.replace(/[\s.]/g, "_")) ??
        gltf.scene.getObjectByName(name.replace(/\s/g, "_"));

      // Composition to match the reference: the computer reads at real
      // display scale, keyboard tucked close under the case, label close
      // under the keyboard. (Adjust BEFORE the animation captures bases.)
      const macGroup = findNode("Apple Macintosh 1984");
      if (macGroup) macGroup.scale.multiplyScalar(1.15);
      for (const name of ["Keyboard", "keyboard Cable", "Mouse", "Mouse cable"]) {
        const n = findNode(name);
        if (n) n.position.y += 0.045;
      }
      const labelCard = findNode("Card The Personal Computer");
      if (labelCard) labelCard.position.y = -0.175;

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
          node.visible = false;
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

      artGroup.add(gltf.scene);
      loaded = true;
      kickRef.current();
      renderOnce();
    });

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      placeCamera();
      renderOnce();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    kickRef.current();

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      pmrem.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0">
      <div ref={mountRef} className="absolute inset-0" />
      {/* photographic vignette — darkens toward the corners of the room */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 105% at 50% 42%, rgba(0,0,0,0) 52%, rgba(12,11,10,0.35) 100%)",
        }}
      />
    </div>
  );
}
