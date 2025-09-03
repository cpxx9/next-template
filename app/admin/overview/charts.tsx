"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface PropTypes {
  data: {
    salesData: {
      month: string;
      totalSales: number;
    }[];
  };
}

const Charts = ({ data: { salesData } }: PropTypes) => {
  console.log(salesData);
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={salesData}>
        <XAxis
          dataKey="month"
          stroke="#888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="totalSales"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;
