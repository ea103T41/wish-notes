function blockScroll() {
    document.body.style.overflow = 'hidden';
}

function unblockScroll() {
    document.body.style.overflow = null;
}

function fadeIn (el, display='inline-block', duration=400) {
    el.style.opacity = el.style.opacity || 0;
    el.style.display = display;
    el.style.visibility = 'visible';

    let opacity = parseFloat(el.style.opacity) || 0;
    const timer = setInterval( function() {
        opacity += 20 / duration;
        if (opacity >= 1) {
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
            el.style.display = 'none';
            el.style.visibility = 'hidden';
        }
        el.style.opacity = opacity;
    }, 20);
};

function showLoader(loader) {
  loader.classList.add('active');
}

function hideLoader(loader) {
  loader.classList.remove('active');
}

export {
    blockScroll, unblockScroll, fadeIn, fadeOut, showLoader, hideLoader
}