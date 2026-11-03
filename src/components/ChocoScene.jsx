import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { products } from '../data/products';
import { imagePlane } from './loadTex';
import { createFloaters } from './FloatingObjects';

export default function ChocoScene({ index, onReady }) {
  const mount = useRef(null);
  const S = useRef(null); // shared state between the two effects below

  // ---------- 1. build the scene once ----------
  useEffect(() => {
    const el = mount.current;

    // renderer (draws the 3D scene on a canvas)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    el.appendChild(renderer.domElement);

    // scene + camera + lights
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const camera = new THREE.PerspectiveCamera(35, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 12);

    const spot = new THREE.SpotLight(0xffe2b8, 260, 40, 0.55, 0.7, 2);
    spot.position.set(0, 8, 9);
    scene.add(spot, spot.target);
    scene.add(new THREE.PointLight(0xff9a4d, 45, 22, 2));
    scene.add(new THREE.AmbientLight(0xffe9d2, 0.25));

    // the 3 product images, each one is a flat plane
    const items = products.map((p) => {
      const root = new THREE.Group();
      root.add(imagePlane(p.img, p.w, p.ratio));
      root.visible = false;
      scene.add(root);
      return { root, p, y: 10, target: 10 }; // y = height offset (animated)
    });
    items[0].root.visible = true;

    // floating spheres, bars and bubbles (see FloatingObjects.js)
    const floaters = createFloaters(scene, el.clientWidth < 768);

    S.current = { items, current: 0 };

    // keep size + position right on every screen size
    const anchor = new THREE.Vector3(); // where the product sits
    const layout = () => {
      const w = el.clientWidth, h = el.clientHeight;
      const mobile = w < 768;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.position.z = mobile ? 13 : 12;
      camera.updateProjectionMatrix();
      const viewWidth = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * camera.aspect;
      if (mobile) anchor.set(0, 1.5, 0);
      else anchor.set(-viewWidth * (w < 1100 ? 0.1 : 0.14), 0, 0);
      items.forEach((it) => it.root.scale.setScalar(Math.min(1, (mobile ? viewWidth * 0.82 : viewWidth * 0.5) / it.p.w)));
      floaters.setScale(Math.min(1, Math.max(0.3, viewWidth / 13.5)));
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    // first product drops in from the top
    const launch = setTimeout(() => { items[0].target = 0; }, 1300);
    requestAnimationFrame(() => onReady && onReady());

    // ---------- animation loop (runs every frame) ----------
    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      items.forEach((it) => {
        if (!it.root.visible) return;
        it.y += (it.target - it.y) * Math.min(1, dt * 3.2);      // slide toward target
        it.root.position.set(anchor.x, anchor.y + it.y + Math.sin(t * 1.1) * 0.1, 0); // gentle bobbing
        it.root.rotation.y = it.y * 0.18;                          // tiny spin only while dropping
        it.root.rotation.z = it.p.tilt;                            // fixed tilt
        if (it.target !== 0 && Math.abs(it.y) > 9) it.root.visible = false; // hide after falling out
      });

      spot.target.position.set(anchor.x, anchor.y, 0);
      floaters.update(t, dt);
      renderer.render(scene, camera);
    };
    tick();

    // cleanup when component unmounts
    return () => {
      clearTimeout(launch);
      cancelAnimationFrame(raf);
      ro.disconnect();
      floaters.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m.map && m.map.dispose(); m.dispose(); });
      });
      pmrem.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  // ---------- 2. when product changes: old one falls, new one drops in ----------
  useEffect(() => {
    const s = S.current;
    if (!s || s.current === index) return;
    s.items[s.current].target = -10;
    const next = s.items[index];
    next.y = 10;
    next.target = 0;
    next.root.visible = true;
    s.current = index;
  }, [index]);

  return <div className="scene" ref={mount} />;
}