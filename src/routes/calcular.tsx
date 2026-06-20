import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/calcular')({
  component: Calcular,
})

function Calcular() {
  return (
    <div className="p-4">
      <h3>Calcular Carta</h3>
      {/* Formulario integrado en el componente principal */}
    </div>
  )
}
