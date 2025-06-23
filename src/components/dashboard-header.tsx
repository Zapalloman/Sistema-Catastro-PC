"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const router = useRouter();

  return (
    <header className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">IGM</span>
          </div>
          <span className="font-medium">Catastro Computacional</span>
        </div>
        <SidebarTrigger className="text-white hover:bg-blue-700" />
        <span className="text-sm">Home</span>
      </div>

      <div className="flex items-center gap-4">
        <nav className="text-sm">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span className="text-blue-200">
            {typeof window !== "undefined" && window.location.pathname === "/procesos" ? "Procesos" : "Starter Page"}
          </span>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white hover:bg-blue-700 gap-2">
              <User className="w-4 h-4" />
              {/* Aquí podrías mostrar el nombre del usuario autenticado */}
              {/* Si tienes un estado de usuario, puedes usarlo aquí: */}
              {/* Por ejemplo, si tienes un estado de usuario: */}
              {/* {user.name} */}
             
              admin (IGM - CIMI)
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-red-600">
              <button
                type="button"
                onClick={() => {
                  // Limpia el estado de autenticación, tokens, etc.
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("token");
                    sessionStorage.clear();
                  }
                  // Redirige al login (asegúrate que la ruta sea correcta, por ejemplo "/login" o "/auth/login")
                  router.replace("/");
                }}
                className="flex items-center w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
