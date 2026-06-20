import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/grahas/$slug')({
  component: GrahaDetail,
})

function GrahaDetail() {
  const { slug } = Route.useParams()
  return (
    <div className="p-4">
      <h3>Detalle de {slug}</h3>
    </div>
  )
}
