
// content.ts - injects the built sidebar into pages (simplified for dev)
if((window as any).__catalyst_injected) {}
else{
  (window as any).__catalyst_injected = true;
  // Create a container iframe that loads the built sidebar (dist/sidebar.html)
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.top = '0';
  iframe.style.width = '360px';
  iframe.style.height = '100vh';
  iframe.style.zIndex = '2147483647';
  iframe.style.border = '0';
  iframe.src = chrome.runtime.getURL('dist/sidebar.html');
  document.body.appendChild(iframe);
}
