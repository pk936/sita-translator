let body = document.getElementsByTagName('body');
let selectedText;
let url = "https://translation.googleapis.com/language/translate/v2";

const api_key = 'AIzaSyDm__cXCVU4et-yyKboBlzoV-Pd2X0dwZw';
const rtlLanguages = new Set(['ar','iw','ur']);

let posX = 0; posY = 0;

let thumbsUpSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="49px" id="Layer_1" style="enable-background:new 0 0 44 49;" version="1.1" viewBox="0 0 44 49" width="44px" xml:space="preserve"><path d="M9,49H1c-0.6,0-1-0.4-1-1V19c0-0.6,0.5-1,1-1H9c0.6,0,1,0.5,1,1v29C10,48.6,9.5,49,9,49z M2,47h6V20H2V47z M25.8,47  C25.8,47,25.8,47,25.8,47c-0.7,0-1.4,0-2.1,0c-2.7-0.1-5.9-0.6-8.2-0.9c-1.1-0.2-2.1-0.3-2.7-0.3c-0.5,0-0.9-0.5-0.9-1V21.1  c0-0.4,0.3-0.8,0.6-0.9l0.5-0.2c2.3-0.8,7-2.6,9.4-5.2c2.6-2.7,3.8-6.4,3.8-10.8c0.1-1.4,0.9-4,3.6-4c0.5,0,1.1,0.1,1.8,0.3  c0.1,0,0.3,0.1,0.4,0.2c1.1,1.1,4.7,7.6,1.3,17.5H39c0,0,0,0,0,0c0.4,0,3.4,0.1,4.6,3.9c0.2,0.5,1,2.6-0.8,5.2  c0.5,0.9,1.3,2.8,0.4,4.8c-0.1,0.2-0.5,1.4-1.3,2.2c0.5,1.7,0.4,4.5-2,6.5c-0.1,1.2-0.6,4-3,5C36.6,45.7,32.4,47,25.8,47z M14,43.9  c0.5,0.1,1.2,0.2,1.9,0.3c2.3,0.3,5.4,0.7,8,0.9c7.4,0.3,12.3-1.3,12.3-1.3c1.7-0.7,1.7-3.6,1.7-3.6c0-0.3,0.2-0.6,0.4-0.8  c2.8-2,1.5-5,1.5-5.2c-0.2-0.5,0-1,0.5-1.3c0.4-0.2,0.9-1.1,1.1-1.6c0.8-1.8-0.5-3.5-0.5-3.5c-0.3-0.4-0.3-0.9,0-1.3  c1.7-2,1-3.6,1-3.7c0,0,0-0.1-0.1-0.1C41,20.1,39.2,20,39.1,20h-7.2c-0.3,0-0.6-0.2-0.8-0.4c-0.2-0.3-0.2-0.6-0.1-0.9  c3.5-9.1,0.7-15.3-0.2-16.6C30.4,2,30.1,2,29.9,2c-1.4,0-1.5,1.8-1.5,2c0,4.9-1.4,9-4.3,12.1c-2.7,2.9-7.5,4.7-10,5.6V43.9z M5,45  c-0.6,0-1-0.4-1-1c0-0.6,0.5-1,1-1s1,0.5,1,1C6,44.6,5.5,45,5,45z"/></svg>'

