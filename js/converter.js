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

window.addEventListener('load', function() {
    var button = document.querySelector('button#convertButton');
    var cesFilesInput = document.querySelector('input#cesFiles');
    var file;
    var links = document.querySelector('div#links');

    button.addEventListener('click', function() {
        for(file of cesFilesInput.files) {
            var reader = new FileReader();

            reader.addEventListener('load', function() {
                var link = document.createElement('a');
                var source = ces.ces2js(reader.result);
                source = 'window.addEventListener("load", function() {\n' + source + '}, false);';
                var blob = new Blob([source], {type: 'text/plain'});
                var filename = file.name.replace('.ces', '.js');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                link.textContent = 'Download ' + filename;
                links.appendChild(link);
            }, false);
            reader.readAsText(file);
        }
    }, false);
}, false);
