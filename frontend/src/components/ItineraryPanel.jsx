import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function ItineraryPanel({ plan }) {
  if (!plan) return <div style={{padding:16}}>Search a place to generate itinerary.</div>;
  const { budget } = plan;
  const data = [
    { name: 'Hotel', value: budget.hotelCost },
    { name: 'Food', value: budget.foodCost },
    { name: 'Transport', value: budget.transportCost },
    { name: 'Activities', value: budget.activityCost },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  return (
    <div style={{padding:16}}>
      <h2>{plan.center.display_name}</h2>
      <h3>Auto-generated itinerary</h3>
      {plan.itinerary.map(day => (
        <div key={day.day} style={{marginBottom:12, padding:8, border:'1px solid #ddd', borderRadius:8}}>
          <strong>Day {day.day}</strong>
          <ul>{day.items.map(it => (<li key={it.id}>{it.name} — <small>{it.kind}</small></li>))}</ul>
        </div>
      ))}
      <div style={{marginTop:12, padding:12, border:'2px solid #f0f0f0', borderRadius:8, background:'#fff'}}>
        <h3>Estimated Budget (INR)</h3>
        <p><strong>Total: ₹{plan.budget.totalBudget.toLocaleString()}</strong></p>
        <p>Estimated distance: {plan.totalKm} km</p>
        <div style={{width:'100%', height:200}}>
          <ResponsiveContainer>
            <PieChart><Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>{data.map((entry,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/></PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
