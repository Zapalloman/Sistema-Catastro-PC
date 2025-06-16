"use client";
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Component() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Aquí iría tu lógica de autenticación
    // Si es exitosa:
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="text-center pb-6">
          
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-34 w-54 rounded-md"
            />
          </div>

          <h1 className="text-lg font-medium text-gray-700 leading-tight">
            Bienvenido al Sistema de Catastro
            <br />
            Computacional
          </h1>
        </CardHeader>

        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-normal text-gray-600">
                Nombre de Usuario
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Nombre de Usuario"
                className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-normal text-gray-600">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Contraseña"
                className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium mt-6">
              Ingresar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
