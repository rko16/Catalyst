(function(){if(window.__catalyst_injected)return;window.__catalyst_injected=!0;const m=`
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
    `,l=document.createElement("style");l.id="catalyst-style",l.textContent=m,document.head.appendChild(l);const a=document.createElement("div");a.id="catalyst-sidebar",a.innerHTML=`
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
    `,document.body.appendChild(a);const i=a.querySelector("#catalyst-messages"),r=a.querySelector("#catalyst-text"),y=a.querySelector("#catalyst-send"),u=a.querySelector("#catalyst-close");function c(t,s){const e=document.createElement("div");e.className="catalyst-msg "+s,e.textContent=t,i.appendChild(e),i.scrollTop=i.scrollHeight}u.addEventListener("click",()=>{a.style.display="none"}),chrome.runtime.onMessage.addListener((t,s,e)=>{t.action==="toggle_sidebar"&&(a.style.display=a.style.display==="none"?"flex":"none")});async function g(t,s){return new Promise((e,n)=>{chrome.storage.local.get("openai_api_key",async f=>{const p=f.openai_api_key;if(!p){n("API key not set. Set it via the extension popup.");return}try{const d={model:"gpt-3.5-turbo",messages:[{role:"system",content:t},{role:"user",content:s}],temperature:.7,max_tokens:500},o=await(await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+p},body:JSON.stringify(d)})).json();if(o.error){n(o.error);return}const h=o.choices&&o.choices[0]&&o.choices[0].message?o.choices[0].message.content:JSON.stringify(o);e(h)}catch(d){n(d.toString())}})})}y.addEventListener("click",async()=>{const t=r.value.trim();if(t){c(t,"catalyst-user"),r.value="",c("... thinking","catalyst-bot");try{const e=await g("You are Catalyst Assistant. Keep responses short, practical, and kind. Provide step actions for forms or gentle care reminders.",t),n=i.querySelectorAll(".catalyst-bot");n.length&&n[n.length-1].remove(),c(e,"catalyst-bot")}catch(s){const e=i.querySelectorAll(".catalyst-bot");e.length&&e[e.length-1].remove(),c("Error: "+s,"catalyst-bot")}}}),r.addEventListener("keydown",t=>{t.key==="Enter"&&(t.ctrlKey||t.metaKey)&&y.click()}),a.style.display="none"})();
