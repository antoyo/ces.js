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

asyncTest('this Keyword', function() {
    expect(58);

    ces.download('test16.ces', function(source) {
        stop();

        var body = document.querySelector('#qunit-fixture');

        var div1 = document.createElement('div');
        div1.className = 'inside';
        body.appendChild(div1);

        var color1 = document.createElement('span');
        color1.className = 'color';
        color1.innerHTML = 'Color';
        color1.title = 'Color';
        div1.appendChild(color1);

        var div2 = document.createElement('div');
        div2.className = 'inside';
        body.appendChild(div2);

        var color2 = document.createElement('span');
        color2.className = 'color';
        color2.innerHTML = 'Color';
        color2.title = 'Color';
        div2.appendChild(color2);

        var div3 = document.createElement('div');
        div3.className = 'inside';
        body.appendChild(div3);

        var color3 = document.createElement('span');
        color3.className = 'color';
        color3.innerHTML = 'Color';
        color3.title = 'Color';
        div3.appendChild(color3);

        var js = ces.ces2js(source, 'test16.ces');
        ces.execute(js);

        ok(!color1.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color2.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color3.style.getPropertyValue('color'), 'Property color is not set.');

        trigger(div1, 'click');

        equal(color1.style.getPropertyValue('color'), 'green', 'Property color is set to "green".');
        ok(!color2.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color3.style.getPropertyValue('color'), 'Property color is not set.');

        color1.style.setProperty('color', '');

        ok(!color1.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color2.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color3.style.getPropertyValue('color'), 'Property color is not set.');

        trigger(div2, 'click');

        ok(!color1.style.getPropertyValue('color'), 'Property color is not set.');
        equal(color2.style.getPropertyValue('color'), 'green', 'Property color is set to "green".');
        ok(!color3.style.getPropertyValue('color'), 'Property color is not set.');

        color2.style.setProperty('color', '');

        ok(!color1.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color2.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color3.style.getPropertyValue('color'), 'Property color is not set.');

        trigger(div3, 'click');

        ok(!color1.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color2.style.getPropertyValue('color'), 'Property color is not set.');
        equal(color3.style.getPropertyValue('color'), 'green', 'Property color is set to "green".');

        start();
    });

    ces.download('test17.ces', function(source) {
        stop();

        var body = document.querySelector('#qunit-fixture');

        var div1 = document.createElement('div');
        div1.className = 'inside';
        body.appendChild(div1);

        var color1 = document.createElement('span');
        color1.className = '_color-this';
        color1.setAttribute('data-this', 'this')
        color1.innerHTML = 'Color';
        div1.appendChild(color1);

        var div2 = document.createElement('div');
        div2.className = 'inside';
        body.appendChild(div2);

        var color2 = document.createElement('span');
        color2.className = '_color-this';
        color2.setAttribute('data-this', 'this')
        color2.innerHTML = 'Color';
        div2.appendChild(color2);

        var div3 = document.createElement('div');
        div3.className = 'inside';
        body.appendChild(div3);

        var color3 = document.createElement('span');
        color3.className = '_color-this';
        color3.setAttribute('data-this', 'this')
        color3.innerHTML = 'Color';
        div3.appendChild(color3);

        var setId = document.createElement('div');
        setId.className = 'set-id';
        body.appendChild(setId);

        var links = document.createElement('div');
        links.className = 'links';
        body.appendChild(links);

        var link1 = document.createElement('a');
        link1.href = 'https://github.com';
        links.appendChild(link1);

        var js = ces.ces2js(source, 'test17.ces');
        ces.execute(js);

        ok(!color1.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color2.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color3.style.getPropertyValue('color'), 'Property color is not set.');
        equal(div1.id, '', 'Id is not set.');

        trigger(div1, 'click');

        equal(color1.style.getPropertyValue('color'), 'green', 'Property color is set to "green".');
        ok(!color2.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color3.style.getPropertyValue('color'), 'Property color is not set.');
        equal(div1.id, '', 'Id is not set.');

        color1.style.setProperty('color', '');

        ok(!color1.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color2.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color3.style.getPropertyValue('color'), 'Property color is not set.');
        equal(div2.id, '', 'Id is not set.');

        trigger(div2, 'click');

        ok(!color1.style.getPropertyValue('color'), 'Property color is not set.');
        equal(color2.style.getPropertyValue('color'), 'green', 'Property color is set to "green".');
        ok(!color3.style.getPropertyValue('color'), 'Property color is not set.');
        equal(div2.id, '', 'Id is not set.');

        color2.style.setProperty('color', '');

        ok(!color1.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color2.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color3.style.getPropertyValue('color'), 'Property color is not set.');
        equal(div3.id, '', 'Id is not set.');

        trigger(div3, 'click');

        ok(!color1.style.getPropertyValue('color'), 'Property color is not set.');
        ok(!color2.style.getPropertyValue('color'), 'Property color is not set.');
        equal(color3.style.getPropertyValue('color'), 'green', 'Property color is set to "green".');
        equal(div3.id, '', 'Id is not set.');

        equal(setId.id, '', 'Id is not set.');

        trigger(setId, 'click');

        equal(setId.id, 'new-id', 'Id is set to "new-id".');

        ok(!link1.style.getPropertyValue('color'), 'Property color is not set.');

        trigger(links, 'click');

        equal(link1.style.getPropertyValue('color'), 'red', 'Property color is set to "red".');

        start();
    });

    ces.download('test26.ces', function(source) {
        var body = document.querySelector('#qunit-fixture');

        var div = document.createElement('div');
        body.appendChild(div);

        var div2 = document.createElement('div');
        div.appendChild(div2);

        var div3 = document.createElement('div');
        div2.appendChild(div3);

        var button = document.createElement('button');
        button.className = 'myButton';
        button.textContent = 'Button';
        div3.appendChild(button);

        var js = ces.ces2js(source, 'test26.ces');
        ces.execute(js);

        ok(!div.style.getPropertyValue('background-color'), 'Property background-color is not set.');
        ok(!div2.style.getPropertyValue('background-color'), 'Property background-color is not set.');
        ok(!div3.style.getPropertyValue('background-color'), 'Property background-color is not set.');
        equal(div.id, '', 'Id is not set.');
        equal(div2.id, '', 'Id is not set.');
        equal(div3.id, '', 'Id is not set.');

        trigger(button, 'click');

        equal(div.style.getPropertyValue('background-color'), 'red', 'Property background-color is set to "red".');
        ok(!div2.style.getPropertyValue('background-color'), 'Property background-color is not set.');
        equal(div3.style.getPropertyValue('background-color'), 'green', 'Property background-color is set to "green".');
        equal(div.id, '', 'Id is not set.');
        equal(div2.id, '', 'Id is not set.');
        equal(div3.id, '', 'Id is not set.');

        start();
    });
});
