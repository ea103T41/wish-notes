const submitBtn = document.querySelector(".submit");
const wishList = document.querySelectorAll("[id^='wish']");
const inputs = document.querySelectorAll("input");
const docUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfEyuUcKksS07RsUSrH6ZUd5ZztGzAaNM5hZotbnVmw5Hnl1g/formResponse';
const scriptUrl = 'https://script.google.com/macros/s/AKfycbweNVPPb5DrbmtuBk99-FaqrkT-5mlleF0zbPv9PVqNMcLwjT-s9WAk73XeR_tCFg-i/exec';
const modal = document.querySelector('.modal-container');
const closeBtn = document.querySelectorAll('*[data-close-modal]');

const options = {
    method: 'POST',
    mode: 'cors'
}

const links = [...document.head.getElementsByTagName('link')];
links.forEach((link) => {
    var href = link.getAttribute('href');
    link.setAttribute('href', href + '?v=' + new Date().getTime());
});

inputs.forEach(input => input.addEventListener("input", clearInvalidMsg));
submitBtn.addEventListener('click', submitForm);
closeBtn.forEach(node => {
    node.addEventListener('click', () => {
        fadeOut(modal);
        unblockScroll();
    });
});

function clearInvalidMsg(e) {
    const _input = e.target;
    if (_input.classList.contains("form-invalid")) {
        toggleInvalidMsg(e.target.id);
    }
}

function submitForm(e) {
    e.preventDefault();
    if (hasInvalidInput()) {
        return;
    }
    const wishObj = verifyAndGetWishObj(wishList);

    if (!hasInvalidInput()) {
        sendToGoogle(wishObj);
    }
}

function sendToGoogle(wishObj) {
    const formData = new FormData();
    formData.append('url', docUrl);
    formData.append('formData', convertToFormData(wishObj));

    options.body = formData;
    const req = new Request(scriptUrl, options);
    fetch(req).then((rsp) => {
        // console.log(rsp);
        inputs.forEach(input => input.value = '');
        fadeIn(modal, 'flex');
        blockScroll();

        if (rsp.status === 200) {
            console.log('Sent successfully!');
        }
    }).catch((err) => {
        console.error('Error when fetching', err);
    });
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
            switch (wishItem.id) {
                case 'wish':
                    wishObj.wish = wishItem.value.trim();
                    break;
                case 'wishNumber':
                    wishObj.wishNumber = wishItem.value.trim();
                    break;
                case 'wishBudget':
                    wishObj.wishBudget = wishItem.value.trim();
                    break;
                case 'wisherName':
                    wishObj.wisherName = wishItem.value.trim();
                    break;
                case 'wisherEmail':
                    wishObj.wisherEmail = wishItem.value.trim();
                    break;
                case 'wishCopy':
                    break;
            }
        }
    }
    return wishObj;
}

function validate(input) {
    if (input.classList.contains('is-digit')) {
        if (!isDigit(input)) {
            toggleInvalidMsg(input.id);
            return false;
        }
    }
    if (input.classList.contains('is-email')) {
        if (!isEmail(input)) {
            toggleInvalidMsg(input.id);
            return false;
        }
    }
    if (input.classList.contains('required')) {
        if (input.value.trim() === '') {
            toggleInvalidMsg(input.id);
            return false;
        }
    }
    return true;
}

function isDigit(input) {
    return /^\d+$/.test(input.value);
}

function isEmail(input) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input.value);
}

function toggleInvalidMsg(id) {
    const _itm = document.getElementById(id);
    const _invalidMsg = _itm.parentNode.querySelector('.invalid-feedback');
    const isValid = _itm.classList.contains('form-invalid');
    if (!isValid) {
        _itm.classList.add('form-invalid');
        _invalidMsg.classList.remove('hidden');
    } else {
        _itm.classList.remove('form-invalid');
        _invalidMsg.classList.add('hidden');
    }
}

function hasInvalidInput() {
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].classList.contains('form-invalid')) {
            return true;
        }
    }
    return false;
}

function fadeIn (el, display="inline-block", duration=400) {
    el.style.opacity = el.style.opacity || 0;
    el.style.display = display;
    el.style.visibility = "visible";

    let opacity = parseFloat(el.style.opacity) || 0;
    const timer = setInterval( function() {
        opacity += 20 / duration;
        if( opacity >= 1 ) {
            clearInterval(timer);
            opacity = 1;
        }
        el.style.opacity = opacity;
    }, 20 );
};

function fadeOut(el, duration=400) {
    let opacity = 1;
    const timer = setInterval( function() {
        opacity -= 20 / duration;
        if(opacity <= 0) {
            clearInterval(timer);
            opacity = 0;
            el.style.display = "none";
            el.style.visibility = "hidden";
        }
        el.style.opacity = opacity;
    }, 20);
};

function blockScroll() {
    document.body.style.overflow = 'hidden';
}

function unblockScroll() {
    document.body.style.overflow = null;
}

const mailto = document.querySelector('.mailto');
const msg = document.querySelector('.mailto-message');
const messageSuccess = 'Copied to clipboard!';

mailto.addEventListener('click', function(e) {
    e.preventDefault();

    var email = mailto.getAttribute('href').replace('mailto:', '');
    copyToClipboard(email);

    msg.innerHTML = messageSuccess;
    msg.style.display = 'block';
    setTimeout(function() {
        msg.innerHTML = '';
        msg.style.display = 'none';
    }, 2000);
});

function copyToClipboard(text) {
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute('value', text);
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
}