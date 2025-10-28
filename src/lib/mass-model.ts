/**
 * Effective mass model implementation
 */

import {
  phi_vev,
  phi_0_now,
  m_base,
  k_1,
  k_2,
  c,
  v_CMB,
  H_0_SI,
  Om0,
  Or0,
  Ol0,
  max_m_eff_factor,
  H_a,
  L_cosmological,
  phi_0_evolution,
} from './cosmology'

export interface EffectiveMassResult {
  m_eff: number
  m_base_local: number
  m_motion: number
  m_eff_factor: number
  phi_0: number
  a: number
  z: number
}

/**
 * Effective mass for cosmological evolution
 * m_eff = k_1 * phi_vev + k_2 * phi_0 * (H * L / c)
 */
export function m_eff_cosmo(a: number, phi_0_val?: number): EffectiveMassResult {
  const phi_0 = phi_0_val ?? phi_0_evolution(a)
  const m_base_local = k_1 * phi_vev
  const L = L_cosmological(a)
  const H = H_a(a)
  const m_motion = k_2 * phi_0 * ((H * L) / c)
  
  const m_eff = m_base_local + m_motion
  const m_eff_factor = Math.min(m_eff / m_base, max_m_eff_factor)
  
  const z = (1 / a) - 1
  
  return {
    m_eff,
    m_base_local,
    m_motion,
    m_eff_factor,
    phi_0,
    a,
    z,
  }
}

/**
 * Effective mass for local motion (velocity-dependent)
 * m_eff_local = k_1 * phi_vev + k_2 * phi_0 * (v / c)
 */
export function m_eff_local(v: number, phi_0_val: number = phi_0_now): number {
  const m_base_local = k_1 * phi_vev
  const m_motion = k_2 * phi_0_val * (v / c)
  return m_base_local + m_motion
}

/**
 * Compute effective mass evolution over cosmic history
 */
export function computeMassEvolution(steps: number = 500): EffectiveMassResult[] {
  const results: EffectiveMassResult[] = []
  
  // Compute from z=0 to z=1100 (CMB decoupling)
  const z_min = 0
  const z_max = 1100
  
  for (let i = 0; i <= steps; i++) {
    const z = z_min + (z_max - z_min) * (i / steps)
    const a = 1 / (1 + z)
    const result = m_eff_cosmo(a)
    results.push(result)
  }
  
  return results
}

/**
 * Get effective mass at decoupling (z ≈ 1100)
 */
export function getMassAtDecoupling(): EffectiveMassResult {
  const z_dec = 1100
  const a_dec = 1 / (1 + z_dec)
  return m_eff_cosmo(a_dec)
}

/**
 * Get current effective mass
 */
export function getCurrentMass(): EffectiveMassResult {
  return m_eff_cosmo(1.0)
}

/**
 * Compute local effective mass with CMB-frame velocity
 */
export function computeLocalMass(): { 
  m_eff: number
  m_base: number 
  m_motion: number
  fractional_shift: number
} {
  const m_eff_val = m_eff_local(v_CMB, phi_0_now)
  const m_base_val = m_base
  const m_motion_val = m_eff_val - m_base_val
  const fractional_shift = m_motion_val / m_base_val
  
  return {
    m_eff: m_eff_val,
    m_base: m_base_val,
    m_motion: m_motion_val,
    fractional_shift,
  }
}

/**
 * Standard model baseline mass (constant)
 */
export function m_standard(a: number): number {
  return m_base
}
