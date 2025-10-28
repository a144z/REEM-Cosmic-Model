/**
 * Cosmological calculations for the emergent mass model
 */

// Physical Constants
export const c = 2.99792458e8 // Speed of light (m/s)
export const h = 6.62607015e-34 // Planck constant (J·s)
export const m_e = 9.1093837e-31 // Electron mass (kg)
export const GeV_to_kg = 1.783e-27 // GeV to kg conversion
export const H_0_km = 67.4 // Hubble constant (km/s/Mpc)
export const H_0_SI = H_0_km * 3.241e-20 // Hubble constant in s^-1
export const rho_CMB = 4.2e-14 // CMB energy density (J/m^3)
export const phi_vev = 246 * GeV_to_kg // Higgs VEV (kg)
export const v_CMB = 370e3 // Earth's velocity relative to CMB (m/s)
export const k_1 = 1.0 // Baseline mass coupling
export const epsilon = 1e-8 // Motion term coupling parameter
export const phi_0_now = rho_CMB / (c * c) // CMB mass density (kg/m^3)
export const m_base = k_1 * phi_vev // Baseline mass (kg)
export const k_2 = epsilon * m_base / phi_0_now // Motion term coupling (m^3)
export const max_m_eff_factor = 1.05 // Cap for stability

// Cosmological parameters (Planck 2018)
export const Om0 = 0.315 // Matter density parameter
export const Or0 = 5e-5 // Radiation density parameter
export const Ol0 = 0.685 // Dark energy density parameter

/**
 * Hubble parameter as a function of scale factor
 * H(a) = H_0 * sqrt(Om/a^3 + Or/a^4 + Ol)
 */
export function H_a(a: number, Om0_p: number = Om0, Or0_p: number = Or0, Ol0_p: number = Ol0): number {
  const a_clamped = Math.max(a, 1e-10)
  return H_0_SI * Math.sqrt(Om0_p / Math.pow(a_clamped, 3) + Or0_p / Math.pow(a_clamped, 4) + Ol0_p)
}

/**
 * Derivative of ln(a) with respect to time (for ODE solver)
 * dlnadt = H(a)
 */
export function dlnadt(lna: number, Om0_p: number = Om0, Or0_p: number = Or0, Ol0_p: number = Ol0): number {
  const a = Math.exp(lna)
  return H_a(a, Om0_p, Or0_p, Ol0_p)
}

/**
 * Simple Euler integrator for scale factor evolution
 */
export function integrateScaleFactor(t0: number, tmax: number, steps: number = 1000): { a: number[], H: number[] } {
  const a: number[] = []
  const H: number[] = []
  
  let lna = Math.log(1e-4)
  const dt = (tmax - t0) / steps
  
  for (let i = 0; i <= steps; i++) {
    const a_val = Math.exp(lna)
    a.push(a_val)
    H.push(H_a(a_val))
    
    if (i < steps) {
      const dlna = dlnadt(lna)
      lna += dlna * dt
    }
  }
  
  return { a, H }
}

/**
 * Relativity field evolution (radiation-like)
 * phi_0(a) = phi_0_now * (1/a)^4
 */
export function phi_0_evolution(a: number, phi_0_now_val: number = phi_0_now): number {
  return phi_0_now_val * Math.pow(1 / a, 4)
}

/**
 * Cosmological length scale (Hubble radius proxy)
 * L = c / H(a)
 */
export function L_cosmological(a: number): number {
  return c / H_a(a)
}

/**
 * Redshift from scale factor
 * z = 1/a - 1
 */
export function redshiftFromScaleFactor(a: number): number {
  return (1 / a) - 1
}

/**
 * Scale factor from redshift
 * a = 1 / (1 + z)
 */
export function scaleFactorFromRedshift(z: number): number {
  return 1 / (1 + z)
}