window.addEventListener("load", function(event) {
    let _node = document.createElement('div');
    _node.id = 'translateContainer';
    _node.style.display = 'none';

    let browserLanguage = navigator.language.split('-')[0];

    const debounce = (func, wait,immediate) => {
        let timeout;
        return function() {
            let context = this, args = arguments;
            let later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    const createCloseBtn = (_node) => {
        let closeBtn = document.createElement('a');
        closeBtn.id = 'closeBtn';
        closeBtn.innerText = 'X';
        closeBtn.addEventListener('click', () => {
            _node.style.display = 'none';
        });

        _node.appendChild(closeBtn);
        return createCloseBtn;
    }

    const createTranslatedText = (_node) => {
        let translatedText = document.createElement('span');
        translatedText.id = 'translatedText';
        _node.appendChild(translatedText);
        return translatedText;
    }
    //
    // const createSourceDropdown = (_node) => {
    //     let srcLangDrpdwn = document.createElement('select');
    //     let option = document.createElement('option');
    //     option.value = 'Source';
    //     option.innerText = 'Source';
    //
    //     for(let i=1;i<5;i++){
    //         let option = document.createElement('option');
    //         option.value = i;
    //         option.innerText = i;
    //         srcLangDrpdwn.appendChild(option)
    //     }
    //
    //     srcLangDrpdwn.classList.add('langDrpdwn');
    //     let targetLangDrpdwn = srcLangDrpdwn.cloneNode(true);
    //
    //     srcLangDrpdwn.id='sourceLang';
    //     srcLangDrpdwn.childNodes[0].innerText = 'Source'
    //
    //     targetLangDrpdwn.id='targetLang';
    //     targetLangDrpdwn.childNodes[0].innerText = 'Target'
    //
    //     _node.appendChild(srcLangDrpdwn);
    //     _node.appendChild(targetLangDrpdwn);
    //     return srcLangDrpdwn;
    // }
    //
    // const createLoader = (_node) => {
    //     let loader = document.createElement('div')
    //     loader.classList.add('loader');
    //     loader.style.display = 'none';
    //     _node.appendChild(loader);
    //     return loader;
    // }

    const createFeedbackBtn = (_node) => {
        let feedbackBtn = document.createElement('a')
        feedbackBtn.classList.add('feedbackBtn');
        // feedbackBtn.innerText = 'Say Thanks';
        feedbackBtn.href = 'https://chrome.google.com/webstore/detail/sitas-translator/anhalogecnnmbgojhjffbdfimlpemoop/reviews';
        feedbackBtn.target = '_blank';
        _node.appendChild(feedbackBtn);
        return feedbackBtn;
    }

    // const createCopyTextBtn = (_node,translatedText) => {
    //     let copyBtn = document.createElement('a')
    //     copyBtn.classList.add('copyBtn');
    //     copyBtn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 512 512" height="512px" id="Layer_1" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve"><path d="M468.493,101.637L371.955,5.098H159.57v77.231H43.724v424.769h308.923v-77.231h115.846V101.637z   M371.955,32.401l69.236,69.235h-69.236V32.401z M63.031,487.79V101.637h173.769v96.538h96.538V487.79H63.031z M256.108,109.632  l69.236,69.235h-69.236V109.632z M352.647,410.56V178.867l-96.538-96.538h-77.231V24.406h173.769v96.538h96.538V410.56H352.647z" fill="#37404D"/></svg>'
    //
    //     copyBtn.addEventListener('click', ()=>{
    //         translatedText.innerText.select();
    //         document.execCommand('copy');
    //     })
    //
    //     _node.appendChild(copyBtn);
    //     return copyBtn;
    // }

    let closeBtn = createCloseBtn(_node);
    // let langDrpdwn = createSourceDropdown(_node);

    let translatedText = createTranslatedText(_node);

    // let loader = createLoader(_node);

    let feedbackBtn = createFeedbackBtn(_node);

    // let copyTextBtn = createCopyTextBtn(_node, translatedText);

    body[0].appendChild(_node);

    document.addEventListener('mousemove', (e) => {
        posX = e.clientX;
        posY = e.clientY;
    })

    document.addEventListener('selectionchange', debounce((e) => {
        // console.log('document.activeElement', document.querySelector( ':focus' ))
        selectedText = getSelectionText().trim();

        // don't call api if user selects the translated text.
        let isTranslatedTextIsSelected = window.getSelection().anchorNode.parentElement.id === 'translatedText';

        if (selectedText && !isTranslatedTextIsSelected) {
                    _node.style.display = 'block';
                    translatedText.style.display = 'none';
                    getSourceTextLanguage(url, selectedText).then(sourceTextLanguage => sourceTextLanguage).then(sourceTextLanguage => {
                        let targetLanguage = browserLanguage;
                        if (sourceTextLanguage && targetLanguage !== sourceTextLanguage) { // if source and target are not same
                            if(!rtlLanguages.has(targetLanguage)){
                                translatedText.dir = 'ltr';
                            }

                            translateText(url, selectedText, sourceTextLanguage, targetLanguage).then(text => {
                                if(text && text.trim()) {
                                    _node.style.top = posY + 'px';
                                    _node.style.left = posX + 'px';
                                    translatedText.style.display = 'inherit';
                                    translatedText.innerText = text;
                                }
                            }).catch(err=>{
                                removeTranslateContainer(_node);
                            })
                        }else{
                            // console.log('No text selected');
                            removeTranslateContainer(_node);
                        }
                    }).catch(err=>{
                        removeTranslateContainer(_node);
                    })
                } else {
                    // console.log('No text selected')
                    // removeTranslateContainer(_node);
                }
            }, 500)
    )


    // 1. Read the selected text
    const getSelectionText = () => {
        let text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type !== "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    }

    // 2. Detect the language of the selected text

    const getSourceTextLanguage = (url, selectedText) => {
        return new Promise((resolve, reject) => {
            url += '/detect?key=' + api_key;
            url += "&q=" + selectedText;
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if (req.readyState === 4) {
                    if(!req.response.includes('Bad Request')) {
                        let source = JSON.parse(req.response);
                        //source.data[0].detections[0][0] return confidence, isReliable, language
                        resolve(source.data.detections[0][0].language)
                    }else{
                        reject(req)
                    }
                }
            }
            req.open('GET', url, false)
            req.send();
        })
    }

    // 3. Translate the selected text to browser language

    const translateText = (url, selectedText, sourceTextLanguage, targetLanguage) => {
        return new Promise((resolve, reject) => {
            url += '?key=' + api_key;
            url += "&source=" + sourceTextLanguage;
            url += "&target=" + targetLanguage;
            url += "&q=" + selectedText;
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if (req.readyState === 4) {
                    let translatedText = JSON.parse(req.response);

                    if(translatedText.data) {
                        resolve(translatedText.data.translations[0].translatedText);
                    }else{
                        // alert('Oops ! Please try again.')
                        reject(translatedText.error)
                    }
                }
            }
            req.open('GET', url, false)
            req.send();
        })
    }



    const removeTranslateContainer = (_node) => {
        _node.style.display = 'none';
        translatedText.innerText = '';
        _node.style.top = 0;
        _node.style.left = 0;
    }

    if(!localStorage.translatedThanks) {
        translateText(url, 'Rate us!', 'en', browserLanguage).then(text => {
            localStorage.setItem('translatedThanks', text)
            feedbackBtn.innerText = text;
        })
    }else{
        feedbackBtn.innerText = localStorage.translatedThanks;
    }
})



