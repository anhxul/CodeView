import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

export default function ScoreTrendChart({ data = [] }) {
  const chartData = data.map((item) => ({
    name: formatDate(item.date),
    score: item.score,
  }));

  return (
    <Card className="glass h-full">
      <CardHeader>
        <CardTitle className="text-base">Score Trend</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Complete reviews to track your code quality trend over time.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" />
              <XAxis dataKey="name" stroke="hsl(215 20% 65%)" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="hsl(215 20% 65%)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(222 47% 9%)',
                  border: '1px solid hsl(217 33% 17%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={{ fill: '#22d3ee', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}