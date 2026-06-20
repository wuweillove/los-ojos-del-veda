import { createFileRoute } from '@tanstack/react-router'
import { useChartStore } from '../store/chartStore'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { setHasSubmitted } = useChartStore()
  return (
    <div className="landing-page">
      <h1>Los Ojos del Veda</h1>
      <p>Explora la mecánica celeste con precisión milimétrica.</p>
      <button onClick={() => setHasSubmitted(false)}>Comenzar Cálculo</button>
    </div>
  )
}
