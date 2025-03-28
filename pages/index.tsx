import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SyntheticPutSimulator() {
  const [initialPrice, setInitialPrice] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(1);
  const [targetValue, setTargetValue] = useState(1000);
  const [futurePrice, setFuturePrice] = useState(1);
  const [firstLoss, setFirstLoss] = useState(0);

  const compute = (future) => {
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
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Synthetic Put Simulator</h1>
      <div className="space-y-4">
        <Input
          type="number"
          step="0.01"
          value={initialPrice}
          onChange={(e) => setInitialPrice(parseFloat(e.target.value))}
          placeholder="Initial Price ($1)"
        />
        <Input
          type="number"
          step="0.01"
          value={currentPrice}
          onChange={(e) => setCurrentPrice(parseFloat(e.target.value))}
          placeholder="Current Price (after stop)"
        />
        <Input
          type="number"
          step="0.01"
          value={targetValue}
          onChange={(e) => setTargetValue(parseFloat(e.target.value))}
          placeholder="Target Protected Value ($1000)"
        />
        <Input
          type="number"
          step="0.01"
          value={futurePrice}
          onChange={(e) => setFuturePrice(parseFloat(e.target.value))}
          placeholder="Future Price"
        />
        <Input
          type="number"
          step="0.01"
          value={firstLoss}
          onChange={(e) => setFirstLoss(parseFloat(e.target.value))}
          placeholder="Loss from first stop"
        />

        <Card>
          <CardContent className="space-y-2 py-4">
            <div>🔁 Шорт после стопа: {(targetValue / currentPrice).toFixed(2)} токенов</div>
            <div>📉 PnL нового шорта: ${((currentPrice - futurePrice) * (targetValue / currentPrice)).toFixed(2)}</div>
            <div>🎯 Стоимость токенов через год: ${(futurePrice * (targetValue / initialPrice)).toFixed(2)}</div>
            <div className="font-bold">💰 Итоговая сумма после всех действий: ${result.total.toFixed(2)}</div>
          </CardContent>
        </Card>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="future" label={{ value: "Future Price", position: "insideBottom", offset: -5 }} />
              <YAxis label={{ value: "Total Value", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
