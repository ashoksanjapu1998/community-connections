import React, { useState } from 'react'
import ShareNeed from './pages/ShareNeed.jsx'
import Matches from './pages/Matches.jsx'
import BecomeHelper from './pages/BecomeHelper.jsx'
import { isLoggedIn, login, logout } from './auth'

export default function App() {
  const [page, setPage] = useState('share')

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">Community Connections</div>
        <nav className="menu">
          <button onClick={() => setPage('share')}>Share Need</button>
          <button onClick={() => setPage('matches')} disabled={!isLoggedIn()}>Smart Matches</button>
          <button onClick={() => setPage('helper')} disabled={!isLoggedIn()}>Become Helper</button>
          {isLoggedIn()
      ? <button onClick={logout}>Logout</button>
      : <button onClick={login}>Login</button>}
        </nav>
      </header>
<main className="container">
  {page === 'share' && <ShareNeed />}
  {page === 'matches' && (isLoggedIn() ? <Matches /> : <div className="card">Please log in to view matches.</div>)}
  {page === 'helper' && (isLoggedIn() ? <BecomeHelper /> : <div className="card">Please log in to register as a helper.</div>)}
</main>
    </div>
  )
}
