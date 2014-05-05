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

asyncTest('Dom Ready Event', function() {
    expect(4);

    ces.download('test18.ces', function(source) {
        var body = document.querySelector('#qunit-fixture');

        var secret = document.createElement('div');
        secret.className = 'secret';
        body.appendChild(secret);

        var secretToggle = document.createElement('div');
        secretToggle.className = 'secret-toggle';
        secret.appendChild(secretToggle);

        var secretText = document.createElement('div');
        secretText.className = 'secret-text';
        secret.appendChild(secretText);

        var readyText = document.createElement('div');
        readyText.className = 'ready-text';
        body.appendChild(readyText);

        var js = ces.ces2js(source, 'test18.ces');

        ok(!secretText.classList.contains('hidden'), 'Does not contain class "hidden".');

        equal(readyText.textContent, '', 'Text is set to "".');

        ces.execute(js);

        ok(secretText.classList.contains('hidden'), 'Contain class "hidden".');

        equal(readyText.textContent, 'Ready', 'Text is set to "Ready".');

        start();
    });
});
