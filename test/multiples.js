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

asyncTest('Multiple Elements Selector', function() {
    expect(24);

    ces.download('test13.ces', function(source) {
        var body = document.querySelector('#qunit-fixture');

        var button = document.createElement('button');
        button.id = 'button';
        button.textContent = 'Button';
        body.appendChild(button);

        var button2 = document.createElement('button');
        button2.id = 'button2';
        button2.textContent = 'Button2';
        body.appendChild(button2);

        var button3 = document.createElement('button');
        button3.id = 'button3';
        button3.textContent = 'Button3';
        body.appendChild(button3);

        var allButton = document.createElement('button');
        allButton.id = 'allButton';
        allButton.textContent = 'All Buttons';
        body.appendChild(allButton);

        var js = ces.ces2js(source, 'test13.ces');
        ces.execute(js);

        ok(!button.style.getPropertyValue('color'), 'Color is not set.');
        ok(!button2.style.getPropertyValue('color'), 'Color is not set.');
        ok(!button3.style.getPropertyValue('color'), 'Color is not set.');

        trigger(button, 'click');

        equal(button.style.getPropertyValue('color'), 'blue', 'Color is set to "blue".');
        ok(!button2.style.getPropertyValue('color'), 'Color is not set.');
        ok(!button3.style.getPropertyValue('color'), 'Color is not set.');

        button.style.setProperty('color', '');

        ok(!button.style.getPropertyValue('color'), 'Color is not set.');
        ok(!button2.style.getPropertyValue('color'), 'Color is not set.');
        ok(!button3.style.getPropertyValue('color'), 'Color is not set.');

        trigger(button2, 'click');

        ok(!button.style.getPropertyValue('color'), 'Color is not set.');
        equal(button2.style.getPropertyValue('color'), 'blue', 'Color is set to "blue".');
        ok(!button3.style.getPropertyValue('color'), 'Color is not set.');

        button2.style.setProperty('color', '');

        ok(!button.style.getPropertyValue('color'), 'Color is not set.');
        ok(!button2.style.getPropertyValue('color'), 'Color is not set.');
        ok(!button3.style.getPropertyValue('color'), 'Color is not set.');

        trigger(button3, 'click');

        ok(!button.style.getPropertyValue('color'), 'Color is not set.');
        ok(!button2.style.getPropertyValue('color'), 'Color is not set.');
        equal(button3.style.getPropertyValue('color'), 'blue', 'Color is set to "blue".');

        button3.style.setProperty('color', '');

        ok(!button.style.getPropertyValue('color'), 'Color is not set.');
        ok(!button2.style.getPropertyValue('color'), 'Color is not set.');
        ok(!button3.style.getPropertyValue('color'), 'Color is not set.');

        trigger(allButton, 'click');

        equal(button.style.getPropertyValue('color'), 'red', 'Color is set to "red".');
        equal(button2.style.getPropertyValue('color'), 'red', 'Color is set to "red".');
        equal(button3.style.getPropertyValue('color'), 'red', 'Color is set to "red".');

        start();
    });
});
