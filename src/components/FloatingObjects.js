import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/* Decoration only: glossy chocolate balls, caramel glass balls,
   chocolate bars and small rising bubbles. */
export function createFloaters(scene, mobile) {
  const group = new THREE.Group();
  scene.add(group);

  // materials
  const choc = (hex) => new THREE.MeshPhysicalMaterial({ color: hex, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.25 });
  const dark = choc(0x2a130a), milk = choc(0x6b3a22), mid = choc(0x4a2515);
  const caramel = new THREE.MeshPhysicalMaterial({ color: 0xf0b36a, transmission: 1, thickness: 1.4, roughness: 0.05, ior: 1.4, envMapIntensity: 1.2 });

  const sphere = new THREE.SphereGeometry(1, 48, 48);
  const items = [];
  const add = (obj, x, y, z, s, i) => {
    obj.scale.setScalar(s);
    group.add(obj);
    items.push({ m: obj, bx: x, by: y, bz: z, ph: i * 1.3, sp: 0.22 + (i % 5) * 0.07, rs: 0.08 + (i % 4) * 0.1 });
  };

  // chocolate bar = base + grid of raised squares
  const tileGeo = new RoundedBoxGeometry(0.42, 0.42, 0.14, 3, 0.05);
  const makeBar = (cols, rows, mat) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new RoundedBoxGeometry(cols * 0.5 + 0.06, rows * 0.5 + 0.06, 0.14, 3, 0.05), mat));
    for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
      const t = new THREE.Mesh(tileGeo, mat);
      t.position.set((c - (cols - 1) / 2) * 0.5, (r - (rows - 1) / 2) * 0.5, 0.09);
      g.add(t);
    }
    return g;
  };

  // [make object, x, y, z, size]
  const specs = [
    [() => new THREE.Mesh(sphere, dark), -6.4, 2.6, -2, 0.95],
    [() => new THREE.Mesh(sphere, milk), 5.9, -2.8, -1, 0.75],
    [() => new THREE.Mesh(sphere, caramel), 1.8, 3.5, -2, 0.6],
    [() => new THREE.Mesh(sphere, mid), -4.6, -3.2, 0.5, 0.5],
    [() => new THREE.Mesh(sphere, milk), 6.6, 1.6, -2.5, 0.55],
    [() => makeBar(4, 3, dark), -6.2, -1.2, -1.5, 0.85],
    [() => makeBar(3, 2, milk), 3.4, 3.7, -1, 0.7],
    [() => new THREE.Mesh(sphere, caramel), -2.6, -3.7, -1, 0.45],
    [() => makeBar(2, 2, mid), 5.2, -0.6, -1.5, 0.6],
    [() => new THREE.Mesh(sphere, dark), -3.2, 3.9, 0, 0.32],
    [() => new THREE.Mesh(sphere, milk), 3.0, -3.6, 1, 0.3],
  ];
  (mobile ? specs.slice(0, 7) : specs).forEach(([make, x, y, z, s], i) => add(make(), x, y, z, s, i));

  // small rising bubbles
  const N = mobile ? 50 : 110;
  const pos = new Float32Array(N * 3), spd = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 16;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 11;
    pos[i * 3 + 2] = -3 + Math.random() * 6;
    spd[i] = 0.12 + Math.random() * 0.4;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d');
  const gr = x.createRadialGradient(32, 32, 4, 32, 32, 30);
  gr.addColorStop(0, 'rgba(255,225,180,0.55)'); gr.addColorStop(0.7, 'rgba(240,170,100,0.25)'); gr.addColorStop(1, 'rgba(240,170,100,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  const pm = new THREE.PointsMaterial({ map: tex, size: 0.32, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.8 });
  scene.add(new THREE.Points(geo, pm));

  let k = 1; // horizontal scale for small screens
  return {
    setScale(v) { k = v; },
    update(t, dt) {
      items.forEach((f) => {
        f.m.position.set(f.bx * k + Math.sin(t * f.sp + f.ph) * 0.35, f.by + Math.cos(t * f.sp * 1.2 + f.ph) * 0.4, f.bz);
        f.m.rotation.x += dt * f.rs;
        f.m.rotation.y += dt * f.rs * 1.3;
      });
      const p = geo.attributes.position;
      for (let i = 0; i < N; i++) {
        let y = p.getY(i) + spd[i] * dt;
        if (y > 5.5) { y = -5.5; p.setX(i, (Math.random() - 0.5) * 16 * k); }
        p.setY(i, y);
      }
      p.needsUpdate = true;
    },
    dispose() { tex.dispose(); geo.dispose(); pm.dispose(); },
  };
}