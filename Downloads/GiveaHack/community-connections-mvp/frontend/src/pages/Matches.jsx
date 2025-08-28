import React, { useEffect, useState } from 'react'
import { listOpenNeeds, acceptNeed } from '../api'

export default function Matches() {
  const [needs, setNeeds] = useState([])
  const [helperPhone, setHelperPhone] = useState('') // simple input

  async function refresh() {
    try { setNeeds(await listOpenNeeds()) } catch { setNeeds([]) }
  }
  useEffect(() => { refresh() }, [])

  async function onAccept(id) {
    if (!helperPhone) { alert('Enter helper phone to accept'); return }
    try {
      await acceptNeed(id, { helperPhone, helperName: 'Demo Helper' })
      await refresh()
    } catch (e) { alert(e.message || e) }
  }

  return (
    <div className="card">
      <h2>Open needs</h2>
      <div className="row" style={{margin:"8px 0 12px"}}>
        <input placeholder="Helper phone to use for accept" value={helperPhone} onChange={e=>setHelperPhone(e.target.value)} />
      </div>
      <div className="list">
        {needs.length === 0 && <div className="item">No open needs yet.</div>}
        {needs.map(n => (
          <div className="item" key={n.id}>
            <div><b>{n.needType?.toUpperCase() || 'NEED'}</b> — {n.text}</div>
            <div style={{fontSize:12, opacity:.8}}>ZIP: {n.zipcode || 'N/A'} | Status: {n.status}</div>
            {n.status === 'open' && <div style={{marginTop:8}}>
              <button className="btn" onClick={()=>onAccept(n.id)}>Accept</button>
            </div>}
          </div>
        ))}
      </div>
    </div>
  )
}
