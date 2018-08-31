// const axios = require('axios');
let body = document.getElementsByTagName('body');
// body.backgroundImage = 'https://wallpapercave.com/wp/dxXh4Ss.jpg';
//
// for (let i = 0, l = images.length; i < l; i++) {
//   images[i].src = 'http://placekitten.com/' + images[i].width + '/' + images[i].height;
// }
let selectedText;
let url = "https://translation.googleapis.com/language/translate/v2";

// const languages = require('languages.json');
const api_key = 'AIzaSyDm__cXCVU4et-yyKboBlzoV-Pd2X0dwZw';

let posX = 0; posY = 0;

window.addEventListener("load", function(event) {
    let _node = document.createElement('div');
    _node.id = 'translateContainer';
    _node.style.display = 'none';
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
        feedbackBtn.innerText = 'Say thanks !';
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

        // _node.addEventListener('click', (e)=>{
        //     console.log('EEE', e.target,e.currentTarget);
        // })

    document.addEventListener('selectionchange', debounce((e) => {
        // console.log('document.activeElement', document.querySelector( ':focus' ))
        selectedText = getSelectionText();

        // don't call api if user selects the translated text.
        let isTranslatedTextIsSelected = window.getSelection().anchorNode.parentElement.id === 'translatedText';

        if (selectedText.trim() && !isTranslatedTextIsSelected) {
                    _node.style.display = 'block';
                    translatedText.style.display = 'none';
                    getSourceTextLanguage(url, selectedText).then(sourceTextLanguage => sourceTextLanguage).then(sourceTextLanguage => {
                        let targetLanguage = navigator.language.split('-')[0];
                         //navigator.language.split('-')[0]; // REMOVE THIS LINE LATER
                        if (sourceTextLanguage && targetLanguage !== sourceTextLanguage) { // if source and target are same
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

    const getSelectionText = () => {
        let text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type !== "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    }

    const removeTranslateContainer = (_node) => {
        _node.style.display = 'none';
        translatedText.innerText = '';
        _node.style.top = 0;
        _node.style.left = 0;
    }
})



