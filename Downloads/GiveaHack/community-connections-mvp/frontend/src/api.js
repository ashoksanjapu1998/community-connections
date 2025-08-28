// frontend/src/api.js
import { getIdToken } from './auth'

const BASE = import.meta.env.VITE_API_BASE || ""

// ---- helper that adds Authorization for protected endpoints
async function authedFetch(url, options = {}) {
  const token = getIdToken()
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
  return fetch(url, { ...options, headers })
}

// ---------- PUBLIC (no auth) ----------
export async function postNeed(payload) {
  const r = await fetch(`${BASE}/needs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || "Request failed")
  return data
}

// ---------- PROTECTED (requires login) ----------
export async function listOpenNeeds() {
  const r = await authedFetch(`${BASE}/needs`)
  return r.ok ? r.json() : []
}

export async function acceptNeed(id, payload) {
  const r = await authedFetch(`${BASE}/needs/${id}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || "Request failed")
  return data
}

export async function postHelper(payload) {
  const r = await authedFetch(`${BASE}/helpers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || "Request failed")
  return data
}

export async function getMetrics() {
  const r = await authedFetch(`${BASE}/metrics`)
  return r.ok ? r.json() : { counts: {} }
}
