
// content_script.js - injects a sidebar and handles chat + API calls
(function(){
    if(window.__catalyst_injected) return;
    window.__catalyst_injected = true;

    const css = `
    #catalyst-sidebar { position: fixed; right: 0; top: 0; height: 100vh; width: 360px; background: #fff; box-shadow: -4px 0 14px rgba(0,0,0,0.1); z-index: 2147483647; font-family: Arial; display:flex; flex-direction:column; }
    #catalyst-header { padding:12px; border-bottom:1px solid #eee; display:flex; align-items:center; gap:8px; }
    #catalyst-title { font-weight:700; }
    #catalyst-messages { flex:1; padding:12px; overflow:auto; background:#fafafa; }
    .catalyst-msg { margin:8px 0; padding:8px 10px; border-radius:8px; max-width:85%; }
    .catalyst-user { background:#d1e7ff; margin-left:auto; }
    .catalyst-bot { background:#f1f1f1; margin-right:auto; }
    #catalyst-input { padding:10px; border-top:1px solid #eee; display:flex; gap:8px; }
    #catalyst-input input { flex:1; padding:8px; }
    #catalyst-meta { font-size:12px; color:#666; margin-left:auto; }
    #catalyst-close{cursor:pointer; padding:6px}
    `;

    const style = document.createElement('style');
    style.id = 'catalyst-style';
    style.textContent = css;
    document.head.appendChild(style);

    const sidebar = document.createElement('div');
    sidebar.id = 'catalyst-sidebar';
    sidebar.innerHTML = `
        <div id="catalyst-header">
            <div id="catalyst-title">Catalyst Assistant</div>
            <div id="catalyst-meta">Care mode</div>
            <div id="catalyst-close">✕</div>
        </div>
        <div id="catalyst-messages"></div>
        <div id="catalyst-input">
            <input id="catalyst-text" placeholder="Say something like: Fill form, or remind me to drink water"/>
            <button id="catalyst-send">Send</button>
        </div>
    `;
    document.body.appendChild(sidebar);

    const messagesEl = sidebar.querySelector('#catalyst-messages');
    const inputEl = sidebar.querySelector('#catalyst-text');
    const sendBtn = sidebar.querySelector('#catalyst-send');
    const closeBtn = sidebar.querySelector('#catalyst-close');

    function appendMsg(text, cls){
        const div = document.createElement('div');
        div.className = 'catalyst-msg ' + cls;
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Close behavior
    closeBtn.addEventListener('click', () => { sidebar.style.display = 'none'; });

    // Listen for toggle from popup
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if(msg.action === 'toggle_sidebar'){
            sidebar.style.display = (sidebar.style.display === 'none') ? 'flex' : 'none';
        }
    });

    // Chat handler -- uses OpenAI chat completions (gpt-3.5-turbo)
    async function callOpenAI(systemPrompt, userPrompt){
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('openai_api_key', async (res) => {
                const key = res.openai_api_key;
                if(!key){ reject('API key not set. Set it via the extension popup.'); return; }
                try{
                    const body = {
                        model: "gpt-3.5-turbo",
                        messages: [
                            {role: "system", content: systemPrompt},
                            {role: "user", content: userPrompt}
                        ],
                        temperature: 0.7,
                        max_tokens: 500
                    };
                    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + key
                        },
                        body: JSON.stringify(body)
                    });
                    const data = await resp.json();
                    if(data.error){ reject(data.error); return; }
                    const text = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : JSON.stringify(data);
                    resolve(text);
                }catch(e){
                    reject(e.toString());
                }
            });
        });
    }

    sendBtn.addEventListener('click', async () => {
        const txt = inputEl.value.trim();
        if(!txt) return;
        appendMsg(txt, 'catalyst-user');
        inputEl.value = '';
        appendMsg('... thinking', 'catalyst-bot');
        try{
            const sys = "You are Catalyst Assistant. Keep responses short, practical, and kind. Provide step actions for forms or gentle care reminders.";
            const r = await callOpenAI(sys, txt);
            // remove the last thinking message
            const last = messagesEl.querySelectorAll('.catalyst-bot');
            if(last.length) last[last.length-1].remove();
            appendMsg(r, 'catalyst-bot');
        }catch(err){
            const last = messagesEl.querySelectorAll('.catalyst-bot');
            if(last.length) last[last.length-1].remove();
            appendMsg('Error: ' + err, 'catalyst-bot');
        }
    });

    // quick shortcut: ctrl+Enter to send
    inputEl.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' && (e.ctrlKey || e.metaKey)) sendBtn.click();
    });

    // Hide initially
    sidebar.style.display = 'none';
})();
