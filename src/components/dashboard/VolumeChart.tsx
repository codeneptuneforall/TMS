'use client';
import React from 'react';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatShortDate } from '../../utils/time';

interface VolumeChartProps {
  data: {date: string;created: number;resolved: number;}[];
  height?: number;
}

export function VolumeChart({ data, height = 220 }: VolumeChartProps) {
  const total = data.reduce((s, d) => s + d.created, 0);
  const resolved = data.reduce((s, d) => s + d.resolved, 0);
  return (
    <figure>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="rgb(var(--line))" vertical={false} />
            <XAxis dataKey="date" tickFormatter={formatShortDate} tick={{ fontSize: 11, fill: 'rgb(var(--ink-3))' }} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={24} />
            <YAxis tick={{ fontSize: 11, fill: 'rgb(var(--ink-3))' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: 'rgb(var(--muted))' }}
              labelFormatter={(v: string) => formatShortDate(v)}
              contentStyle={{ borderRadius: 8, border: '1px solid rgb(var(--line))', fontSize: 12, boxShadow: '0 8px 24px -8px rgb(24 24 27 / 0.18)' }} />
            
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: 'rgb(var(--ink-2))' }} />
            <Bar dataKey="created" name="Created" fill="rgb(var(--line-strong))" radius={[3, 3, 0, 0]} maxBarSize={18} />
            <Line dataKey="resolved" name="Resolved" type="monotone" stroke="rgb(var(--accent))" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">
        {total} tickets created and {resolved} resolved over {data.length} days.
      </figcaption>
    </figure>);

}
