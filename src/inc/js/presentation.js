document.addEventListener('DOMContentLoaded', function() {
    if (location.hash == "#cast") {
        initCast();
    } else {
        var container = document.createElement('div');
        defaultContent(container);
        document.querySelector('main').classList.add('show');
        document.querySelector('main').insertBefore(container, document.querySelector('main > p').nextSibling);
        document.querySelectorAll('a.cast').forEach(function(elt) {
            elt.onclick = initCast;
        });
    }
});
