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

asyncTest('CSS Classes', function() {
    expect(56);

    ces.download('test3.ces', function(source) {
        stop();

        var body = document.querySelector('#qunit-fixture');

        var showButton = document.createElement('button');
        showButton.id = 'show';
        showButton.textContent = 'Show';
        body.appendChild(showButton);

        var removeButton = document.createElement('button');
        removeButton.id = 'remove';
        removeButton.textContent = 'Remove';
        body.appendChild(removeButton);

        var toggleButton = document.createElement('button');
        toggleButton.id = 'toggle';
        toggleButton.textContent = 'Toggle';
        body.appendChild(toggleButton);

        var addButton = document.createElement('button');
        addButton.id = 'add';
        addButton.textContent = 'Add';
        body.appendChild(addButton);

        var changeButton = document.createElement('button');
        changeButton.id = 'change';
        changeButton.textContent = 'Change';
        body.appendChild(changeButton);

        var text = document.createElement('p');
        text.id = 'text';
        text.classList.add('backred');
        text.classList.add('big');
        body.appendChild(text);

        var js = ces.ces2js(source, 'test3.ces');
        ces.execute(js);

        equal(showButton.classList.length, 0, 'Class list is empty.');
        ok(!showButton.classList.contains('blue'), 'Class blue is not set.');

        trigger(showButton, 'click');

        equal(showButton.classList.length, 1, 'Class list contains 1 element.');
        ok(showButton.classList.contains('blue'), 'Class blue is set.');

        trigger(removeButton, 'click');

        equal(showButton.classList.length, 0, 'Class list is empty.');
        ok(!showButton.classList.contains('blue'), 'Class blue is not set.');

        trigger(toggleButton, 'click');

        equal(showButton.classList.length, 1, 'Class list contains 1 element.');
        ok(showButton.classList.contains('blue'), 'Class blue is set.');

        trigger(toggleButton, 'click');

        equal(showButton.classList.length, 0, 'Class list is empty.');
        ok(!showButton.classList.contains('blue'), 'Class blue is not set.');

        equal(text.classList.length, 2, 'Class list contains 2 elements.');
        ok(text.classList.contains('backred'), 'Class backred is set.');
        ok(text.classList.contains('big'), 'Class big is set.');
        ok(!text.classList.contains('underline'), 'Class underline is not set.');

        trigger(addButton, 'click');

        equal(text.classList.length, 1, 'Class list contains 1 element.');
        ok(!text.classList.contains('backred'), 'Class backred is not set.');
        ok(!text.classList.contains('big'), 'Class big is not set.');
        ok(text.classList.contains('underline'), 'Class underline is set.');

        trigger(changeButton, 'click');

        equal(text.classList.length, 3, 'Class list contains 3 elements.');
        ok(text.classList.contains('backred'), 'Class backred is set.');
        ok(text.classList.contains('big'), 'Class big is set.');
        ok(text.classList.contains('italic'), 'Class italic is set.');
        ok(!text.classList.contains('underline'), 'Class underline is not set.');

        trigger(changeButton, 'click');

        equal(text.classList.length, 2, 'Class list contains 2 elements.');
        ok(text.classList.contains('backred'), 'Class backred is set.');
        ok(text.classList.contains('big'), 'Class big is set.');
        ok(!text.classList.contains('italic'), 'Class italic is not set.');
        ok(!text.classList.contains('underline'), 'Class underline is not set.');

        start();
    });

    ces.download('test9.ces', function(source) {
        var body = document.querySelector('#qunit-fixture');

        var button3 = document.createElement('button');
        button3.id = 'button3';
        button3.textContent = 'Button';
        button3.classList.add('red');
        button3.classList.add('+plus');
        button3.classList.add('!minus');
        body.appendChild(button3);

        var paragraph2 = document.createElement('p');
        paragraph2.id = 'paragraph2';
        paragraph2.innerHTML = 'Text';
        body.appendChild(paragraph2);

        var js = ces.ces2js(source, 'test9.ces');
        ces.execute(js);

        ok(button3.classList.contains('red'), 'Class red is set.');
        ok(!button3.classList.contains('blue'), 'Class blue is not set.');
        ok(!button3.classList.contains('yellow'), 'Class yellow is not set.');
        ok(!button3.classList.contains('green'), 'Class green is not set.');
        ok(!button3.classList.contains('my_class'), 'Class my_class is not set.');
        ok(!button3.classList.contains('-minus'), 'Class -minus is not set.');
        ok(button3.classList.contains('+plus'), 'Class +plus is set.');
        ok(button3.classList.contains('!minus'), 'Class !minus is set.');
        ok(!button3.classList.contains('!plus'), 'Class !plus is not set.');
        ok(!button3.classList.contains('-toggle'), 'Class -toggle is not set.');
        ok(!button3.classList.contains('+toggle'), 'Class +toggle is not set.');

        trigger(button3, 'click');

        ok(!button3.classList.contains('red'), 'Class red is not set.');
        ok(!button3.classList.contains('blue'), 'Class blue is not set.');
        ok(button3.classList.contains('yellow'), 'Class yellow is set.');
        ok(!button3.classList.contains('green'), 'Class green is not set.');
        ok(button3.classList.contains('my_class'), 'Class my_class is set.');
        ok(button3.classList.contains('-minus'), 'Class -minus is set.');
        ok(!button3.classList.contains('+plus'), 'Class +plus is not set.');
        ok(!button3.classList.contains('!minus'), 'Class !minus is not set.');
        ok(button3.classList.contains('!plus'), 'Class !plus is set.');
        ok(button3.classList.contains('-toggle'), 'Class -toggle is set.');
        ok(button3.classList.contains('+toggle'), 'Class +toggle is set.');

        trigger(button3, 'click');

        ok(button3.classList.contains('-minus'), 'Class -minus is set.');
        ok(!button3.classList.contains('+plus'), 'Class +plus is not set.');
        ok(!button3.classList.contains('!minus'), 'Class !minus is not set.');
        ok(button3.classList.contains('!plus'), 'Class !plus is set.');
        ok(!button3.classList.contains('-toggle'), 'Class -toggle is not set.');
        ok(!button3.classList.contains('+toggle'), 'Class +toggle is not set.');

        start();
    });
});
