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
    ATTRIBUTE_NAME: 0,
    ATTRIBUTE_VALUE: 1,
    CSS_SELECTOR: 2,
    EVENT: 3,
    EVENT_SELECTOR: 4,
    PROPERTY_NAME: 5,
    PROPERTY_VALUE: 6,
    REMOVE_ATTRIBUTE: 7
};

/*
 * Class to store the properties to change after an event on a selector.
 */
function Action() {
    this.attributes = [];
    this.cssClasses = [];
    this.cssSelector = '';
    this.cssProperties = [];
    this.event = '';
    this.eventSelector = '';
    this.jsProperties = [];
}

/*
 * Add an HTML attribute to the action.
 */
Action.prototype.addAttr = function(attribute) {
    this.attributes.push(attribute);
}

/*
 * Add a CSS class change to the action.
 */
Action.prototype.addClass = function(cssClass) {
    this.cssClasses.push(cssClass);
};

/*
 * Add a CSS property to the action.
 */
Action.prototype.addCss = function(property) {
    this.cssProperties.push(property);
};

/*
 * Add a JS property to the action.
 */
Action.prototype.addJs = function(property) {
    this.jsProperties.push(property);
};

/*
 * Class to store an HTML attribute.
 */
function Attribute() {
    this.name = '';
    this.remove = false;
    this.value = '';
}

/*
 * Class to store a CSS class add/remove/toggle action.
 */
function CssClass() {
    this.action = 'add';
    this.name = '';
}

/*
 * Class to store a CSS property.
 */
function CssProperty() {
    this.name = '';
    this.value = '';
}

/*
 * Class to store a JS property.
 */
function JsProperty() {
    this.name = '';
    this.value = '';
}

/*
 * Convert the CES actions to JavaScript.
 */
function actions2js(actions) {
    var action;
    var i;
    var j;
    var js = '';
    var name;
    var value;
    var selector;
    for(i = 0 ; i < actions.length ; ++i) {
        action = actions[i];
        js += 'document.querySelector("' + action.eventSelector + '").addEventListener("' + action.event + '", function() {\n';
        if(action.cssSelector.length > 0) {
            selector = 'element';
            js += '    var element = document.querySelector("' + action.cssSelector + '");\n';
        }
        else {
            selector = 'this';
        }
        for(j = 0 ; j < action.cssProperties.length ; ++j) {
            name = action.cssProperties[j].name;
            value = action.cssProperties[j].value;
            js += '    ' + selector + '.style.setProperty("' + name + '", "' + value + '");\n';
        }
        for(j = 0 ; j < action.jsProperties.length ; ++j) {
            name = action.jsProperties[j].name;
            value = action.jsProperties[j].value;
            js += '    ' + selector + '.' + JsAttributes[name] + ' = ' + value + ';\n';
        }
        for(j = 0 ; j < action.attributes.length ; ++j) {
            name = action.attributes[j].name;
            if(action.attributes[j].remove) {
                js += '    ' + selector + '.removeAttribute("' + name + '");\n';
            }
            else {
                value = action.attributes[j].value;
                js += '    ' + selector + '.setAttribute("' + name + '", "' + value + '");\n';
            }
        }
        for(j = 0 ; j < action.cssClasses.length ; ++j) {
            js += '    ' + selector + '.classList.' + action.cssClasses[j].action + '("' + action.cssClasses[j].name + '");\n';
        }
        js += '}, false);\n';
    }
    console.log(js);
    return js;
}

/*
 * Convert the CES to JavaScript.
 */
