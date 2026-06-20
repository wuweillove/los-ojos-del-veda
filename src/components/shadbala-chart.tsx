import { useChartStore } from "../store/chartStore"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

export function ShadBalaChart() {
  const { apiData } = useChartStore()
  
  if (!apiData?.shadbala || !Array.isArray(apiData.shadbala)) return null

  const data = apiData.shadbala.map((sb: any) => ({
    name: sb.name,
    total: sb.total,
    rupas: sb.rupas
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Shadbala Analysis</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="var(--g)">
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.total > 400 ? "#8faab5" : "#5d7f8c"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
