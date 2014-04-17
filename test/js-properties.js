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

asyncTest('JS Properties', function() {
    expect(8);

    ces.download('test.ces', function(source) {
        stop();

        var body = document.querySelector('#qunit-fixture');

        var button = document.createElement('button');
        button.id = 'button';
        button.textContent = 'Button';
        body.appendChild(button);

        var paragraph = document.createElement('p');
        paragraph.id = 'paragraph';
        paragraph.textContent = 'Paragraph';
        body.appendChild(paragraph);

        var showButton = document.createElement('button');
        showButton.id = 'show';
        showButton.textContent = 'Show';
        body.appendChild(showButton);

        var par = document.createElement('p');
        par.id = 'par';
        par.style.display = 'none';
        par.textContent = 'Par';
        body.appendChild(par);

        var js = ces.ces2js(source, 'test.ces');
        ces.execute(js);

        equal(button.textContent, 'Button', 'Text is set to "Button".');

        trigger(button, 'click');

        equal(button.textContent, 'Clicked', 'Text is set to "Clicked".');

        equal(paragraph.innerHTML, 'Paragraph', 'HTML is set to "Paragraph".');

        trigger(paragraph, 'click');

        equal(paragraph.innerHTML, '<strong>Text</strong>', 'HTML is set to "<strong>Text</strong>".');

        start();
    });

    ces.download('test9.ces', function(source) {
        var body = document.querySelector('#qunit-fixture');

        var button3 = document.createElement('button');
        button3.id = 'button3';
        button3.textContent = 'Button';
        body.appendChild(button3);

        var paragraph2 = document.createElement('p');
        paragraph2.id = 'paragraph2';
        paragraph2.innerHTML = 'Text';
        body.appendChild(paragraph2);

        var js = ces.ces2js(source, 'test9.ces');
        ces.execute(js);

        equal(button3.textContent, 'Button', 'Text is set to "Button".');

        trigger(button3, 'click');

        equal(button3.textContent, 'Clicked', 'Text is set to "Clicked".');

        equal(paragraph2.innerHTML, 'Text', 'HTML is set to "Text".');

        trigger(paragraph2, 'click');

        equal(paragraph2.innerHTML, '<em>Text</em>', 'HTML is set to "<em>Text</em>".');

        start();
    });
});
