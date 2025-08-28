
import React, { useState } from 'react'
import { postNeed } from '../api.js'

export default function ShareNeed() {
  const [text, setText] = useState('')
  const [phone, setPhone] = useState('')
  const [zip, setZip] = useState('')
  const [status, setStatus] = useState('')

  async function submit(e) {
    e.preventDefault()
    setStatus('Submitting…')
    try {
      const { id } = await postNeed({ text, seekerPhone: phone, zipcode: zip })
      setStatus(`Saved! ID: ${id}`)
      setText('')
    } catch (err) {
      setStatus(String(err.message || err))
    }
  }

  return (
    <div className="card">
      <h2>Share a need</h2>
      <form onSubmit={submit}>
        <textarea rows={4} placeholder={`e.g., "I need a ride to chemo Thursday at 9 AM"`} value={text} onChange={e=>setText(e.target.value)} />
        <div className="row" style={{marginTop:12}}>
          <input placeholder="Your mobile number for SMS updates (optional)" value={phone} onChange={e=>setPhone(e.target.value)} />
          <input placeholder="ZIP code (optional)" value={zip} onChange={e=>setZip(e.target.value)} />
        </div>
        <div className="actions" style={{marginTop:12}}>
          <button className="btn" type="submit">Submit</button>
          <button className="btn secondary" type="button" onClick={()=>alert('Voice coming soon!')}>Record voice</button>
        </div>
        <div className="status">{status}</div>
      </form>
    </div>
  )
}
