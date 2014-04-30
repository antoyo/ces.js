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
    expect(19);

    ces.download('error.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error.ces');
        }, 'error.ces:4:1: Unexpected `{`, expecting `$event` on line 4.\n' +
            'error.ces:8:15: Unexpected `{`, expecting `$event` on line 8.\n' + 
            'error.ces:10:1: Unexpected `EOF`, expecting `}` on line 10.', 'Missing event and } tokens.');

        start();
    });

    ces.download('error2.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error2.ces');
        }, 'error2.ces:2:1: Unexpected `}`, expecting `event selector` on line 2.', 'Unexpected } token.');

        start();
    });

    ces.download('error3.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error3.ces');
        }, 'error3.ces:2:10: Unexpected `=`, expecting `:` on line 2.\n' +
            'error3.ces:6:1: Unexpected `EOF`, expecting `$event` on line 6.', 'Unexpected = and $event tokens.');

        start();
    });

    ces.download('error4.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error4.ces');
        }, 'error4.ces:2:12: Unexpected `test`, expecting `"attribute value"` on line 2.\n' +
            'error4.ces:5:22: Unexpected `}`, expecting `{` on line 5.', 'Missing " around attribute value and unexpected } token.');

        start();
    });

    ces.download('error5.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error5.ces');
        }, 'error5.ces:2:19: Unexpected `end of line`, expecting `" (quote)` on line 2.\n' +
            'error5.ces:3:14: Unexpected `=`, expecting `:` on line 3.\n' +
            'error5.ces:6:14: Unexpected `=`, expecting `:` on line 6.\n' +
            'error5.ces:7:14: Unexpected `=`, expecting `:` on line 7.\n' +
            'error5.ces:8:1: Unexpected `}`, expecting `;` on line 8.', 'Missing " at the end of attribute value, ; after property value and unexpected = token.');

        start();
    });

    ces.download('error6.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error6.ces');
        }, 'error6.ces:2:22: Unexpected `]`, expecting `;` on line 2.\n' +
            'error6.ces:3:22: Unexpected `[`, expecting `;` on line 3.\n' +
            'error6.ces:4:22: Unexpected `{`, expecting `;` on line 4.\n' +
            'error6.ces:5:22: Unexpected `}`, expecting `;` on line 5.', 'Unexpected ]/[/}/{ token.');

        start();
    });

    ces.download('error7.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error7.ces');
        }, 'error7.ces:2:12: Unexpected `+`, expecting `"attribute value"` on line 2.\n' +
            'error7.ces:6:14: Unexpected `=`, expecting `:` on line 6.\n' +
            'error7.ces:7:1: Unexpected `EOF`, expecting `;` on line 7.', 'Unexpected + and = tokens and missing ;.');

        start();
    });

    ces.download('error8.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error8.ces');
        }, 'error8.ces:1:11: Unexpected `!`, expecting `$event` on line 1.\n' +
            'error8.ces:5:9: Unexpected `}`, expecting `$event` on line 5.', 'Unexpected ! and } token before event.');

        start();
    });

    ces.download('error9.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error9.ces');
        }, 'error9.ces:2:18: Unexpected `=`, expecting `]` on line 2.\n' +
            'error9.ces:3:10: Unexpected `[`, expecting `=` on line 3.\n' +
            'error9.ces:4:11: Unexpected `e`, expecting `;` on line 4.\n' +
            'error9.ces:5:10: Unexpected `#`, expecting `=` on line 5.\n' +
            'error9.ces:6:10: Unexpected `{`, expecting `=` on line 6.\n' +
            'error9.ces:7:6: Unexpected `=`, expecting `attribute name` on line 7.\n' +
            'error9.ces:8:12: Unexpected `"`, expecting `:` on line 8.\n' +
            'error9.ces:9:12: Unexpected `\'`, expecting `:` on line 9.\n' +
            'error9.ces:10:6: Unexpected `[`, expecting `attribute name` on line 10.\n' +
            'error9.ces:11:18: Unexpected `;`, expecting `]` on line 11.', 'Unexpected = token after attribute value, unexpected tokens in attribute name, missing attribute name and unexpected tokens in property name.');

        start();
    });

    ces.download('error10.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error10.ces');
        }, 'error10.ces:2:7: Unexpected `=`, expecting `attribute name` on line 2.', 'Unexpected = token before attribute name.');

        start();
    });

    ces.download('error11.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error11.ces');
        }, 'error11.ces:2:18: Unexpected `-`, expecting `]` on line 2.\n' +
            'error11.ces:3:14: Unexpected `;`, expecting `:` on line 3.\n' +
            'error11.ces:4:12: Unexpected `"`, expecting `=` on line 4.', 'Unexpected - token after attribute name, missing : after property name and missing = after attribute name.');

        start();
    });

    ces.download('error12.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error12.ces');
        }, 'error12.ces:2:12: Unexpected `-`, expecting `"attribute value"` on line 2.', 'Unexpected - token before attribute value.');

        start();
    });

    ces.download('error13.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error13.ces');
        }, 'error13.ces:1:12: Unexpected `>`, expecting `$event` on line 1.\n' +
            'error13.ces:3:6: Unexpected `#`, expecting `attribute name` on line 3.\n' +
            'error13.ces:4:5: Unexpected `+`, expecting `css property name or html attribute` on line 4.\n' +
            'error13.ces:6:1: Unexpected `EOF`, expecting `;` on line 6.', 'Unexpected > token in event, unexpected # in attribute name, unexpected + in property name and missing ;.');

        start();
    });

    ces.download('error14.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error14.ces');
        }, 'error14.ces:1:11: Unexpected `>`, expecting `$event` on line 1.\n' +
            'error14.ces:1:44: Unexpected `#`, expecting `attribute name` on line 1.\n' +
            'error14.ces:1:59: Unexpected `+`, expecting `css property name or html attribute` on line 1.\n' +
            'error14.ces:2:1: Unexpected `EOF`, expecting `;` on line 2.', 'Errors in compressed file.');

        start();
    });

    ces.download('error15.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error15.ces');
        }, 'error15.ces:4:14: Unexpected `>`, expecting `$event` on line 4.\n' +
            'error15.ces:21:3: Unexpected `#`, expecting `attribute name` on line 21.\n' +
            'error15.ces:23:5: Unexpected `+`, expecting `css property name or html attribute` on line 23.\n' +
            'error15.ces:34:1: Unexpected `EOF`, expecting `;` on line 34.', 'Errors in spaced file.');

        start();
    });

    ces.download('error16.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error16.ces');
        }, 'error16.ces:4:1: Unexpected `#`, expecting `css property name or html attribute` on line 4.\n' +
            'error16.ces:6:1: Unexpected `EOF`, expecting `}` on line 6.', 'Missing }.');

        start();
    });

    ces.download('error17.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error17.ces');
        }, 'error17.ces:3:1: Unexpected `}`, expecting `{` on line 3.\n' +
            'error17.ces:7:1: Unexpected `}`, expecting `{` on line 7.', 'Missing {.');

        start();
    });

    ces.download('error18.ces', function(source) {
        stop();

        throws(function() {
            ces.ces2js(source, 'error18.ces');
        }, 'error18.ces:2:15: Unexpected `@`, expecting `class name` on line 2.\n' +
            'error18.ces:3:14: Unexpected `#`, expecting `class name` on line 3.\n' +
            'error18.ces:4:16: Unexpected `*`, expecting `class name` on line 4.\n' +
            'error18.ces:6:12: Unexpected `@`, expecting `class name` on line 6.', 'Unexpected characters in class names.');

        start();
    });

    ces.download('error19.ces', function(source) {
        /*stop();*/

        throws(function() {
            ces.ces2js(source, 'error19.ces');
        }, 'error19.ces:2:11: Unexpected `missing`, expecting `"` on line 2.\n' +
            'error19.ces:3:17: Unexpected `newline`, expecting `"` on line 3.\n' +
            'error19.ces:5:11: Unexpected `mi`, expecting `"` on line 5.\n' +
            'error19.ces:6:17: Unexpected `ing`, expecting `;` on line 6.\n' +
            'error19.ces:11:11: Unexpected `missing`, expecting `"` on line 11.\n' +
            'error19.ces:12:17: Unexpected `newline`, expecting `"` on line 12.\n' +
            'error19.ces:20:11: Unexpected `mi`, expecting `"` on line 20.\n' +
            'error19.ces:21:17: Unexpected `ing`, expecting `;` on line 21.');

        start();
    });
});
