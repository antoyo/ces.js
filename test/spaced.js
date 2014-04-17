/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Boucher, Antoni <bouanto@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

asyncTest('Spaced CES File', function() {
    expect(22);

    ces.download('test10.ces', function(source) {
        stop();

        var body = document.querySelector('#qunit-fixture');

        var button = document.createElement('button');
        button.id = 'button';
        button.textContent = 'Button';
        body.appendChild(button);

        var button2 = document.createElement('button');
        button2.id = 'button2';
        button2.textContent = 'Disable';
        button2.disabled = true;
        body.appendChild(button2);

        var enableButton = document.createElement('button');
        enableButton.id = 'enableButton';
        enableButton.textContent = 'Enable';
        body.appendChild(enableButton);

        var changeButton = document.createElement('button');
        changeButton.id = 'change';
        changeButton.textContent = 'Change';
        body.appendChild(changeButton);

        var text = document.createElement('p');
        text.id = 'text';
        text.classList.add('backred');
        text.classList.add('big');
        body.appendChild(text);

        var js = ces.ces2js(source, 'test10.ces');
        ces.execute(js);

        equal(button.textContent, 'Button', 'Text is set to "Button".');

        trigger(button, 'click');

        equal(button.textContent, 'Clicked', 'Text is set to "Clicked".');

        equal(button2.disabled, true, 'HTML attribute disabled is set.');

        trigger(enableButton, 'click');

        equal(button2.disabled, false, 'HTML attribute disabled is not set.');

        ok(!text.style.getPropertyValue('color'), 'Property color is not set.');
        equal(text.title, '', 'HTML attribute title is not set.');
        equal(text.getAttribute('data-text'), null, 'HTML attribute data-text is not set.');

        trigger(changeButton, 'click');

        equal(text.classList.length, 3, 'Class list contains 3 elements.');
        ok(text.classList.contains('backred'), 'Class backred is set.');
        ok(text.classList.contains('big'), 'Class big is set.');
        ok(text.classList.contains('italic'), 'Class italic is set.');
        ok(!text.classList.contains('underline'), 'Class underline is not set.');
        equal(text.style.getPropertyValue('color'), 'blue', 'Property color is set to "blue".');
        equal(text.title, 'title', 'HTML attribute title is set to "title".');
        equal(text.getAttribute('data-text'), 'text', 'HTML attribute data-text is set to "text".');

        trigger(changeButton, 'click');

        equal(text.classList.length, 2, 'Class list contains 2 elements.');
        ok(text.classList.contains('backred'), 'Class backred is set.');
        ok(text.classList.contains('big'), 'Class big is set.');
        ok(!text.classList.contains('italic'), 'Class italic is not set.');
        ok(!text.classList.contains('underline'), 'Class underline is not set.');

        start();
    });

    ces.download('test11.ces', function(source) {
        var body = document.querySelector('#qunit-fixture');

        var div = document.createElement('div');
        body.appendChild(div);

        var button = document.createElement('button');
        button.id = 'button';
        button.textContent = 'Button';
        div.appendChild(button);

        var paragraph = document.createElement('p');
        paragraph.id = 'par';
        paragraph.textContent = 'Text';
        div.appendChild(paragraph);

        var js = ces.ces2js(source, 'test11.ces');
        ces.execute(js);

        ok(!paragraph.style.getPropertyValue('color'), 'Color is not set.');

        trigger(document.querySelector('div button#button'), 'click');

        equal(paragraph.style.getPropertyValue('color'), 'blue', 'Color is set to "blue".');

        start();
    });
});
