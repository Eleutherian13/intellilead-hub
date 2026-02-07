import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { LeadTrend } from "@/types/lead";

interface LeadTrendChartProps {
  data: LeadTrend[];
}

export function LeadTrendChart({ data }: LeadTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="week"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            boxShadow: "0 4px 12px hsl(var(--background) / 0.5)",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="new"
          name="New Leads"
          stroke="hsl(217, 91%, 60%)"
          strokeWidth={2}
          dot={{ fill: "hsl(217, 91%, 60%)", strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="contacted"
          name="Contacted"
          stroke="hsl(38, 92%, 50%)"
          strokeWidth={2}
          dot={{ fill: "hsl(38, 92%, 50%)", strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="converted"
          name="Converted"
          stroke="hsl(142, 76%, 45%)"
          strokeWidth={2}
          dot={{ fill: "hsl(142, 76%, 45%)", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
