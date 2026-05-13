import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import WorkoutPlan from './WorkoutPlan.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WorkoutPlan />
  </StrictMode>,
)
