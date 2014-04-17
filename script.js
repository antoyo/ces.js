window.addEventListener('load', function() {
    function changeSize(selector) {
        selector.style.height = '100px';
        selector.style.width = '200px';

        setTimeout(function() {
            selector.style.height = '25px';
            selector.style.width = '100px';
        }, 1000);
    }

    ces.addMethod('changeSize', changeSize);
}, false);
