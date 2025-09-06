import React from 'react'
import ReactDOM from 'react-dom/client'

function Sidebar() {
  return <div style={{ padding: "10px", width: "300px", background: "#f4f4f4" }}>Catalyst Sidebar Chat UI</div>
}

ReactDOM.createRoot(document.getElementById('sidebar-root')!).render(<Sidebar />)
