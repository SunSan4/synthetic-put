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

  const qtyAfterStop = currentPrice > 0 ? targetValue / currentPrice : 0;
  const pnlNewShort = (currentPrice - futurePrice) * qtyAfterStop;
  const valueTokens = futurePrice * (initialPrice > 0 ? targetValue / initialPrice : 0);
  const finalTotal = valueTokens + pnlNewShort - firstLoss;

  const computeChartPoint = (price: number) => {
    const qty = currentPrice > 0 ? targetValue / currentPrice : 0;
    const pnl = (currentPrice - price) * qty;
    const value = price * (initialPrice > 0 ? targetValue / initialPrice : 0);
    return {
      future: price,
      total: value + pnl - firstLoss,
    };
  };

  const chartData = Array.from({ length: 101 }, (_, i) =>
    computeChartPoint(parseFloat((i * 0.05).toFixed(2)))
  );

  const inputStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
  };

  const labelStyle = {
    width: "260px",
    fontWeight: 500,
  };

  const inputFieldStyle = {
    flex: 1,
    padding: "0.3rem 0.6rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
        Synthetic Put Simulator
      </h1>

      <div>
        <div style={inputStyle}>
          <div style={labelStyle}>💰 Initial Price (Цена до первого стопа):</div>
          <input
            type="number"
            step="0.01"
            value={initialPrice}
            onChange={(e) => setInitialPrice(parseFloat(e.target.value))}
            style={inputFieldStyle}
          />
        </div>

        <div style={inputStyle}>
          <div style={labelStyle}>📈 Current Price (после стопа):</div>
          <input
            type="number"
            step="0.01"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(parseFloat(e.target.value))}
            style={inputFieldStyle}
          />
        </div>

        <div style={inputStyle}>
          <div style={labelStyle}>🎯 Target Protected Value ($):</div>
          <input
            type="number"
            step="0.01"
            value={targetValue}
            onChange={(e) => setTargetValue(parseFloat(e.target.value))}
            style={inputFieldStyle}
          />
        </div>

        <div style={inputStyle}>
          <div style={labelStyle}>📊 Future Price (цена через год):</div>
          <input
            type="number"
            step="0.01"
            value={futurePrice}
            onChange={(e) => setFuturePrice(parseFloat(e.target.value))}
            style={inputFieldStyle}
          />
        </div>

        <div style={inputStyle}>
          <div style={labelStyle}>💥 Loss from First Stop ($):</div>
          <input
            type="number"
            step="0.01"
            value={firstLoss}
            onChange={(e) => setFirstLoss(parseFloat(e.target.value))}
            style={inputFieldStyle}
          />
        </div>
      </div>

      <div
        style={{
          background: "#f9f9f9",
          padding: "1rem",
          borderRadius: "8px",
          marginTop: "1.5rem",
          lineHeight: "1.8",
        }}
      >
        <div>📉 Шорт после стопа: <strong>{qtyAfterStop.toFixed(2)}</strong> токенов</div>
        <div>📉 PnL нового шорта: <strong>${pnlNewShort.toFixed(2)}</strong></div>
        <div>🪙 Стоимость токенов через год: <strong>${valueTokens.toFixed(2)}</strong></div>
        <div style={{ fontWeight: "bold" }}>
          💰 Итоговая сумма после всех действий: <strong>${finalTotal.toFixed(2)}</strong>
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
