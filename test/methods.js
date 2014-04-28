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

asyncTest('JS Methods', function() {
    expect(16);

    ces.download('test15.ces', function(source) {
        var body = document.querySelector('#qunit-fixture');
        body.style.setProperty('height', '500px');
        body.style.setProperty('overflow', 'scroll');

        var button = document.createElement('button');
        button.id = 'focus';
        button.textContent = 'Focus';
        body.appendChild(button);

        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.id = 'text-input';
        body.appendChild(input);

        var scroll = document.createElement('button');
        scroll.id = 'scroll';
        scroll.textContent = 'Scroll';
        body.appendChild(scroll);

        var changeSize = document.createElement('button');
        changeSize.id = 'change-size';
        changeSize.style.setProperty('height', '25px');
        changeSize.style.setProperty('width', '100px');
        changeSize.textContent = 'Change Size';
        body.appendChild(changeSize);

        var div = document.createElement('div');
        div.style.setProperty('height', '2000px');
        body.appendChild(div);

        var to = document.createElement('div');
        to.id = 'to';
        to.innerHTML = 'To';
        body.appendChild(to);

        var changeContent = document.createElement('div');
        changeContent.id = 'change-content';
        changeContent.textContent = 'Content';
        body.appendChild(changeContent);

        var changeContent2 = document.createElement('div');
        changeContent2.id = 'change-content2';
        changeContent2.textContent = 'Macro Content';
        body.appendChild(changeContent2);

        ces.addMethod('changeSize', function(selector) {
            selector.style.height = '100px';
            selector.style.width = '200px';

            setTimeout(function() {
                selector.style.height = '25px';
                selector.style.width = '100px';
            }, 100);
        });

        ces.addMethod('content', function(selector, content) {
            selector.textContent = content.substr(1, content.length - 2);
        });

        ces.addMethod('content2', function(selector, content) {
            return selector + '.textContent = ' + content + ';';
        }, true);

        var js = ces.ces2js(source, 'test15.ces');
        ces.execute(js);

        equal(changeContent.textContent, 'Content', 'Content is set to "Content"');

        trigger(changeContent, 'click');

        equal(changeContent.textContent, 'new content', 'Content is set to "new content"');
        ok(js.indexOf('ces.call("content", this') != -1, 'JS contains method call');

        equal(changeContent2.textContent, 'Macro Content', 'Content is set to "Macro Content"');

        trigger(changeContent2, 'click');

        equal(changeContent2.textContent, 'new macro content', 'Content is set to "new macro content"');
        ok(js.indexOf('.textContent = "new macro content";') != -1, 'JS contains the macro.');

        equal(document.activeElement, document.body, 'Focus is not set.');

        trigger(button, 'click');

        equal(document.activeElement, input, 'Focus is set to the input.');

        equal(body.scrollTop, 0, 'Scroll is 0.');

        trigger(scroll, 'click');

        ok(body.scrollTop > 1555, 'Scroll is greater than 1555.');

        body.scrollTop = 0;

        equal(changeSize.style.getPropertyValue('height'), '25px', 'Button height is 25px.')
        equal(changeSize.style.getPropertyValue('width'), '100px', 'Button height is 100px.')

        trigger(changeSize, 'click');

        equal(changeSize.style.getPropertyValue('height'), '100px', 'Button height is 100px.')
        equal(changeSize.style.getPropertyValue('width'), '200px', 'Button height is 200px.')

        setTimeout(function() {
            equal(changeSize.style.getPropertyValue('height'), '25px', 'Button height is 25px.')
            equal(changeSize.style.getPropertyValue('width'), '100px', 'Button height is 100px.')

            start();
        }, 100);
    });
});
