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

asyncTest('Built-in Methods', function() {
    expect(49);

    ces.download('test.ces', function(source) {
        stop();

        var body = document.querySelector('#qunit-fixture');

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

        var js = ces.ces2js(source, 'test.ces');
        ces.execute(js);

        equal(button.textContent, 'Button', 'Text is set to "Button".');

        trigger(button, 'click');

        equal(button.textContent, 'Clicked', 'Text is set to "Clicked".');

        equal(paragraph.innerHTML, 'Paragraph', 'HTML is set to "Paragraph".');

        trigger(paragraph, 'click');

        equal(paragraph.innerHTML, '<strong>Text</strong>', 'HTML is set to "<strong>Text</strong>".');

        start();
    });

    ces.download('test9.ces', function(source) {
        stop();

        var body = document.querySelector('#qunit-fixture');

        var button3 = document.createElement('button');
        button3.id = 'button3';
        button3.textContent = 'Button';
        body.appendChild(button3);

        var paragraph2 = document.createElement('p');
        paragraph2.id = 'paragraph2';
        paragraph2.innerHTML = 'Text';
        body.appendChild(paragraph2);

        var js = ces.ces2js(source, 'test9.ces');
        ces.execute(js);

        equal(button3.textContent, 'Button', 'Text is set to "Button".');

        trigger(button3, 'click');

        equal(button3.textContent, 'Clicked', 'Text is set to "Clicked".');

        equal(paragraph2.innerHTML, 'Text', 'HTML is set to "Text".');

        trigger(paragraph2, 'click');

        equal(paragraph2.innerHTML, '<em>Text</em>', 'HTML is set to "<em>Text</em>".');

        start();
    });

    ces.download('test20.ces', function(source) {
        stop();

        var body = document.querySelector('#qunit-fixture');

        var appendButton = document.createElement('button');
        appendButton.id = 'appendButton';
        appendButton.textContent = 'Button';
        body.appendChild(appendButton);

        var appendParagraph = document.createElement('p');
        appendParagraph.id = 'appendParagraph';
        appendParagraph.innerHTML = 'Text ';
        body.appendChild(appendParagraph);

        var appendHTMLButton = document.createElement('button');
        appendHTMLButton.id = 'appendHTMLButton';
        appendHTMLButton.textContent = 'HTML Button';
        body.appendChild(appendHTMLButton);

        var appendHTMLParagraph = document.createElement('p');
        appendHTMLParagraph.id = 'appendHTMLParagraph';
        appendHTMLParagraph.innerHTML = 'HTML';
        body.appendChild(appendHTMLParagraph);

        var multipleAppendParagraph = document.createElement('p');
        multipleAppendParagraph.id = 'multipleAppend';
        multipleAppendParagraph.textContent = 'Text';
        body.appendChild(multipleAppendParagraph);

        var multipleAppendHTMLParagraph = document.createElement('p');
        multipleAppendHTMLParagraph.id = 'multipleHTMLAppend';
        multipleAppendHTMLParagraph.innerHTML = 'HTML';
        body.appendChild(multipleAppendHTMLParagraph);

        var quote = document.createElement('div');
        quote.id = 'quote';
        quote.textContent = 'Quote';
        body.appendChild(quote);

        var quoteHTML = document.createElement('div');
        quoteHTML.id = 'quoteHTML';
        quoteHTML.innerHTML = 'Quote HTML';
        body.appendChild(quoteHTML);

        var prependButton = document.createElement('button');
        prependButton.id = 'prependButton';
        prependButton.textContent = 'Button';
        body.appendChild(prependButton);

        var prependParagraph = document.createElement('p');
        prependParagraph.id = 'prependParagraph';
        prependParagraph.innerHTML = 'Text';
        body.appendChild(prependParagraph);

        var prependHTMLButton = document.createElement('button');
        prependHTMLButton.id = 'prependHTMLButton';
        prependHTMLButton.textContent = 'HTML Button';
        body.appendChild(prependHTMLButton);

        var prependHTMLParagraph = document.createElement('p');
        prependHTMLParagraph.id = 'prependHTMLParagraph';
        prependHTMLParagraph.innerHTML = 'HTML';
        body.appendChild(prependHTMLParagraph);

        var js = ces.ces2js(source, 'test20.ces');
        ces.execute(js);

        equal(appendParagraph.textContent, 'Text ', 'Text is set to "Text ".');

        trigger(appendButton, 'click');

        equal(appendParagraph.textContent, 'Text appended content ', 'Text is set to "Text appended content ".');

        trigger(appendButton, 'click');

        equal(appendParagraph.textContent, 'Text appended content appended content ', 'Text is set to "Text appended content appended content ".');

        equal(appendHTMLParagraph.innerHTML, 'HTML', 'HTML is set to "HTML".');

        trigger(appendHTMLButton, 'click');

        equal(appendHTMLParagraph.innerHTML, 'HTML <strong>new html</strong>', 'HTML is set to "HTML <strong> new html</strong>".');

        trigger(appendHTMLButton, 'click');

        equal(appendHTMLParagraph.innerHTML, 'HTML <strong>new html</strong> <strong>new html</strong>', 'HTML is set to "HTML <strong> new html</strong> <strong> new html</strong>".');

        equal(multipleAppendParagraph.textContent, 'Text', 'Text is set to "Text".');

        trigger(multipleAppendParagraph, 'click');

        equal(multipleAppendParagraph.textContent, 'Text new text', 'Text is set to "Text new text".');

        equal(multipleAppendHTMLParagraph.innerHTML, 'HTML', 'HTML is set to "HTML".');

        trigger(multipleAppendHTMLParagraph, 'click');

        equal(multipleAppendHTMLParagraph.innerHTML, 'HTML <em>new</em> <strong>text</strong>', 'HTML is set to "HTML <em>new</em> <strong>text</strong>".');

        equal(quote.textContent, 'Quote', 'Text is set to "Quote".');

        trigger(quote, 'click');

        equal(quote.textContent, 'Quote \" value', 'Text is set to "Quote \" value".');

        equal(quoteHTML.innerHTML, 'Quote HTML', 'HTML is set to "Quote HTML".');

        trigger(quoteHTML, 'click');

        equal(quoteHTML.innerHTML, 'Quote <strong>\"</strong> value', 'HTML is set to "Quote <strong>\"</strong> value".')

        equal(prependParagraph.textContent, 'Text', 'Text is set to "Text".');

        trigger(prependButton, 'click');

        equal(prependParagraph.textContent, 'prepended content Text', 'Text is set to "prepended content Text".');

        trigger(prependButton, 'click');

        equal(prependParagraph.textContent, 'prepended content prepended content Text', 'Text is set to "prepended content prepended content Text".');

        equal(prependHTMLParagraph.innerHTML, 'HTML', 'HTML is set to "HTML".');

        trigger(prependHTMLButton, 'click');

        equal(prependHTMLParagraph.innerHTML, '<strong>prepend</strong> HTML', 'HTML is set to "<strong>prepend</strong> HTML".');

        trigger(prependHTMLButton, 'click');

        equal(prependHTMLParagraph.innerHTML, '<strong>prepend</strong> <strong>prepend</strong> HTML', 'HTML is set to "<strong>prepend</strong> <strong>prepend</strong> HTML".');

        start();
    });

    ces.download('test21.ces', function(source) {
        stop();

        var body = document.querySelector('#qunit-fixture');

        var ghPar = document.createElement('par');
        ghPar.id = 'ghPar';
        ghPar.textContent = 'Link';
        body.appendChild(ghPar);

        var js = ces.ces2js(source, 'test21.ces');

        ok(js.indexOf('location.href = "https://github.com/";') != -1, 'Redirect is in the generated JavaScript.');

        start();
    });

    ces.download('test28.ces', function(source) {
        var body = document.querySelector('#qunit-fixture');

        var wrap = document.createElement('div');
        wrap.id = 'wrap';
        wrap.textContent = 'Div';
        body.appendChild(wrap);

        var wrapped = document.createElement('div');
        wrapped.id = 'wrapped';
        wrapped.textContent = 'Div';
        body.appendChild(wrapped);

        var innerWrap = document.createElement('div');
        innerWrap.id = 'innerWrap';
        innerWrap.textContent = 'Div';
        body.appendChild(innerWrap);

        var innerWrapped = document.createElement('div');
        innerWrapped.id = 'innerWrapped';
        innerWrapped.textContent = 'Div';
        body.appendChild(innerWrapped);

        var js = ces.ces2js(source, 'test28.ces');
        ces.execute(js);

        ok(body.innerHTML.indexOf('<div id="wrap">Div</div>') !== -1, 'Wrap div is present.');
        ok(body.innerHTML.indexOf('<div id="wrapped">Div</div>') !== -1, 'Wrapped div is present.');

        trigger(wrap, 'click');

        ok(body.innerHTML.indexOf('<div><div id="wrap">Div</div></div>') !== -1, 'Wrap div is present.');
        ok(body.innerHTML.indexOf('<div id="wrapped">Div</div>') !== -1, 'Wrapped div is present.');

        trigger(wrap, 'click');

        ok(body.innerHTML.indexOf('<div><div><div id="wrap">Div</div></div></div>') !== -1, 'Wrap div is present.');
        ok(body.innerHTML.indexOf('<div id="wrapped">Div</div>') !== -1, 'Wrapped div is present.');

        trigger(wrapped, 'click');

        ok(body.innerHTML.indexOf('<div><div><div id="wrap">Div</div></div></div>') !== -1, 'Wrap div is present.');
        ok(body.innerHTML.indexOf('<div class="backred"><div class="blue"><div class="underline"><div id="wrapped">Divtest</div></div></div></div>') !== -1, 'Wrapped div is present.');

        trigger(wrapped, 'click');

        ok(body.innerHTML.indexOf('<div><div><div id="wrap">Div</div></div></div>') !== -1, 'Wrap div is present.');
        ok(body.innerHTML.indexOf('<div class="backred"><div class="blue"><div class="underline"><div class="backred"><div class="blue"><div class="underline"><div id="wrapped">Divtesttest</div></div></div></div></div></div></div>') !== -1, 'Wrapped div is present.');

        ok(body.innerHTML.indexOf('<div id="innerWrap">Div</div>') !== -1, 'Inner Wrap div is present.');
        ok(body.innerHTML.indexOf('<div id="innerWrapped">Div</div>') !== -1, 'Inner Wrapped div is present.');

        trigger(innerWrap, 'click');

        ok(body.innerHTML.indexOf('<div id="innerWrap"><div>Div</div></div>') !== -1, 'Inner Wrap div is present.');
        ok(body.innerHTML.indexOf('<div id="innerWrapped">Div</div>') !== -1, 'Inner Wrapped div is present.');

        trigger(innerWrap, 'click');

        ok(body.innerHTML.indexOf('<div id="innerWrap"><div><div>Div</div></div></div>') !== -1, 'Inner Wrap div is present.');
        ok(body.innerHTML.indexOf('<div id="innerWrapped">Div</div>') !== -1, 'Inner Wrapped div is present.');

        trigger(innerWrapped, 'click');

        ok(body.innerHTML.indexOf('<div id="innerWrap"><div><div>Div</div></div></div>') !== -1, 'Inner Wrap div is present.');
        ok(body.innerHTML.indexOf('<div id="innerWrapped"><div class="backred"><div class="blue"><div class="underline">Divtest</div></div></div></div>') !== -1, 'Inner Wrapped div is present.');

        trigger(innerWrapped, 'click');

        ok(body.innerHTML.indexOf('<div id="innerWrap"><div><div>Div</div></div></div>') !== -1, 'Inner Wrap div is present.');
        ok(body.innerHTML.indexOf('<div id="innerWrapped"><div class="backred"><div class="blue"><div class="underline"><div class="backred"><div class="blue"><div class="underline">Divtest</div></div></div>test</div></div></div></div>') !== -1, 'Inner Wrapped div is present.');

        start();
    });
});
