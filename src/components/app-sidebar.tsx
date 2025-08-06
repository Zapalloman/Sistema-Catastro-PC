"use client"

import { FileCode, Home, Settings, Users, HardDrive, Laptop, Computer, FileText, Monitor, Wifi, Apple, Server } from "lucide-react"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
    items: [],
  },
  {
    title: "Procesos",
    icon: FileText,
    href: "/procesos",
    items: [],
  },
  {
    title: "Parametros Generales",
    icon: Settings,
    href: "/parametros-generales",
    items: [],
  },
  /*{
    title: "Parametros de Equipos",
    icon: Monitor,
    href: "/parametros-equipos",
    items: [],
  },*/
  {
    title: "Prestamos externos",
    icon: Users,
    href: "/prestamos",
    items: [],
  },
  {
    title: "Equipamiento IGM",
    icon: Laptop,
    href: "/equipos",
    items: [],
  },
  {
    title: "Equipos LATSUR",
    icon: HardDrive,
    href: "/equipamiento-latsur",
    items: [],
  },
  {
    title: "Equipos Z8",
    icon: Computer,
    href: "/estaciones-z8",
    items: [],
  },
  {
    title: "Equipos MAC",
    icon: Apple,
    href: "/estaciones-mac",
    items: [],
  },
  {
    title: "Datacenter",
    icon: Server,
    href: "/datacenter",
    items: [],
  },
  {
    title: "Software",
    icon: FileCode,
    href: "/software",  
    items: [],
  }
]

export function AppSidebar() {
  const pathname = usePathname()
  const [userName, setUserName] = useState("Administrador SIA CIMI")

  useEffect(() => {
    // Obtener nombre del usuario desde localStorage
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        if (user.nombre && user.nombre.trim()) {
          setUserName(user.nombre)
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  return (
    <Sidebar className="border-r bg-white text-black">
      <SidebarHeader className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium">{userName}</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`flex items-center gap-3 px-4 py-2 rounded transition-colors
                        border-l-4
                        ${
                          isActive
                            ? "border-blue-600 bg-blue-50 text-blue-800 font-semibold"
                            : "border-transparent text-slate-800 hover:bg-slate-100"
                        }
                      `}
                    >
                      <a href={item.href || "#"}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
