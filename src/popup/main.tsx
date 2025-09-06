
import React from 'react'
import { createRoot } from 'react-dom/client'

function PopupApp(){
  const [key, setKey] = React.useState('')
  React.useEffect(()=>{
    chrome.storage.local.get('openai_api_key', (res)=>{ if(res.openai_api_key) setKey(res.openai_api_key) })
  },[])
  return (
    <div style={{fontFamily: 'Arial', padding:12, width:300}}>
      <h3>Catalyst Assistant (TS)</h3>
      <label>OpenAI API Key</label>
      <input style={{width:'100%',padding:8,marginTop:6}} value={key} onChange={(e)=>setKey(e.target.value)} placeholder="sk-..." />
      <button style={{width:'100%',padding:8,marginTop:8}} onClick={()=>{ chrome.storage.local.set({openai_api_key:key}); alert('Saved'); }}>Save</button>
      <button style={{width:'100%',padding:8,marginTop:8}} onClick={async ()=>{ const [tab] = await chrome.tabs.query({active:true,currentWindow:true}); chrome.tabs.sendMessage(tab.id, {action:'toggle_sidebar'}); }}>Toggle Sidebar</button>
    </div>
  )
}

createRoot(document.getElementById('popup-root')!).render(<PopupApp />)
