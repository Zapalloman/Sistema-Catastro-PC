"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface ProcessCardProps {
  title: string
  description: string
  icon: React.ReactNode
  color: "blue" | "green" | "orange" | "purple"
  onClick?: () => void
}

export function ProcessCard({ title, description, icon, color, onClick }: ProcessCardProps) {
  const colorClasses = {
    blue: "bg-blue-500 hover:bg-blue-600 text-white",
    green: "bg-green-500 hover:bg-green-600 text-white",
    orange: "bg-orange-500 hover:bg-orange-600 text-white",
    purple: "bg-purple-500 hover:bg-purple-600 text-white",
  }

  return (
    <Card
      className={`${colorClasses[color]} border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 cursor-pointer`}
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="text-3xl opacity-90">{icon}</div>
          <ArrowRight className="w-6 h-6 opacity-70" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardTitle className="text-xl mb-2 font-semibold">{title}</CardTitle>
        <p className="text-sm opacity-90 leading-relaxed">{description}</p>
        <div className="mt-4">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-0 h-auto font-medium">
            Acceder al proceso
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
