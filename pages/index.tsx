import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SyntheticPutSimulator() {
  const [initialPrice, setInitialPrice] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(1);
  const [targetValue, setTargetValue] = useState(1000);
  const [futurePrice, setFuturePrice] = useState(1);
  const [firstLoss, setFirstLoss] = useState(0);

  const compute = (future: number) => {
    const qtyAfterStop = targetValue / currentPrice;
    const pnlNewShort = (currentPrice - future) * qtyAfterStop;
    const valueTokens = future * (targetValue / initialPrice);
    const total = valueTokens + pnlNewShort - firstLoss;
    return { future, total };
  };

  const result = compute(futurePrice);

  const chartData = Array.from({ length: 101 }, (_, i) => {
    const price = (i * 0.05).toFixed(2);
    return compute(parseFloat(price));
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Synthetic Put Simulator
      </h1>

      <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
        <input
          type="number"
          step="0.01"
          value={initialPrice}
          onChange={(e) => setInitialPrice(parseFloat(e.target.value))}
          placeholder="Initial Price ($1)"
        />
        <input
          type="number"
          step="0.01"
          value={currentPrice}
          onChange={(e) => setCurrentPrice(parseFloat(e.target.value))}
          placeholder="Current Price (after stop)"
        />
        <input
          type="number"
          step="0.01"
          value={targetValue}
          onChange={(e) => setTargetValue(parseFloat(e.target.value))}
          placeholder="Target Protected Value ($1000)"
        />
        <input
          type="number"
          step="0.01"
          value={futurePrice}
          onChange={(e) => setFuturePrice(parseFloat(e.target.value))}
          placeholder="Future Price"
        />
        <input
          type="number"
          step="0.01"
          value={firstLoss}
          onChange={(e) => setFirstLoss(parseFloat(e.target.value))}
          placeholder="Loss from first stop"
        />
      </div>

      <div style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
        <div>🔁 Шорт после стопа: {(targetValue / currentPrice).toFixed(2)} токенов</div>
        <div>📉 PnL нового шорта: ${((currentPrice - futurePrice) * (targetValue / currentPrice)).toFixed(2)}</div>
        <div>🎯 Стоимость токенов через год: ${(futurePrice * (targetValue / initialPrice)).toFixed(2)}</div>
        <div style={{ fontWeight: "bold" }}>
          💰 Итоговая сумма после всех действий: ${result.total.toFixed(2)}
        </div>
      </div>

      <div style={{ height: 300, marginTop: "2rem" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="future" label={{ value: "Future Price", position: "insideBottom", offset: -5 }} />
            <YAxis label={{ value: "Total Value", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
