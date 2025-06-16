import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"

interface DashboardCardProps {
  count: number
  title: string
  icon: React.ReactNode
  color: "green" | "orange" | "teal"
}

export function DashboardCard({ count, title, icon, color }: DashboardCardProps) {
  const colorClasses = {
    green: "bg-green-500 text-white",
    orange: "bg-orange-500 text-white",
    teal: "bg-teal-500 text-white",
  }

  return (
    <Card className={`${colorClasses[color]} border-0 shadow-md`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-3xl font-bold mb-1">{count}</div>
            <div className="text-sm opacity-90">{title}</div>
          </div>
          <div className="text-2xl opacity-80">{icon}</div>
        </div>
        <div className="mt-4">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-0 h-auto font-normal">
            <Info className="w-4 h-4 mr-1" />
            Más información
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
