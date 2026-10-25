'use client';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface HBarDatum {
  label: string;
  value: number;
  color: string;
}

const tooltipStyle = { borderRadius: 8, border: '1px solid rgb(var(--line))', fontSize: 12, boxShadow: '0 8px 24px -8px rgb(24 24 27 / 0.18)' };

export function HorizontalBars({ data, height = 200, unit = '' }: {data: HBarDatum[];height?: number;unit?: string;}) {
  return (
    <figure>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }}>
            <CartesianGrid stroke="rgb(var(--line))" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: 'rgb(var(--ink-3))' }} axisLine={false} tickLine={false} allowDecimals={false} unit={unit} />
            <YAxis type="category" dataKey="label" width={92} tick={{ fontSize: 12, fill: 'rgb(var(--ink-2))' }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: 'rgb(var(--muted))' }} contentStyle={tooltipStyle} formatter={(v: number) => [`${v}${unit}`, '']} separator="" />
            <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={18}>
              {data.map((d) => <Cell key={d.label} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">{data.map((d) => `${d.label}: ${d.value}${unit}`).join(', ')}</figcaption>
    </figure>);

}
