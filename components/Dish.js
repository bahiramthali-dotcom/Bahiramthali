import { inr } from "@/lib/client";

export default function Dish({ d, qty = 0, onAdd, onSub }) {
  return (
    <div className="dish">
      {d.img ? <img src={`/img/${d.img}`} alt="" /> : <div className="ph">🍲</div>}
      <div className="body">
        <h4>
          <span className={"vb " + (d.veg ? "veg" : "nv")} />{d.name}
          {d.flags?.includes("s") && <span className="badge">SIGNATURE</span>}
          {d.flags?.includes("h") && <span className="badge">🌶 SPICY</span>}
        </h4>
        {d.desc && <p>{d.desc}</p>}
        <div className="row">
          <b>{inr(d.price)}</b>
          {qty ? (
            <div className="qty"><button onClick={onSub}>−</button><b>{qty}</b><button onClick={onAdd}>+</button></div>
          ) : (
            <button className="add" onClick={onAdd}>ADD</button>
          )}
        </div>
      </div>
    </div>
  );
}
