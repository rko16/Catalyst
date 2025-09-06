
import React from 'react'
import { createRoot } from 'react-dom/client'

export default function SidebarApp(){
  const [messages, setMessages] = React.useState<string[]>([])
  const [text, setText] = React.useState('')

  async function send(){
    if(!text) return
    setMessages(m=>[...m, 'You: '+text])
    setText('')
    // send message to background to call OpenAI (background handles fetch to avoid CORS in content)
    chrome.runtime.sendMessage({action:'call_openai', prompt:text}, (resp:any)=>{
      setMessages(m=>[...m, 'Bot: '+(resp?.text || 'Error')])
    })
  }

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',width:360,fontFamily:'Arial'}}>
      <div style={{padding:12,borderBottom:'1px solid #eee',display:'flex',justifyContent:'space-between'}}>
        <strong>Catalyst Assistant</strong>
        <span>Care mode</span>
      </div>
      <div style={{flex:1,padding:12,overflow:'auto',background:'#fafafa'}}>
        {messages.map((m,i)=>(<div key={i} style={{margin:8,padding:8,background:i%2? '#f1f1f1':'#d1e7ff',borderRadius:8}}>{m}</div>))}
      </div>
      <div style={{padding:12,borderTop:'1px solid #eee',display:'flex',gap:8}}>
        <input style={{flex:1,padding:8}} value={text} onChange={(e)=>setText(e.target.value)} placeholder="Ask: Fill form, remind me..." />
        <button onClick={send}>Send</button>
      </div>
    </div>
  )
}

// If loaded as a page, render directly (for dev)
const el = document.getElementById('sidebar-root')
if(el) createRoot(el).render(<SidebarApp />)

export { SidebarApp }
