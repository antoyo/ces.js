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

asyncTest('Increment and Decrement CSS Values', function() {
    expect(15);

    ces.download('test19.ces', function(source) {
        var body = document.querySelector('#qunit-fixture');

        var incrementButton = document.createElement('button');
        incrementButton.id = 'increment-size';
        incrementButton.textContent = 'Increment';
        body.appendChild(incrementButton);

        var decrementButton = document.createElement('button');
        decrementButton.id = 'decrement-size';
        decrementButton.textContent = 'Decrement';
        body.appendChild(decrementButton);

        var div = document.createElement('div');
        div.id = 'increment-div';
        div.textContent = 'Div';
        div.style.setProperty('border', '1px solid black');
        div.style.setProperty('width', '100px');
        body.appendChild(div);

        var multipleIncrement = document.createElement('div');
        multipleIncrement.id = 'multiple-increment';
        multipleIncrement.textContent = 'Multiple Increment';
        multipleIncrement.style.setProperty('width', '100px');
        body.appendChild(multipleIncrement);

        var js = ces.ces2js(source, 'test19.ces');
        ces.execute(js);

        equal(div.style.getPropertyValue('border-bottom-width'), '1px', 'Border Bottom Width is set to "1px".');
        equal(div.style.getPropertyValue('width'), '100px', 'Width is set to "100px".');

        trigger(incrementButton, 'click');

        equal(div.style.getPropertyValue('border-bottom-width'), '2px', 'Border Bottom Width is set to "2px".');
        equal(div.style.getPropertyValue('width'), '110px', 'Width is set to "110px".');

        trigger(incrementButton, 'click');

        equal(div.style.getPropertyValue('border-bottom-width'), '3px', 'Border Bottom Width is set to "3px".');
        equal(div.style.getPropertyValue('width'), '120px', 'Width is set to "120px".');

        trigger(decrementButton, 'click');

        equal(div.style.getPropertyValue('border-bottom-width'), '2px', 'Border Bottom Width is set to "2px".');
        equal(div.style.getPropertyValue('width'), '110px', 'Width is set to "110px".');

        trigger(decrementButton, 'click');

        equal(div.style.getPropertyValue('border-bottom-width'), '1px', 'Border Bottom Width is set to "1px".');
        equal(div.style.getPropertyValue('width'), '100px', 'Width is set to "100px".');

        trigger(decrementButton, 'click');

        equal(div.style.getPropertyValue('border-bottom-width'), '0px', 'Border Bottom Width is set to "0px".');
        equal(div.style.getPropertyValue('width'), '90px', 'Width is set to "90px".');

        equal(multipleIncrement.style.getPropertyValue('width'), '100px', 'Width is set to "100px".');

        trigger(multipleIncrement, 'click');

        equal(multipleIncrement.style.getPropertyValue('width'), '125px', 'Width is set to "125px".');

        trigger(multipleIncrement, 'click');

        equal(multipleIncrement.style.getPropertyValue('width'), '150px', 'Width is set to "150px".');

        start();
    });
});
