document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['rtlEnabled'], function(result) {
        document.getElementById('status').textContent = result.rtlEnabled ? '✅ فعال' : '⭕ غیرفعال';
        document.getElementById('status').style.color = result.rtlEnabled ? '#4CAF50' : '#f44336';
    });
    
    document.getElementById('enableBtn').onclick = function() {
        chrome.storage.local.set({rtlEnabled: true}, function() {
            document.getElementById('status').textContent = '✅ فعال';
            document.getElementById('status').style.color = '#4CAF50';
            
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0].url.includes('chat.deepseek.com')) {
                    chrome.scripting.executeScript({
                        target: {tabId: tabs[0].id},
                        func: function() {
                            if (document.getElementById('ultimate-rtl-fix')) return;
                            
                            function hasPersian(text) {
                                return /[\u0600-\u06FF]/.test(text);
                            }
                            
                            var style = document.createElement('style');
                            style.id = 'ultimate-rtl-fix';
                            style.textContent = `
                                textarea, div[contenteditable="true"], [role="textbox"] {
                                    text-align: right !important;
                                }
                                .ds-markdown, [class*="message"], .markdown-body {
                                    text-align: right !important;
                                    direction: rtl !important;
                                }
                                pre, code {
                                    direction: ltr !important;
                                    text-align: left !important;
                                }
                            `;
                            document.head.appendChild(style);
                            
                            var inputs = document.querySelectorAll('textarea, div[contenteditable="true"], [role="textbox"]');
                            for (var i = 0; i < inputs.length; i++) {
                                var input = inputs[i];
                                input.style.direction = hasPersian(input.value || input.innerText) ? 'rtl' : 'ltr';
                                
                                input.addEventListener('input', function(e) {
                                    e.target.style.direction = hasPersian(e.target.value || e.target.innerText) ? 'rtl' : 'ltr';
                                });
                            }
                        }
                    });
                }
            });
            
            alert('✅ فعال شد');
        });
    };
    
    document.getElementById('disableBtn').onclick = function() {
        chrome.storage.local.set({rtlEnabled: false}, function() {
            document.getElementById('status').textContent = '⭕ غیرفعال';
            document.getElementById('status').style.color = '#f44336';
            
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0].url.includes('chat.deepseek.com')) {
                    chrome.scripting.executeScript({
                        target: {tabId: tabs[0].id},
                        func: function() {
                            var style = document.getElementById('ultimate-rtl-fix');
                            if (style) style.remove();
                            
                            document.querySelectorAll('textarea, div[contenteditable="true"], [role="textbox"]').forEach(el => {
                                el.style.direction = '';
                                el.style.textAlign = '';
                            });
                        }
                    });
                }
            });
            
            alert('❌ غیرفعال شد');
        });
    };
});