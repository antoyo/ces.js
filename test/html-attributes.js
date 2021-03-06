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

asyncTest('HTML Attributes', function() {
    expect(9);

    ces.download('test2.ces', function(source) {
        stop();

        var body = document.querySelector('#qunit-fixture');

        var button2 = document.createElement('button');
        button2.id = 'button2';
        button2.textContent = 'Disable';
        body.appendChild(button2);

        var enableButton = document.createElement('button');
        enableButton.id = 'enableButton';
        enableButton.textContent = 'Enable';
        body.appendChild(enableButton);

        var textInput = document.createElement('input');
        textInput.id = 'textInput';
        body.appendChild(textInput);

        var js = ces.ces2js(source, 'test2.ces');
        ces.execute(js);

        equal(button2.disabled, false, 'HTML attribute disabled is not set.');

        trigger(button2, 'click');

        equal(button2.disabled, true, 'HTML attribute disabled is set.');

        trigger(enableButton, 'click');

        equal(button2.disabled, false, 'HTML attribute disabled is not set.');

        equal(textInput.placeholder, '', 'HTML attribute placeholder is empty.');

        trigger(textInput, 'focus');

        equal(textInput.placeholder, 'Placeholder', 'HTML attribute placeholder is set to "Placeholder".');

        trigger(textInput, 'blur');

        equal(textInput.placeholder, '', 'HTML attribute placeholder is empty.');

        start();
    });

    ces.download('test5.ces', function(source) {
        var body = document.querySelector('#qunit-fixture');

        var checkButton = document.createElement('button');
        checkButton.id = 'check';
        checkButton.textContent = 'Check';
        body.appendChild(checkButton);

        var uncheckButton = document.createElement('button');
        uncheckButton.id = 'uncheck';
        uncheckButton.textContent = 'Uncheck';
        body.appendChild(uncheckButton);

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'checkbox';
        body.appendChild(checkbox);

        var js = ces.ces2js(source, 'test5.ces');
        ces.execute(js);

        ok(!checkbox.checked, 'Checkbox is not checked.');

        trigger(checkButton, 'click');

        ok(checkbox.checked, 'Checkbox is checked.');

        trigger(uncheckButton, 'click');

        ok(!checkbox.checked, 'Checkbox is not checked.');

        start();
    });
});
