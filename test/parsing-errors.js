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

asyncTest('Parsing Errors', function() {
    expect(13);

    ces.download('error.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error.ces');
        }, 'error.ces:2: Unexpected `{`, expecting `$event` on line 2.', 'Missing event token.');

        start();
    });

    ces.download('error2.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error2.ces');
        }, 'error2.ces:2: Unexpected `}`, expecting `event selector` on line 2.', 'Unexpected } token.');

        start();
    });

    ces.download('error3.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error3.ces');
        }, 'error3.ces:2: Unexpected `=`, expecting `property name:` on line 2.', 'Unexpected = token.');

        start();
    });

    ces.download('error4.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error4.ces');
        }, 'error4.ces:2: Unexpected `test`, expecting `"attribute value"` on line 2.', 'Missing " around attribute value.');

        start();
    });

    ces.download('error5.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error5.ces');
        }, 'error5.ces:2: Unexpected `]`, expecting `" (quote)` on line 2.', 'Missing " at the end of attribute value.');

        start();
    });

    ces.download('error6.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error6.ces');
        }, 'error6.ces:2: Unexpected `]`, expecting `property value;` on line 2.', 'Unexpected ] token.');

        start();
    });

    ces.download('error7.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error7.ces');
        }, 'error7.ces:2: Unexpected `+`, expecting `="attribute value"` on line 2.', 'Unexpected + token.');

        start();
    });

    ces.download('error8.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error8.ces');
        }, 'error8.ces:1: Unexpected `!`, expecting `$event` on line 1.', 'Unexpected ! token.');

        start();
    });

    ces.download('error9.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error9.ces');
        }, 'error9.ces:2: Unexpected `=`, expecting `]` on line 2.', 'Unexpected = token after attribute value.');

        start();
    });

    ces.download('error10.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error10.ces');
        }, 'error10.ces:2: Unexpected `=`, expecting `attribute name` on line 2.', 'Unexpected = token after attribute name.');

        start();
    });

    ces.download('error11.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error11.ces');
        }, 'error11.ces:2: Unexpected `-`, expecting `]` on line 2.', 'Unexpected - token after attribute name.');

        start();
    });

    ces.download('error12.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error12.ces');
        }, 'error12.ces:2: Unexpected `-`, expecting `="attribute value"` on line 2.', 'Unexpected - token before attribute value.');

        start();
    });

    ces.download('error13.ces', function(source) {
        //stop();

        throws(function() {
            ces.ces2js(source, 'error13.ces');
        }, 'error13.ces:1: Unexpected `-`, expecting `css selector` on line 1.', 'Unexpected - token before css selector.');

        start();
    });
});
