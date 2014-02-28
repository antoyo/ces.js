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
    expect(7);

    ces.download('test3.ces', function(source) {
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
        body.appendChild(text);

        var js = ces.ces2js(source, 'test3.ces');
        ces.execute(js);

        equal(showButton.classList.length, 0, 'Class list is empty.');

        trigger(showButton, 'click');

        equal(showButton.classList.length, 1, 'Class list is not empty.');
        equal(showButton.classList[0], 'blue', 'Class blue is set.');

        trigger(removeButton, 'click');

        equal(showButton.classList.length, 0, 'Class list is empty.');

        trigger(toggleButton, 'click');

        equal(showButton.classList.length, 1, 'Class list is not empty.');
        equal(showButton.classList[0], 'blue', 'Class blue is set.');

        trigger(toggleButton, 'click');

        equal(showButton.classList.length, 0, 'Class list is empty.');

        start();
    });
});
