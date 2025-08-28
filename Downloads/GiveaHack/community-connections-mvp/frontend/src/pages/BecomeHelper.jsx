import React, { useState } from 'react'
import { postHelper } from '../api'

export default function BecomeHelper() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [zipcode, setZip] = useState('')
  const [skills, setSkills] = useState('transportation,food')
  const [status, setStatus] = useState('')

  async function submit(e) {
    e.preventDefault()
    setStatus('Submitting…')
    try {
      const payload = { name, phone, zipcode, skills: skills.split(',').map(s=>s.trim()), radiusMi: 15 }
      await postHelper(payload)
      setStatus('Registered! (SMS off in demo, but you are in the system.)')
    } catch (e) { setStatus(String(e.message || e)) }
  }

  return (
    <div className="card">
      <h2>Become a helper</h2>
      <form onSubmit={submit}>
        <input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
        <div className="row" style={{marginTop:12}}>
          <input placeholder="Mobile number" value={phone} onChange={e=>setPhone(e.target.value)} />
          <input placeholder="ZIP code" value={zipcode} onChange={e=>setZip(e.target.value)} />
        </div>
        <input style={{marginTop:12}} placeholder="Skills (comma-separated)" value={skills} onChange={e=>setSkills(e.target.value)} />
        <div className="actions" style={{marginTop:12}}>
          <button className="btn" type="submit">Register</button>
        </div>
        <div className="status">{status}</div>
      </form>
    </div>
  )
}
