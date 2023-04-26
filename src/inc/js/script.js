const displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio: false
};

async function startCapture(elt) {
    try {
        elt.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    } catch (err) {
        console.error(err);
    }
}

function stopCapture(elt) {
    if (elt.srcObject) {
        let tracks = elt.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        elt.srcObject = null;
    }
}

function createBtn(elt, cls, txt) {
    const btn = document.createElement('button');
    btn.classList.add(cls);
    btn.appendChild(document.createTextNode(txt));
    elt.appendChild(btn);
    return btn;
}

function defaultContent(elt) {
    const video = document.createElement('video');
    video.setAttribute('autoplay', 'autoplay');
    elt.appendChild(video);

    const btnStart = createBtn(elt, 'start', '▶');
    const btnStop = createBtn(elt, 'stop', '■');
    const btnClose = createBtn(elt, 'close', '⨯');
    const btnMain = createBtn(elt, 'main', '⛶');
    const btnFullscreen = createBtn(elt, 'fullscreen', '🗖');
    const btnColFirst = createBtn(elt, 'col-first', '+');
    const btnColSecond = createBtn(elt, 'col-second', '+');
    const btnRowFirst = createBtn(elt, 'row-first', '+');
    const btnRowSecond = createBtn(elt, 'row-second', '+');
    elt.classList.add('container');
    btnStart.addEventListener("click", (evt) => {
        btnStart.classList.add('playing');
        btnStop.classList.add('playing');
        startCapture(video);
    }, false);
    btnStop.addEventListener("click", (evt) => {
        btnStop.classList.remove('playing');
        btnStart.classList.remove('playing');
        stopCapture(video);
    }, false);  
    btnClose.addEventListener("click", (evt) => {
        if (elt.parentNode != document.body) {
            btnStop.classList.remove('playing');
            btnStart.classList.remove('playing');
            stopCapture(video);
            const index = Array.prototype.indexOf.call(elt.parentNode.children, elt);
            elt.parentNode.parentNode.replaceChild(elt.parentNode.children[2-index], elt.parentNode);
        } else {
            if (location.hash.length > 0) {
                location.href = location.href.slice(0, -location.hash.length);
            }
        }
    }, false);
    btnFullscreen.addEventListener("click", (evt) => {
        if (!document.fullscreenElement) {
            document.body.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }, false);
    btnMain.addEventListener("click", (evt) => {
        if (!document.fullscreenElement) {
            elt.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }, false);
    btnColFirst.addEventListener("click", (evt) => {
        createSplit(elt, 'col', 'first');
    }, false);
    btnColSecond.addEventListener("click", (evt) => {
        createSplit(elt, 'col', 'second');
    }, false);
    btnRowFirst.addEventListener("click", (evt) => {
        createSplit(elt, 'row', 'first');
    }, false);
    btnRowSecond.addEventListener("click", (evt) => {
        createSplit(elt, 'row', 'second');
    }, false);
}

function createSplit(elt, dir, pos = 'first') {
    const div = document.createElement('div');
    elt.parentNode.replaceChild(div, elt);
    const gutter = document.createElement('div');
    const div1 = (pos == 'first') ? elt : document.createElement('div');
    const div2 = (pos == 'first') ? document.createElement('div') : elt;
    if (pos == 'first') {
        defaultContent(div2);
    } else {
        defaultContent(div1);
    }
    div.classList.add('container');
    gutter.classList.add('gutter-'+dir);
    div.classList.add('grid');
    div.classList.add('grid-'+dir);
    if (dir == 'col') {
        div.setAttribute('style', 'grid-template-columns: 1fr 12px 1fr;');
    } else {
        div.setAttribute('style', 'grid-template-rows: 1fr 12px 1fr;');
    }
    const elts = [div1, gutter, div2];
    elts.forEach((i) => div.appendChild(i));
    const opts = {};
    opts[(dir=='col')?'columnGutters':'rowGutters'] = [{
        track: 1,
        element: gutter
    }];
    const split = Split(opts);
}

function initCast() {
    const container = document.createElement('div');
    defaultContent(container);
    document.body.innerHTML = "";
    document.body.appendChild(container);
}
