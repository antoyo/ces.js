/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Boucher, Antoni <bouanto@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

asyncTest('Event and CSS Selector', function() {
    expect(8);

    ces.download('test8.ces', function(source) {
        stop();

        var body = document.querySelector('#qunit-fixture');

        var button = document.createElement('button');
        button.id = 'button';
        button.textContent = 'Button';
        button.title = 'Button';
        body.appendChild(button);

        var js = ces.ces2js(source, 'test8.ces');
        ces.execute(js);

        equal(button.textContent, 'Button', 'Text is "Button".');
        equal(button.getAttribute('title'), 'Button', 'Title is "Button".');

        trigger(button, 'click');

        equal(button.textContent, 'Clicked', 'Text is "Clicked".');
        equal(button.getAttribute('title'), 'Quote " here.', 'Title is "Quote " here.".');

        start();
    });

    ces.download('test12.ces', function(source) {
        var body = document.querySelector('#qunit-fixture');

        var button4 = document.createElement('button');
        button4.id = 'button4';
        button4.textContent = 'Button4';
        button4.title = '{$}';
        body.appendChild(button4);

        var js = ces.ces2js(source, 'test12.ces');
        ces.execute(js);
        
        equal(button4.textContent, 'Button4', 'Text is "Button4".');
        equal(button4.getAttribute('title'), '{$}', 'Title is "{$}".');

        trigger(button4, 'click');

        equal(button4.textContent, 'Clicked4', 'Text is "Clicked4".');
        equal(button4.getAttribute('title'), 'test', 'Title is "test".');

        start();
    });
});
