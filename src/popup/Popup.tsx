import React from 'react'
import ReactDOM from 'react-dom/client'

function Popup() {
  return <div style={{ padding: "10px", width: "200px" }}>Catalyst Extension Popup 🚀</div>
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Popup />)
