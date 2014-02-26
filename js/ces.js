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

/*
 * Check if the current string ends with suffix
 */
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

/*
 * CES property / JavaScript attributes mapping.
 */
var JsAttributes = {
    'html': 'innerHTML',
    'text': 'textContent'
};

/*
 * State of the CES parsing.
 */
var State = {
    CSS_SELECTOR: 0,
    EVENT: 1,
    EVENT_SELECTOR: 2,
    PROPERTY_NAME: 3,
    PROPERTY_VALUE: 4
};

/*
 * Class to store the properties to change after an event on a selector.
 */
function Action() {
    this.cssSelector = '';
    this.event = '';
    this.eventSelector = '';
    this.properties = [];
}

/*
 * Add a property to the action.
 */
Action.prototype.add = function(property) {
    this.properties.push(property);
};

/*
 * Class to store a CSS/JS property.
 */
function Property() {
    this.name = '';
    this.value = '';
}

/*
 * Convert the CES actions to JavaScript.
 */
function actions2js(actions) {
    var i;
    var j;
    var js = '';
    var propertyName;
    var propertyValue;
    var selector = 'this';
    for(i = 0 ; i < actions.length ; ++i) {
        js += 'document.querySelector("' + actions[i].eventSelector + '").addEventListener("' + actions[i].event + '", function() {\n';
        if(actions[i].cssSelector.length > 0) {
            selector = 'element';
            js += '    var element = document.querySelector("' + actions[i].cssSelector + '");\n';
        }
        for(j = 0 ; j < actions[i].properties.length ; ++j) {
            propertyName = actions[i].properties[j].name;
            propertyValue = actions[i].properties[j].value;
            if(propertyName in JsAttributes) {
                js += '    ' + selector + '.' + JsAttributes[propertyName] + ' = ' + propertyValue + ';\n';
            }
            else {
                js += '    ' + selector + '.style.setProperty("' + propertyName + '", "' + propertyValue + '");\n';
            }
        }
        js += '}, false);\n';
    }
    console.log(js);
    return js;
}

/*
 * Convert the CES to JavaScript.
 */
function ces2js(source) {
    var actions = parseCES(source);
    return actions2js(actions);
}

/*
 * Download the file from url, then execute callback.
 * The callback function receives the downloaded file content in its first parameter.
 */
function download(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.addEventListener('readystatechange', function() {
        if(xhr.readyState == xhr.DONE) {
            callback(xhr.responseText);
        }
    }, false);
    xhr.overrideMimeType('text/plain');
    xhr.send(null);
    return '';
}

/*
 * Execute the JavaScript source code.
 */
function execute(js) {
    eval(js);
}

/*
 * Parse the Cascading Event Sheet and return the resulting JavaScript source code.
 */
function parseCES(source) {
    var action = new Action();
    var actions = [];
    var i;
    var property = new Property();
    var start = 0;
    var state = State.EVENT_SELECTOR;

    function getEvent() {
        action.event = source.substring(start, i).trim();
        start = i + 1;
        state = State.CSS_SELECTOR;
    }

    for(i = 0 ; i < source.length ; ++i) {
        if(source[i] == ':') {
            if(state == State.PROPERTY_NAME) {
                property.name = source.substring(start, i).trim();
                state = State.PROPERTY_VALUE;
                start = i + 1;
            }
        }
        else if(source[i] == '$') {
            if(state == State.EVENT_SELECTOR) {
                action.eventSelector = source.substring(start, i).trim();
                start = i + 1;
                state = State.EVENT;
            }
        }
        else if(source[i] == '{') {
            if(state == State.EVENT) {
                getEvent();
            }
            else if(state == State.CSS_SELECTOR) {
                action.cssSelector = source.substring(start, i).trim();
                start = i + 1;
                state = State.PROPERTY_NAME;
            }
            else {
                throw 'Unexpected "{", expecting "$event".';
            }
        }
        else if(source[i] == '}') {
            if(state == State.PROPERTY_NAME) {
                actions.push(action);
                action = new Action();
                state = State.EVENT_SELECTOR;
                start = i + 1;
            }
            else {
                var errorMessage = 'Unexpected "}", expecting "';
                switch(state) {
                    case State.EVENT:
                        errorMessage += '$event';
                        break;
                    case State.PROPERTY_NAME:
                        errorMessage += 'property name';
                        break;
                    case State.PROPERTY_VALUE:
                        errorMessage += 'property value';
                        break;
                    case State.EVENT_SELECTOR:
                        errorMessage += 'event selector';
                        break;
                }
                errorMessage += '".';
                throw errorMessage;
            }
        }
        else if(source[i] == ';') {
            if(state == State.PROPERTY_VALUE) {
                property.value = source.substring(start, i).trim();
                action.add(property);
                start = i + 1;
                state = State.PROPERTY_NAME;

                property = new Property();
            }
        }
        else if(' ' == source[i] && State.EVENT == state) {
            getEvent();
        }
    }
    return actions;
}

/*
 * Process the link tags to find the Cascading Event Sheet.
 */
function processLinkTags() {
    var linkTags = document.getElementsByTagName('link');
    var i;
    for(i = 0 ; i < linkTags.length ; ++i) {
        var url = linkTags[i].href;
        if(url.endsWith('.ces')) {
            download(url, function(source) {
                var js = ces2js(source);
                execute(js);
            });
        }
    }
}

window.addEventListener('load', processLinkTags, false);
