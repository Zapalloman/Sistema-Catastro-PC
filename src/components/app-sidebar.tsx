"use client"

import { Home, Settings, Users, HardDrive, Laptop, Key, FileText, Monitor, Wifi, Apple, Server } from "lucide-react"

import { usePathname } from "next/navigation"
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
  {
    title: "Parametros de Equipos",
    icon: Monitor,
    href: "/parametros-equipos",
    items: [],
  },
  {
    title: "Prestamos",
    icon: Users,
    href: "/prestamos",
    items: [],
  },
  {
    title: "Equipos",
    icon: Laptop,
    href: "/equipos",
    items: [],
  },
  {
    title: "Equipamiento LATSUR",
    icon: HardDrive,
    href: "/equipamiento-latsur",
    items: [],
  },
  {
    title: "Estaciones Z8",
    icon: Wifi,
    href: "/estaciones-z8",
    items: [],
  },
  {
    title: "Estaciones MAC",
    icon: Apple,
    href: "/estaciones-mac",
    items: [],
  },
  {
    title: "Datacenter",
    icon: Server,
    href: "/datacenter",
    items: [],
  }
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r bg-white text-black">
      <SidebarHeader className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium">Administrador SIA CIMI</div>
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
