export default function ProductInfo({ product, index, total, onPrev, onNext, onDot }) {
  const n = String(index + 1).padStart(2, '0');
  return (
    <aside className="info-wrap" data-aos="fade-left" data-aos-delay="400">
      <div className="glass">
        {/* key = remount => every line rises from the bottom on each change */}
        <div className="rise" key={product.id}>
          <div className="num" style={{ '--i': 0 }}>{n}<span> / {String(total).padStart(2, '0')}</span></div>
          <div className="brand" style={{ '--i': 1 }}>{product.brand}</div>
          <h1 className="name" style={{ '--i': 2 }}>{product.name}</h1>
          <p className="desc" style={{ '--i': 3 }}>{product.desc}</p>
          <div className="chips" style={{ '--i': 4 }}>
            {product.chips.map((c) => <span className="chip" key={c}>{c}</span>)}
          </div>
          <div className="price" style={{ '--i': 5 }}>{product.price}<small> / bar</small></div>
        </div>

        <div className="controls">
          <button className="neu round" onClick={onPrev} aria-label="Previous">←</button>
          <button className="neu round" onClick={onNext} aria-label="Next">→</button>
          <span className="tag">Have a break</span>
        </div>

        <div className="dots">
          {Array.from({ length: total }).map((_, i) => (
            <button key={i} className={i === index ? 'on' : ''} onClick={() => onDot(i)} aria-label={`Product ${i + 1}`} />
          ))}
        </div>
      </div>
    </aside>
  );
}
