"use client"

import {
  ChevronDown,
  Home,
  Settings,
  Users,
  HardDrive,
  Laptop,
  Building,
  Key,
  FileText,
  Monitor,
  Wifi,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const menuItems = [
  {
    title: "Home",
    icon: Home,
    isActive: true,
    items: [{ title: "Dashboard", href: "/", isActive: true }],
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
    items: [],
  },
  {
    title: "Parametros de Equipos",
    icon: Monitor,
    items: [],
  },
  {
    title: "Prestamos",
    icon: Users,
    items: [],
  },
  {
    title: "Equipos IGM",
    icon: Laptop,
    items: [],
  },
  {
    title: "Equipamiento LATSUR",
    icon: HardDrive,
    items: [],
  },
  {
    title: "Estaciones ZB",
    icon: Wifi,
    items: [],
  },
  {
    title: "Estaciones MAC",
    icon: Building,
    items: [],
  },
  {
    title: "Cambio Clave",
    icon: Key,
    items: [],
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r bg-slate-800 text-white">
      <SidebarHeader className="border-b border-slate-700 p-4">
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
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items.length > 0 ? (
                    <Collapsible defaultOpen={item.isActive}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-700">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={subItem.isActive}
                                className="text-slate-400 hover:text-white"
                              >
                                <a href={subItem.href}>{subItem.title}</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild className="text-slate-300 hover:text-white hover:bg-slate-700">
                      <a href={item.href || "#"}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
