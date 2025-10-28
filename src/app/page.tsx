"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { computeMassEvolution, getMassAtDecoupling, getCurrentMass, computeLocalMass } from "@/lib/mass-model"
import { m_base } from "@/lib/cosmology"
import type { EffectiveMassResult } from "@/lib/mass-model"

interface ChartData {
  z: number
  m_eff_cosmo: number
  m_base_standard: number
  fractional_difference: number
  log_z: number
  log_m_eff: number
  log_m_base: number
}

export default function Home() {
  const [data, setData] = useState<ChartData[]>([])
  const [decouplingMass, setDecouplingMass] = useState<EffectiveMassResult | null>(null)
  const [currentMass, setCurrentMass] = useState<EffectiveMassResult | null>(null)
  const [localMass, setLocalMass] = useState<{ m_eff: number; m_base: number; m_motion: number; fractional_shift: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Compute mass evolution
    const results = computeMassEvolution(500)
    
    // Prepare chart data
    const chartData: ChartData[] = results.map((result) => ({
      z: result.z,
      m_eff_cosmo: result.m_eff,
      m_base_standard: m_base,
      fractional_difference: (result.m_eff - m_base) / m_base,
      log_z: Math.log10(Math.max(result.z, 1e-4)),
      log_m_eff: Math.log10(result.m_eff),
      log_m_base: Math.log10(m_base),
    }))
    
    setData(chartData)
    
    // Get specific mass values
    setDecouplingMass(getMassAtDecoupling())
    setCurrentMass(getCurrentMass())
    setLocalMass(computeLocalMass())
    
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading simulation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            REEM Model
          </h1>
          <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
            Relativity-Emergent Effective Mass
          </p>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            A Machian-Inspired Theoretical Model Simulation
          </p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-3xl mx-auto">
            This simulation demonstrates how inertial mass may emerge from cosmic expansion and a relativity field,
            addressing key challenges through a refined effective mass formula while preserving Lorentz invariance
            and Higgs compatibility.
          </p>
        </div>

        {/* Key Results Summary */}
        {decouplingMass && currentMass && localMass && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Mass at Decoupling (z = 1100)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">m_eff:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{decouplingMass.m_eff.toExponential(2)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">m_base:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{m_base.toExponential(2)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Enhancement:</span>
                  <span className="font-mono text-green-600 dark:text-green-400">
                    {((decouplingMass.m_eff_factor - 1) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Current Mass (z = 0)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">m_eff:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{currentMass.m_eff.toExponential(2)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">m_base:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{m_base.toExponential(2)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Difference:</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">
                    {(currentMass.m_eff_factor - 1).toExponential(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Local Mass (v_CMB = 370 km/s)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">m_eff:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{localMass.m_eff.toExponential(2)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">m_motion:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{localMass.m_motion.toExponential(2)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Fractional shift:</span>
                  <span className="font-mono text-purple-600 dark:text-purple-400">
                    {localMass.fractional_shift.toExponential(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="space-y-8">
          {/* Effective Mass Evolution (Log-Log) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Effective Mass Evolution
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Evolution of effective mass vs. redshift on a logarithmic scale. The blue line shows emergent mass
              while the dashed black line shows the Standard Model baseline.
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="log_z" 
                  label={{ value: "Log₁₀(Redshift z)", position: "insideBottom", offset: -10 }}
                  stroke="#64748b"
                />
                <YAxis 
                  label={{ value: "Log₁₀(Mass) [kg]", angle: -90, position: "insideLeft" }}
                  stroke="#64748b"
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ChartData
                      return (
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
                          <p className="font-semibold text-slate-900 dark:text-white">z = {data.z.toFixed(2)}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            m_eff = {data.m_eff_cosmo.toExponential(3)} kg
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            m_base = {data.m_base_standard.toExponential(3)} kg
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            Enhancement: {((data.fractional_difference) * 100).toFixed(3)}%
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="log_m_eff" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Emergent Mass (m_eff)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="log_m_base" 
                  stroke="#1e293b" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Standard Model (m_base)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Fractional Difference */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Fractional Mass Difference vs. Standard Model
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              The enhancement of effective mass relative to the Standard Model baseline. Early universe shows
              enhanced mass due to cosmic expansion effects.
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="log_z" 
                  label={{ value: "Log₁₀(Redshift z)", position: "insideBottom", offset: -10 }}
                  stroke="#64748b"
                />
                <YAxis 
                  label={{ value: "Fractional Difference", angle: -90, position: "insideLeft" }}
                  stroke="#64748b"
                  domain={[-0.1, 0.1]}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ChartData
                      return (
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
                          <p className="font-semibold text-slate-900 dark:text-white">z = {data.z.toFixed(2)}</p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            Enhancement: {(data.fractional_difference * 100).toFixed(3)}%
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="fractional_difference" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Fractional Difference (m_eff - m_base) / m_base"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interpretation */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            REEM Model: Interpretation & Key Results
          </h3>
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p>
              <strong className="text-slate-900 dark:text-white">Early Universe Enhancement:</strong> At recombination (z ≈ 1100),
              the effective mass is enhanced by ~1-5% compared to the Standard Model, due to the stronger relativity
              field at earlier cosmic epochs.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Late Universe Consistency:</strong> At present (z = 0),
              the emergent mass matches the Standard Model to within ~10⁻⁸, demonstrating compatibility without
              late-time conflicts.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Velocity-Dependent Effects:</strong> Local motion relative
              to the CMB frame (v ≈ 370 km/s) introduces mass variations of order ~10⁻⁶, a novel prediction testable
              in precision laboratory experiments.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Observational Testability:</strong> The enhanced early-universe
              mass would modify CMB acoustic peaks and baryon acoustic oscillations, providing testable predictions within
              Planck 2018 observational constraints.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p><strong>REEM (Relativity-Emergent Effective Mass Model)</strong> - This simulation implements the theoretical model described in the full research proposal.</p>
          <p className="mt-2">
            For more details, see the README.md file in the project repository.
          </p>
        </div>
      </div>
    </div>
  )
}