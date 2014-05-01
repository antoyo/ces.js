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

asyncTest('Conditions', function() {
    expect(69);

    ces.download('test22.ces', function(source) {
        stop();

        var body = document.querySelector('#qunit-fixture');

        var button = document.createElement('button');
        button.classList.add('red');
        button.id = 'toggleButton';
        button.style.setProperty('color', 'red');
        button.textContent = 'Button';
        body.appendChild(button);

        var js = ces.ces2js(source, 'test22.ces');
        ces.execute(js);

        equal(button.style.getPropertyValue('color'), 'red', 'Color is set to "red".');
        ok(button.classList.contains('red'), 'Class red is set.');
        ok(!button.classList.contains('blue'), 'Class blue is not set.');

        trigger(button, 'click');

        equal(button.style.getPropertyValue('color'), 'blue', 'Color is set to "blue".');
        ok(!button.classList.contains('red'), 'Class red is not set.');
        ok(button.classList.contains('blue'), 'Class blue is set.');

        trigger(button, 'click');

        equal(button.style.getPropertyValue('color'), 'red', 'Color is set to "red".');
        ok(button.classList.contains('red'), 'Class red is set.');
        ok(!button.classList.contains('blue'), 'Class blue is not set.');

        trigger(button, 'click');

        equal(button.style.getPropertyValue('color'), 'blue', 'Color is set to "blue".');
        ok(!button.classList.contains('red'), 'Class red is not set.');
        ok(button.classList.contains('blue'), 'Class blue is set.');

        start();
    });

    ces.download('test23.ces', function(source) {
        stop();

        var body = document.querySelector('#qunit-fixture');

        var button = document.createElement('button');
        button.classList.add('button');
        button.classList.add('red');
        button.id = 'toggleButton';
        button.style.setProperty('color', 'red');
        button.textContent = 'Button';
        body.appendChild(button);

        var js = ces.ces2js(source, 'test23.ces');
        ces.execute(js);

        equal(button.style.getPropertyValue('color'), 'red', 'Color is set to "red".');
        ok(button.classList.contains('red'), 'Class red is set.');
        ok(!button.classList.contains('blue'), 'Class blue is not set.');

        trigger(button, 'click');

        equal(button.style.getPropertyValue('color'), 'blue', 'Color is set to "blue".');
        ok(!button.classList.contains('red'), 'Class red is not set.');
        ok(button.classList.contains('blue'), 'Class blue is set.');

        trigger(button, 'click');

        equal(button.style.getPropertyValue('color'), 'red', 'Color is set to "red".');
        ok(button.classList.contains('red'), 'Class red is set.');
        ok(!button.classList.contains('blue'), 'Class blue is not set.');

        trigger(button, 'click');

        equal(button.style.getPropertyValue('color'), 'blue', 'Color is set to "blue".');
        ok(!button.classList.contains('red'), 'Class red is not set.');
        ok(button.classList.contains('blue'), 'Class blue is set.');

        start();
    });

    ces.download('test24.ces', function(source) {
        stop();

        var body = document.querySelector('#qunit-fixture');

        var button = document.createElement('button');
        button.classList.add('red');
        button.style.setProperty('color', 'red');
        button.textContent = 'Button';
        body.appendChild(button);

        var button2 = document.createElement('button');
        button2.classList.add('blue');
        button2.style.setProperty('color', 'blue');
        button2.textContent = 'Button 2';
        body.appendChild(button2);

        var js = ces.ces2js(source, 'test24.ces');
        ces.execute(js);

        equal(button.style.getPropertyValue('color'), 'red', 'Color is set to "red".');
        ok(button.classList.contains('red'), 'Class red is set.');
        ok(!button.classList.contains('blue'), 'Class blue is not set.');

        trigger(button, 'click');

        equal(button.style.getPropertyValue('color'), 'blue', 'Color is set to "blue".');
        ok(!button.classList.contains('red'), 'Class red is not set.');
        ok(button.classList.contains('blue'), 'Class blue is set.');

        trigger(button, 'click');

        equal(button.style.getPropertyValue('color'), 'red', 'Color is set to "red".');
        ok(button.classList.contains('red'), 'Class red is set.');
        ok(!button.classList.contains('blue'), 'Class blue is not set.');

        trigger(button, 'click');

        equal(button.style.getPropertyValue('color'), 'blue', 'Color is set to "blue".');
        ok(!button.classList.contains('red'), 'Class red is not set.');
        ok(button.classList.contains('blue'), 'Class blue is set.');

        equal(button2.style.getPropertyValue('color'), 'blue', 'Color is set to "blue".');
        ok(!button2.classList.contains('red'), 'Class red is not set.');
        ok(button2.classList.contains('blue'), 'Class blue is set.');

        trigger(button2, 'click');

        equal(button2.style.getPropertyValue('color'), 'red', 'Color is set to "red".');
        ok(button2.classList.contains('red'), 'Class red is set.');
        ok(!button2.classList.contains('blue'), 'Class blue is not set.');

        trigger(button2, 'click');

        equal(button2.style.getPropertyValue('color'), 'blue', 'Color is set to "blue".');
        ok(!button2.classList.contains('red'), 'Class red is not set.');
        ok(button2.classList.contains('blue'), 'Class blue is set.');

        trigger(button2, 'click');

        equal(button2.style.getPropertyValue('color'), 'red', 'Color is set to "red".');
        ok(button2.classList.contains('red'), 'Class red is set.');
        ok(!button2.classList.contains('blue'), 'Class blue is not set.');

        start();
    });

    ces.download('test25.ces', function(source) {
        var body = document.querySelector('#qunit-fixture');

        var button = document.createElement('button');
        button.classList.add('button');
        button.classList.add('red');
        button.style.setProperty('color', 'red');
        button.textContent = 'Button';
        body.appendChild(button);

        var button2 = document.createElement('button');
        button2.classList.add('button');
        button2.textContent = 'Button 2';
        body.appendChild(button2);

        var js = ces.ces2js(source, 'test25.ces');
        ces.execute(js);

        equal(button.style.getPropertyValue('color'), 'red', 'Color is set to "red".');
        ok(button.classList.contains('red'), 'Class red is set.');
        ok(!button.classList.contains('blue'), 'Class blue is not set.');

        trigger(button, 'click');

        equal(button.style.getPropertyValue('color'), 'blue', 'Color is set to "blue".');
        ok(!button.classList.contains('red'), 'Class red is not set.');
        ok(button.classList.contains('blue'), 'Class blue is set.');

        trigger(button, 'click');

        equal(button.style.getPropertyValue('color'), 'red', 'Color is set to "red".');
        ok(button.classList.contains('red'), 'Class red is set.');
        ok(!button.classList.contains('blue'), 'Class blue is not set.');

        trigger(button, 'click');

        equal(button.style.getPropertyValue('color'), 'blue', 'Color is set to "blue".');
        ok(!button.classList.contains('red'), 'Class red is not set.');
        ok(button.classList.contains('blue'), 'Class blue is set.');

        ok(!button2.style.getPropertyValue('color'), 'Color is not set.');
        ok(!button2.classList.contains('red'), 'Class red is not set.');
        ok(!button2.classList.contains('blue'), 'Class blue is not set.');

        trigger(button2, 'click');

        equal(button2.style.getPropertyValue('color'), 'yellow', 'Color is set to "yellow".');
        ok(!button2.classList.contains('red'), 'Class red is not set.');
        ok(!button2.classList.contains('blue'), 'Class blue is not set.');

        trigger(button2, 'click');

        equal(button2.style.getPropertyValue('color'), 'yellow', 'Color is set to "yellow".');
        ok(!button2.classList.contains('red'), 'Class red is not set.');
        ok(!button2.classList.contains('blue'), 'Class blue is not set.');

        start();
    });
});