function ces2js(source, url) {
    var actions = parseCES(source, url);
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
 * Get the error message for an unexpected token.
 */
function getUnexpectedTokenErrorMessage(token, state, lineNumber, url) {
    var errorMessage = url + ':' + lineNumber + ': Unexpected `' + token + '`, expecting `';
    switch(state) {
        case State.ATTRIBUTE_NAME:
            errorMessage += '="attribute value"';
            break;
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
        default:
            console.log(state);
    }
    errorMessage += '` on line ' + lineNumber + '.';
    return errorMessage;
}

/*
 * Parse the Cascading Event Sheet and return the resulting JavaScript source code.
 */
function parseCES(source, url) {
    var action = new Action();
    var actions = [];
    var attribute = new Attribute();
    var classAction = 'add';
    var cssClass = new CssClass();
    var cssProperty = new CssProperty();
    var endsWithQuote = false;
    var i;
    var isClassList = false;
    var lineNumber = 1;
    var jsProperty = new JsProperty();
    var removeAttribute = false;
    var start = 0;
    var state = State.EVENT_SELECTOR;
    var token = '';

    function getEvent() {
        action.event = source.substring(start, i).trim();
        start = i + 1;
        state = State.CSS_SELECTOR;
    }

    for(i = 0 ; i < source.length ; ++i) {
        if(source[i] == ':') {
            if(state == State.PROPERTY_NAME) {
                token = source.substring(start, i).trim();
                if(token == 'classes') {
                    isClassList = true;
                }
                else if(token in JsAttributes) {
                    jsProperty.name = token;
                }
                else {
                    cssProperty.name = token;
                }
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
                throw url + ':' + lineNumber + ': Unexpected `{`, expecting `$event` on line ' + lineNumber + '.';
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
                throw getUnexpectedTokenErrorMessage(source[i], state, lineNumber, url);
            }
        }
        else if(source[i] == ';') {
            if(state == State.PROPERTY_VALUE) {
                if(isClassList) {
                    cssClass.name = source.substring(start, i).trim();
                    cssClass.action = classAction;
                    action.addClass(cssClass);
                    cssClass = new CssClass();
                    classAction = 'add';
                    isClassList = false;
                }
                else if(cssProperty.name.length > 0) {
                    cssProperty.value = source.substring(start, i).trim();
                    action.addCss(cssProperty);
                    cssProperty = new CssProperty();
                }
                else if(jsProperty.name.length > 0) {
                    jsProperty.value = source.substring(start, i).trim();
                    action.addJs(jsProperty);
                    jsProperty = new JsProperty();
                }
                start = i + 1;
                state = State.PROPERTY_NAME;
            }
        }
        else if('[' == source[i]) {
            if(State.PROPERTY_NAME == state) {
                state = State.ATTRIBUTE_NAME;
                start = i + 1;
            }
        }
        else if('=' == source[i]) {
            if(State.ATTRIBUTE_NAME == state) {
                attribute.name = source.substring(start, i).trim();
                start = i + 1;
                state = State.ATTRIBUTE_VALUE;
            }
            else {
                throw getUnexpectedTokenErrorMessage(source[i], state, lineNumber, url);
            }
        }
        else if(']' == source[i]) {
            if(State.ATTRIBUTE_NAME == state) {
                if(removeAttribute) {
                    attribute.name = source.substring(start, i);
                    attribute.remove = true;
                    start = i + 1;
                    state = State.PROPERTY_NAME;
                    action.addAttr(attribute);
                    attribute = new Attribute();
                }
                else {
                    throw url + ':' + lineNumber + ': Unexpected `]`, expecting `"attribute value"` on line ' + lineNumber + '.';
                }
            }
            else if(State.ATTRIBUTE_VALUE == state) {
                attribute.value = source.substring(start, i).trim();
                endsWithQuote = attribute.value[attribute.value.length - 1] == '"';
                if(attribute.value[0] == '"') {
                    attribute.value = attribute.value.substring(1, attribute.value.length - 1);
                }
                else {
                    throw url + ':' + lineNumber + ': Unexpected `' + attribute.value + '`, expecting `"attribute value"` on line ' + lineNumber + '.';
                }
                if(!endsWithQuote) {
                    throw url + ':' + lineNumber + ': Unexpected `]`, expecting `"` (quote) on line ' + lineNumber + '.';
                }
                start = i + 1;
                state = State.PROPERTY_NAME;
                action.addAttr(attribute);
                attribute = new Attribute();
            }
            else {
                throw getUnexpectedTokenErrorMessage(source[i], state, lineNumber, url);
            }
        }
        else if('-' == source[i]) {
            if(State.ATTRIBUTE_NAME == state) {
                start = i + 1;
                removeAttribute = true;
            }
            else if(State.PROPERTY_VALUE == state) {
                classAction = 'remove';
                start = i + 1;
            }
        }
        else if('+' == source[i]) {
            if(State.PROPERTY_VALUE == state) {
                classAction = 'add';
                start = i + 1;
            }
            else {
                throw getUnexpectedTokenErrorMessage(source[i], state, lineNumber, url);
            }
        }
        else if('!' == source[i]) {
            if(State.PROPERTY_VALUE == state) {
                classAction = 'toggle';
                start = i + 1;
            }
            else {
                throw getUnexpectedTokenErrorMessage(source[i], state, lineNumber, url);
            }
        }
        else if(' ' == source[i] && State.EVENT == state) {
            getEvent();
        }
        else if('\n' == source[i]) {
            ++lineNumber;
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
        (function(url, relativeUrl) {
            if(url.endsWith('.ces')) {
                download(url, function(source) {
                    var js = ces2js(source, relativeUrl);
                    execute(js);
                });
            }
        })(linkTags[i].href, linkTags[i].getAttribute('href'));
    }
}

window.addEventListener('load', processLinkTags, false);
