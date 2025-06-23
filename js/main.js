import {
    blockScroll, unblockScroll,
    fadeIn, fadeOut,
    showLoader, hideLoader
} from './ui.js';
import {
    LOCAL_STORAGE_KEY, saveToLocalStorage, restoreFromLocalStorage,
    validate, hasInvalidInput, clearInvalidMsg, clearForm
} from './formHandler.js';
import { scriptUrl, scriptMailUrl } from './config.js';

const submitBtn = document.querySelector('.submit');
const wishList = document.querySelectorAll('[id^="wish"]');
const inputs = document.querySelectorAll('input');
const docUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfEyuUcKksS07RsUSrH6ZUd5ZztGzAaNM5hZotbnVmw5Hnl1g/formResponse';
const modal = document.querySelector('.modal-container');
const loader = document.querySelector('.loader-page');
const closeBtn = document.querySelectorAll('*[data-close-modal]');

const messageSuccess = '已複製!';
const authorMail = document.querySelector('.authorMail');

inputs.forEach(input => {
    input.addEventListener('input', () => {
        clearInvalidMsg(input);
        saveToLocalStorage(inputs);
    });
    input.addEventListener('blur', () => validate(input));
});

window.addEventListener('DOMContentLoaded', () => restoreFromLocalStorage(inputs));

submitBtn.addEventListener('click', submitForm);
closeBtn.forEach(node => {
    node.addEventListener('click', () => {
        fadeOut(modal);
        unblockScroll();
    });
});

function submitForm(e) {
    e.preventDefault();
    const wishObj = verifyAndGetWishObj(wishList);
    if (hasInvalidInput(inputs)) return;
    sendToGoogle(wishObj);
}

function sendToGoogle(wishObj) {
    const formData = new FormData();
    formData.append('url', docUrl);
    formData.append('formData', convertToFormData(wishObj));

    const options = {
        method: 'POST',
        mode: 'cors',
        body: formData
    };
    const req = new Request(scriptUrl, options);

    showLoader(loader);
    fetch(req).then(rsp => {
        hideLoader(loader);
        clearForm(inputs);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        fadeIn(modal, 'flex');
        blockScroll();

        if (rsp.status === 200) {
            console.log('Form submitted successfully!');
        }
    }).catch(err =>
        console.error('Error when sending form:', err)
    );

    if (wishObj.wishCopy) {
        sendMail(wishObj);
    }
}

function sendMail(wishObj) {
    const formData = new FormData();
    formData.append('mailTo', wishObj.wisherEmail);
    formData.append('subject', '心願便利貼<回執聯>');
    formData.append('message', `親愛的${wishObj.wisherName}，我們已經收到您的心願<br>
        心願內容：${wishObj.wish}<br>
        心願數量：${wishObj.wishNumber}<br>
        預算上限：${wishObj.wishBudget}<br><br>感謝您對我們的支持！`);

    const options = {
        method: 'POST',
        mode: 'cors',
        body: formData
    };
    const req = new Request(scriptMailUrl, options);

    fetch(req)
        .then(rsp => rsp.text())
        .then(console.log)
        .catch(err => console.error('Error when mailing:', err));
}

function convertToFormData(wishObj) {
    const entry = {
        'entry.1886774351': wishObj.wish,
        'entry.988848665': wishObj.wishNumber,
        'entry.205027762': wishObj.wishBudget,
        'entry.1864506117': wishObj.wisherName,
        'entry.243484161': wishObj.wisherEmail
    }
    return JSON.stringify(entry);
}

function verifyAndGetWishObj(wishList) {
    const wishObj = {};
    for (let i = 0; i < wishList.length; i++) {
        const wishItem = wishList[i];
        if (validate(wishItem)) {
            const val = wishItem.type === 'checkbox' ? wishItem.checked : wishItem.value.trim();
            wishObj[wishItem.id] = val;
        }
    }
    return wishObj;
}

authorMail.addEventListener('click', function (e) {
    e.preventDefault();

    const email = authorMail.getAttribute('href').replace('mailto:', '');
    copyToClipboard(email);

    authorMail.setAttribute('data-tooltip', messageSuccess);
    setTimeout(() => authorMail.removeAttribute('data-tooltip'), 2000);
});

function copyToClipboard(text) {
    var dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
}
