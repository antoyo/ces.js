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

asyncTest('Parse CES File on Window Load Event', function() {
    expect(8);

    var body = document.querySelector('#qunit-fixture');

    var script = document.createElement('script');
    script.type = 'text/ces';
    script.src = 'test.ces';
    body.appendChild(script);

    var inlineScript = document.createElement('script');
    inlineScript.type = 'text/ces';
    inlineScript.textContent = '#div $click {\n'
        + '    color: green;\n'
        + '}\n';
    body.appendChild(inlineScript);

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

    var div = document.createElement('div');
    div.id = 'div';
    div.textContent = 'Div';
    body.appendChild(div);

    ces.load();

    setTimeout(function() {
        ok(!button.style.getPropertyValue('background-color'), 'Property background-color is not set.');
        ok(!button.style.getPropertyValue('color'), 'Property color is not set.');
        equal(button.textContent, 'Button', 'Text is set to "Button".');

        trigger(button, 'click');

        equal(button.style.getPropertyValue('background-color'), 'blue', 'Property background-color is set to "blue".');
        equal(button.style.getPropertyValue('color'), 'red', 'Property color is set to "red".');
        equal(button.textContent, 'Clicked', 'Text is set to "Clicked".');

        ok(!div.style.getPropertyValue('color'), 'Property color is not set.');

        trigger(div, 'click');

        equal(div.style.getPropertyValue('color'), 'green', 'Property color is set to "green".');

        start();
    }, 100);
});
