import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Component() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="text-center pb-6">
          {/* Logo placeholder - you can replace this with your actual logo */}
          <div className="flex justify-center mb-4">
            <div className="w-48 h-24 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <span className="text-gray-500 text-sm">Logo IGM</span>
            </div>
          </div>

          <h1 className="text-lg font-medium text-gray-700 leading-tight">
            Bienvenido al Sistema de Catastro
            <br />
            Computacional
          </h1>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-normal text-gray-600">
              Nombre de Usuario
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Nombre de Usuario"
              className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
            />
          </div>

          <Button type="submit" className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium mt-6">
            Ingresar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
