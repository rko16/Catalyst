
// background.ts - listens for messages and calls OpenAI
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if(msg.action === 'call_openai'){
    chrome.storage.local.get('openai_api_key', async (res) => {
      const key = res.openai_api_key
      if(!key){ sendResponse({error:'No API key set'}); return; }
      try{
        const body = {
          model: 'gpt-3.5-turbo',
          messages: [{role:'system',content:'You are Catalyst Assistant. Keep responses short and kind.'}, {role:'user', content: msg.prompt}]
        }
        const r = await fetch('https://api.openai.com/v1/chat/completions', {
          method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+key}, body: JSON.stringify(body)
        })
        const data = await r.json()
        const text = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : JSON.stringify(data)
        sendResponse({text})
      }catch(e){
        sendResponse({error: e.toString()})
      }
    })
    // indicate we'll respond asynchronously
    return true
  }
})
