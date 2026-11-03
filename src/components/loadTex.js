import * as THREE from 'three';
const loader = new THREE.TextureLoader();
export function loadTex(url) {
  const t = loader.load(url);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
export function imagePlane(url, w, ratio, opacity = 1) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, w / ratio),
    new THREE.MeshBasicMaterial({ map: loadTex(url), transparent: true, depthWrite: false, toneMapped: false, opacity })
  );
  return m;
}
