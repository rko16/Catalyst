
document.getElementById('save').addEventListener('click', async () => {
    const key = document.getElementById('apiKey').value.trim();
    if(!key){ alert('Enter API key'); return; }
    await chrome.storage.local.set({openai_api_key: key});
    alert('API key saved locally.');
});
document.getElementById('toggle').addEventListener('click', async () => {
    // Send message to content script to toggle sidebar
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.tabs.sendMessage(tab.id, {action: 'toggle_sidebar'});
});
// Load stored key if present
chrome.storage.local.get('openai_api_key', (res) => {
    if(res.openai_api_key) document.getElementById('apiKey').value = res.openai_api_key;
});
