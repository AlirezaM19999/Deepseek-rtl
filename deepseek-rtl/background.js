// تابع هوشمند نهایی - ویرایش شده
function ultimateSmartRTL() {
    if (document.getElementById('ultimate-rtl-fix')) return;
    
    // ===== استایل پایه =====
    var style = document.createElement('style');
    style.id = 'ultimate-rtl-fix';
    style.textContent = `
        /* اینپوت‌ها - بدون text-align اجباری */
        textarea, 
        div[contenteditable="true"], 
        [role="textbox"] {
            /* text-align رو به مرورگر می‌سپاریم */
        }
        
        /* متن جواب‌ها - کاملاً راست‌چین */
        .ds-markdown,
        [class*="message"],
        [class*="answer"],
        [class*="response"],
        .markdown-body,
        .prose {
            text-align: right !important;
            direction: rtl !important;
        }
        
        /* پاراگراف‌ها */
        .ds-markdown p,
        [class*="message"] p {
            text-align: right !important;
            direction: rtl !important;
        }
        
        /* کدها - همیشه چپ */
        pre, code, .code-block,
        [class*="code"] {
            direction: ltr !important;
            text-align: left !important;
        }
        
        /* لیست‌ها */
        ul, ol {
            text-align: right !important;
            direction: rtl !important;
            padding-right: 20px !important;
            padding-left: 0 !important;
        }
    `;
    document.head.appendChild(style);
    
    // ===== تشخیص فارسی =====
    function hasPersian(text) {
        var persianRegex = /[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u200C\u200F]/;
        return persianRegex.test(text);
    }
    
    // ===== مدیریت اینپوت‌ها (فارسی/انگلیسی) =====
    var inputs = document.querySelectorAll('textarea, div[contenteditable="true"], [role="textbox"]');
    
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        
        // تنظیم اولیه
        var currentText = input.value || input.innerText || '';
        input.style.direction = hasPersian(currentText) ? 'rtl' : 'ltr';
        input.style.textAlign = ''; // خالی کردن text-align
        
        // شنونده تایپ
        input.addEventListener('input', function(e) {
            var text = e.target.value || e.target.innerText || '';
            
            // اگه فارسی داره => راست‌چپ
            if (hasPersian(text)) {
                e.target.style.direction = 'rtl';
            } 
            // اگه فقط انگلیسی/عدد انگلیسی داره => چپ‌چپ
            else {
                e.target.style.direction = 'ltr';
            }
        });
    }
    
    console.log('✅ Ultimate RTL فعال شد (بدون مشکل انگلیسی)');
}

// ===== ردیابی صفحات =====
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('deepseek.com')) {
        chrome.storage.local.get(['rtlEnabled'], function(result) {
            if (result.rtlEnabled === true) {
                setTimeout(() => {
                    chrome.scripting.executeScript({
                        target: {tabId: tabId},
                        func: ultimateSmartRTL
                    }).catch(() => {});
                }, 1500);
            }
        });
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url && tab.url.includes('deepseek.com')) {
            chrome.storage.local.get(['rtlEnabled'], function(result) {
                if (result.rtlEnabled === true) {
                    setTimeout(() => {
                        chrome.scripting.executeScript({
                            target: {tabId: activeInfo.tabId},
                            func: ultimateSmartRTL
                        }).catch(() => {});
                    }, 1500);
                }
            });
        }
    });
});