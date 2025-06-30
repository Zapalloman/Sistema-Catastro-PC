"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Plus, TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { ReactNode } from "react"

interface QuickStat {
  label: string
  value: string | number
  trend: "up" | "down" | "stable"
}

interface Alert {
  type: "warning" | "error" | "info" | "success"
  message: string
  count: number
}

interface PrimaryStat {
  label: string
  value: number
  unit: string
}

interface ModernDashboardCardProps {
  title: string
  subtitle: string
  icon: ReactNode
  primaryStat: PrimaryStat
  quickStats: QuickStat[]
  alerts: Alert[]
  navigationUrl: string
  addNewUrl: string
  addNewLabel: string
  gradientColors: string
  iconColor: string
  progressData?: {
    label: string
    value: number
    max: number
    color: string
  }
}

export function ModernDashboardCard({
  title,
  subtitle,
  icon,
  primaryStat,
  quickStats,
  alerts,
  navigationUrl,
  addNewUrl,
  addNewLabel,
  gradientColors,
  iconColor,
  progressData,
}: ModernDashboardCardProps) {
  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-500" />
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-500" />
      case "stable":
        return <Minus className="w-3 h-3 text-gray-400" />
    }
  }

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getProgressColor = (color: string) => {
    const colors = {
      purple: "bg-purple-500",
      gray: "bg-gray-500",
      slate: "bg-slate-500",
      blue: "bg-blue-500",
      cyan: "bg-cyan-500",
      green: "bg-green-500",
    }
    return colors[color as keyof typeof colors] || "bg-gray-500"
  }

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${gradientColors}`} />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gray-50 ${iconColor}`}>{icon}</div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Primary Statistic */}
        <div className="text-center py-2">
          <div className="text-3xl font-bold text-gray-900">{primaryStat.value}</div>
          <div className="text-sm text-gray-600">{primaryStat.label}</div>
        </div>

        {/* Progress Bar (if provided) */}
        {progressData && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{progressData.label}</span>
              <span className="font-medium">
                {progressData.value}/{progressData.max}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getProgressColor(progressData.color)}`}
                style={{ width: `${(progressData.value / progressData.max) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
                {getTrendIcon(stat.trend)}
              </div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div key={index} className={`text-xs p-2 rounded-md border ${getAlertColor(alert.type)}`}>
                <div className="flex items-center justify-between">
                  <span>{alert.message}</span>
                  {alert.count > 1 && (
                    <Badge variant="secondary" className="text-xs">
                      {alert.count}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => (window.location.href = navigationUrl)}
          >
            Ver Detalles
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
          <Button
            size="sm"
            className={`bg-gradient-to-r ${gradientColors} text-white border-0 hover:opacity-90`}
            onClick={() => (window.location.href = addNewUrl)}
          >
            <Plus className="w-3 h-3 mr-1" />
            {addNewLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
