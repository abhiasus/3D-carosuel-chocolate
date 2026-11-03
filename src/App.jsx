import { useEffect, useRef, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { products } from './data/products';
import ChocoScene from './components/ChocoScene';
import ProductInfo from './components/ProductInfo';

export default function App() {
  const [index, setIndex] = useState(0);
  const total = products.length;

  useEffect(() => { AOS.init({ duration: 1000, once: true, easing: 'ease-out-cubic' }); }, []);

  // auto-advance every 6s (pauses 12s after you click something)
  const lastAction = useRef(Date.now());
  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() - lastAction.current > 12000) setIndex((i) => (i + 1) % total);
    }, 6000);
    return () => clearInterval(id);
  }, [total]);

  const go = (fn) => { lastAction.current = Date.now(); setIndex(fn); };

  return (
    <main className="stage" style={{ '--accent': products[index].accent }}>
      <div className="glow" />
      <ChocoScene index={index} />
      <ProductInfo
        product={products[index]} index={index} total={total}
        onPrev={() => go((i) => (i - 1 + total) % total)}
        onNext={() => go((i) => (i + 1) % total)}
        onDot={(i) => go(() => i)}
      />
    </main>
  );
}