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

(function(ces) {
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
        ATTRIBUTE_AFTER_END: 0,
        ATTRIBUTE_END: 1,
        ATTRIBUTE_NAME: 2,
        ATTRIBUTE_START: 3,
        ATTRIBUTE_VALUE_START: 4,
        ATTRIBUTE_VALUE_STRING: 5,
        BODY: 6,
        CSS_SELECTOR: 7,
        EVENT: 8,
        EVENT_SELECTOR: 9,
        MULTILINE_COMMENT: 10,
        PROPERTY_NAME: 11,
        PROPERTY_VALUE: 12,
        REMOVE_ATTRIBUTE: 13,
        ROOT: 14,
        SINGLELINE_COMMENT: 15
    };

    /*
     * State of the CSS selector parsing.
     */
    var SelectorState = {
        ATTRIBUTE_NAME: 0,
        ATTRIBUTE_VALUE: 1,
        CLASS: 2,
        ID: 3,
        ROOT: 4,
        TAG_NAME: 5
    };

    /*
     * Methods.
     */
    var methods = [];

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
        this.methods = [];
        this.methods = [];
    }

    /*
     * Add an HTML attribute to the action.
     */
    Action.prototype.addAttr = function(attribute) {
        this.attributes.push(attribute);
    };

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
     * Add a JS method to the action.
     */
    Action.prototype.addMethod = function(method) {
        this.methods.push(method);
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
        this.decrement = false;
        this.increment = false;
        this.name = '';
        this.value = '';
    }

    /*
     * Parse error class.
     */
    function Error(filename, line, column, unexpected, expecting) {
        this.column = column;
        this.expecting = expecting;
        this.filename = filename;
        this.line = line;
        this.unexpected = unexpected;
    }

    /*
     * Class to store a JS property.
     */
    function JsProperty() {
        this.decrement = false;
        this.increment = false;
        this.name = '';
        this.value = '';
    }

    /*
     * Class to store a JS method.
     */
    function Method(name) {
        this.name = name;
        this.parameter = null;
    }

    /*
     * Convert the CES actions to JavaScript.
     */
    function actions2js(actions) {
        var action;
        var i;
        var isDomReady;
        var j;
        var js = '';
        var name;
        var propertyPrefix;
        var prefix;
        var selector;
        var suffix;
        var value;
        for(i = 0 ; i < actions.length ; ++i) {
            action = actions[i];
            isDomReady = 'dom' == action.eventSelector && 'ready' == action.event;
            js += '(function() {\n';
            js += 'var attributes = {};\n';
            js += 'var callback;\n';
            if(!isDomReady) {
                js += 'var elements = document.querySelectorAll("' + addSlashes(action.eventSelector) + '");\n';
                js += 'for(var i = 0 ; i < elements.length ; ++i) {\n';
            }
            js += '    callback = function(event) {\n';
            if(action.cssSelector.length > 0) {
                prefix = '        for(var j = 0 ; j < selectedElements.length ; ++j) {\n';
                selector = 'selectedElements[j]';
                suffix = '        }\n';
                if(!isDomReady) {
                    js += '        var selectedElements = document.querySelectorAll(ces.processSelector("' + addSlashes(action.cssSelector) + '", this, attributes));\n';
                }
                else {
                    js += '        var selectedElements = document.querySelectorAll("' + addSlashes(action.cssSelector) + '");\n';
                }
            }
            else {
                prefix = '';
                selector = 'this';
                suffix = '';
            }
            for(j = 0 ; j < action.methods.length ; ++j) {
                js += prefix;
                if(action.methods[j].parameter != null) {
                    js += '        ces.call("' + action.methods[j].name + '", ' + selector + ', "' + addSlashes(action.methods[j].parameter) + '", event);\n';
                }
                else {
                    js += '        ces.call("' + action.methods[j].name + '", ' + selector + ', event);\n';
                }
                js += suffix;
            }
            for(j = 0 ; j < action.cssProperties.length ; ++j) {
                name = action.cssProperties[j].name;
                value = action.cssProperties[j].value;
                propertyPrefix = value.substr(0, 2);
                js += prefix;
                if('+=' == propertyPrefix || '-=' == propertyPrefix) {
                    value = value.substr(2);
                    js += '        var value = parseFloat(getComputedStyle(' + selector + ').getPropertyValue("' + name + '"));\n';
                    js += 'console.log("Inc", ' + parseFloat(value) + ');\n';
                    js += 'console.log("Old: " + getComputedStyle(' + selector + ').getPropertyValue("' + name + '"));\n';
                    js += '        value ' + propertyPrefix + ' ' + parseFloat(value) + ';\n';
                    js += 'console.log("New: " + value);\n';
                    js += '        ' + selector + '.style.setProperty("' + name + '", value + "px");\n';
                }
                else {
                    js += '        ' + selector + '.style.setProperty("' + name + '", "' + addSlashes(value) + '");\n';
                }
                js += suffix;
            }
            for(j = 0 ; j < action.jsProperties.length ; ++j) {
                name = action.jsProperties[j].name;
                value = action.jsProperties[j].value;
                js += prefix;
                js += '        ' + selector + '.' + JsAttributes[name] + ' = ' + value + ';\n';
                js += suffix;
            }
            for(j = 0 ; j < action.attributes.length ; ++j) {
                name = action.attributes[j].name;
                //TODO: problem name.length == 0.
                js += prefix;
                if(action.attributes[j].remove) {
                    js += '        ' + selector + '.removeAttribute("' + name + '");\n';
                }
                else {
                    value = action.attributes[j].value;
                    js += '        ' + selector + '.setAttribute("' + name + '", "' + value + '");\n';
                }
                js += suffix;
            }
            for(j = 0 ; j < action.cssClasses.length ; ++j) {
                js += prefix;
                js += '        ' + selector + '.classList.' + action.cssClasses[j].action + '("' + action.cssClasses[j].name + '");\n';
                js += suffix;
            }
            if('this' != selector) {
                js += '        if(attributes.generatedId == this.id) {\n';
                js += '            this.id = "";\n';
                js += '        }\n';
            }
            js += '   };\n';
            if(isDomReady) {
                js += '    var toDispatch = false;\n';
                js += '    if(document.readyState == "complete") {\n';
                js += '        var event = document.createEvent("HTMLEvents");\n';
                js += '        event.initEvent("DOMContentLoaded", true, true);\n';
                js += '        event.eventName = "DOMContentLoaded";\n';
                js += '        toDispatch = true;\n';
                js += '    }\n';
                js += '    document.addEventListener("DOMContentLoaded", callback, false);\n';
                js += '    if(toDispatch) {\n';
                js += '        document.dispatchEvent(event);\n';
                js += '    }\n';
            }
            else {
                js += '    elements[i].addEventListener("' + action.event + '", callback, false);\n';
                js += '}\n';
            }
            js += '})();\n';
        }
        return js;
    }

    /*
     * Add a user-defined method.
     */
    ces.addMethod = function(name, method) {
        methods[name] = method;
    };

    /*
     * Add a slash before each quote (") in the string.
     */
    function addSlashes(string) {
        return string.replace(/"/g, '\\"');
    }

    /*
     * Call a user-defined method.
     */
    ces.call = function(name, selector, event) {
        methods[name].apply(undefined, [selector, event]);
    };

    /*
     * Convert the CES to JavaScript.
     */
    ces.ces2js = function(source, url) {
        var actions = parseCES(convertNewLines(source), url);
        return actions2js(actions);
    };

    /*
     * Convert the new line characters to \n.
     */
    function convertNewLines(source) {
        return source.replace(/(\r\n|\r)/, '\n');
    }

    /*
     * Download the file from url, then execute callback.
     * The callback function receives the downloaded file content in its first parameter.
     */
    ces.download = function(url, callback) {
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
    };

    /*
     * Execute the JavaScript source code.
     */
    ces.execute = function(js, oldScriptTag) {
        var scriptTag = document.createElement('script');
        scriptTag.textContent = js;
        scriptTag.type = 'text/javascript';
        if(oldScriptTag != undefined) {
            oldScriptTag.parentNode.replaceChild(scriptTag, oldScriptTag);
        }
        else {
            document.querySelector('head').appendChild(scriptTag);
        }
    };

    /*
     * Generate a random identifier.
     */
    function generateId() {
        var characters = 'abcdefghijklmnopqrstuvwxyz';
        var i;
        var id = '';
        var lastIndex = characters.length - 1;
        for(i = 0 ; i < 20 ; ++i) {
            id += characters[Math.floor(Math.random() * lastIndex)];
        }
        return id;
    }

    /*
     * Get the next token in the source from the specified position.
     */
    function getNextToken(source, i) {
        var start;
        while(isWhiteSpace(source[i]) && i < source.length) {
            ++i;
        }
        if(i == source.length) {
            return "EOF";
        }
        if(isIdentifier(source[i])) {
            start = i;
            while(isIdentifier(source[i]) && i < source.length) {
                ++i;
            }
            return source.substring(start, i);
        }
        else {
            return source[i];
        }
    }

    /*
     * Count the number of new line in the string.
     */
    function getNewLineCount(string, column) {
        var data = {
            column: column,
            lineCount: 0
        };
        var i;
        for(i = 0 ; i < string.length ; ++i) {
            ++data.column;
            if(isNewLine(string[i])) {
                data.column = 0;
                ++data.lineCount;
            }
        }
        return data;
    }

    /*
     * Return the index of the position to go after an error, the column count and the newline count.
     */
    function goAfterError(source, i, state, column) {
        var data = {};
        var lineColumnData;
        var offset = 0;
        var start = i;
        switch(state) {
            case State.ATTRIBUTE_END:
                i = source.indexOf(']', i);
                if(-1 == i) {
                    i = source.indexOf(';', start) - 1;
                    offset = 1;
                }
                break;
            case State.ATTRIBUTE_NAME:
            case State.REMOVE_ATTRIBUTE:
                i = source.indexOf(']', i);
                break;
            case State.ATTRIBUTE_AFTER_END:
            case State.ATTRIBUTE_START:
            case State.ATTRIBUTE_VALUE_START:
            case State.BODY:
            case State.PROPERTY_NAME:
            case State.PROPERTY_VALUE:
                i = source.indexOf(';', i);
                if(-1 == i) {
                    i = source.indexOf('}', start) - 1;
                    offset = 1;
                }
                break;
            case State.EVENT:
                i = source.indexOf('{', i);
                break;
            case State.EVENT_SELECTOR:
                i = source.indexOf('{', i);
                break;
        }
        if(i < 0) {
            i = source.length;
        }
        data.newPos = i;
        lineColumnData = getNewLineCount(source.substring(start, i + offset), column);
        data.newLineCount = lineColumnData.lineCount;
        data.column = lineColumnData.column;
        return data;
    }
    
    /*
     * Check if the specified character is a character allowed in a identifier.
     */
    function isIdentifier(character) {
        return character.match(/[A-Za-z0-9_-]/);
    }

    /*
     * Check if the specified character is a letter.
     */
    function isLetter(character) {
        return character.match(/[A-Za-z]/);
    }

    /*
     * Check if a defined method exists by name.
     */
    function isMethod(name) {
        return Object.keys(methods).indexOf(name) != -1;
    }

    /*
     * Check if the specified character is a new line.
     */
    function isNewLine(character) {
        return '\n' == character;
    }

    /*
     * Check if the specified character is a white space (space, new line or tab).
     */
    function isWhiteSpace(character) {
        return ' ' == character || isNewLine(character) || '\t' == character;
    }

    /*
     * Load the event sheets in the current document.
     */
    ces.load = function() {
        var scriptTags = document.getElementsByTagName('script');
        var i;
        var length = scriptTags.length;
        for(i = 0 ; i < length ; ++i) {
            if('text/ces' == scriptTags[i].type) {
                if(scriptTags[i].hasAttribute('src')) {
                    (function(url, relativeUrl, scriptTag) {
                        ces.download(url, function(source) {
                            ces.execute(ces.ces2js(source, relativeUrl), scriptTag);
                        });
                    })(scriptTags[i].src, scriptTags[i].getAttribute('src'), scriptTags[i]);
                }
                else {
                    ces.execute(ces.ces2js(scriptTags[i].textContent), scriptTags[i]);
                }
            }
        }
    };

    /*
     * Parse the Cascading Event Sheet and return the resulting JavaScript source code.
     */
    function parseCES(source, url) {
        var action = new Action();
        var actions = [];
        var attribute = new Attribute();
        var char = '';
        var classAction = 'add';
        var columnNumber = 0;
        var cssClass = new CssClass();
        var cssProperty = new CssProperty();
        var endsWithQuote = false;
        var error;
        var errorIndex;
        var errors = [];
        var expecting = '';
        var hasAttributeValue = false;
        var i;
        var isClassList = false;
        var lastState = State.ROOT;
        var lineNumber = 1;
        var jsProperty = new JsProperty();
        var message = '';
        var method = null;
        var needsAttributeValue = false;
        var quote = '';
        var start = 0;
        var state = State.ROOT;
        var token = '';

        function addError(expecting, newState, token) {
            var data = {};
            if(undefined == newState) {
                newState = State.BODY;
            }
            if(undefined == token) {
                token = getNextToken(source, i);
            }

            errors.push(new Error(url, lineNumber, columnNumber, token, expecting));
            data = goAfterError(source, i, state, columnNumber);
            i = data.newPos;
            columnNumber = data.column;
            lineNumber += data.newLineCount;
            state = newState;
        }

        function getEvent() {
            action.event = source.substring(start, i).trim();
            start = i + 1;
            state = State.CSS_SELECTOR;
        }

        for(i = 0 ; i < source.length ; ++i) {
            char = source[i];
            ++columnNumber;
            if('/' == char) {
                if((i + 1 < source.length)) {
                    if('*' == source[i + 1]) {
                        lastState = state;
                        state = State.MULTILINE_COMMENT;
                        ++i;
                        continue;
                    }
                    else if('/' == source[i + 1]) {
                        lastState = state;
                        state = State.SINGLELINE_COMMENT;
                        ++i;
                        continue;
                    }
                }
            }
            switch(state) {
                case State.ATTRIBUTE_AFTER_END:
                    if(';' == char) {
                        state = State.BODY;
                    }
                    else if(!isWhiteSpace(char)) {
                        addError(';');
                    }
                    break;
                case State.ATTRIBUTE_END:
                    if(']' == char) {
                        action.addAttr(attribute);
                        attribute = new Attribute();
                        state = State.ATTRIBUTE_AFTER_END;
                    }
                    else if(!isWhiteSpace(char)) {
                        addError(']', State.ATTRIBUTE_AFTER_END);
                    }
                    break;
                case State.ATTRIBUTE_NAME:
                    if('=' == char) {
                        attribute.name = source.substring(start, i).trim();
                        start = i + 1;
                        state = State.ATTRIBUTE_VALUE_START;
                        needsAttributeValue = true;
                    }
                    else if(']' == char) {
                        attribute.name = source.substring(start, i).trim();
                        action.addAttr(attribute);
                        attribute = new Attribute();
                        state = State.ATTRIBUTE_AFTER_END;
                    }
                    else if(!isIdentifier(char) && !isWhiteSpace(char)) {
                        addError('=');
                    }
                    break;
                case State.ATTRIBUTE_START:
                    if(isLetter(char)) {
                        state = State.ATTRIBUTE_NAME;
                        start = i;
                    }
                    else if('-' == char) {
                        state = State.REMOVE_ATTRIBUTE;
                        start = i + 1;
                    }
                    else if(!isWhiteSpace(char)) {
                        addError('attribute name');
                    }
                    break;
                case State.ATTRIBUTE_VALUE_START:
                    if('"' == char) {
                        state = State.ATTRIBUTE_VALUE_STRING;
                        start = i + 1;
                    }
                    else if(!isWhiteSpace(char)) {
                        addError('"attribute value"');
                    }
                    break;
                case State.ATTRIBUTE_VALUE_STRING:
                    if('"' == char && '\\' != source[i - 1]) {
                        state = State.ATTRIBUTE_END;
                        attribute.value = source.substring(start, i).trim();
                    }
                    else if(isNewLine(char)) {
                        addError('" (quote)', State.BODY, 'end of line');
                    }
                    break;
                case State.BODY:
                    if(isLetter(char) || '-' == char) {
                        state = State.PROPERTY_NAME;
                        start = i;
                    }
                    else if('[' == char) {
                        state = State.ATTRIBUTE_START;
                    }
                    else if('}' == char) {
                        actions.push(action);
                        action = new Action();
                        state = State.ROOT;
                        start = i + 1;
                    }
                    else if(!isWhiteSpace(char) && ';' != char) {
                        addError('css property name or html attribute');
                    }
                    break;
                case State.CSS_SELECTOR:
                    if(('\'' == char || '"' == char)) {
                        if(quote.length == 0) {
                            quote = char;
                        }
                        else {
                            quote = '';
                        }
                    }
                    else if(0 == quote.length && '{' == char) {
                        action.cssSelector = replaceNewLines(source.substring(start, i)).trim();
                        state = State.BODY;
                    }
                    else if(0 == quote.length && '}' == char) {
                        addError('{', State.ROOT);
                    }
                    break;
                case State.EVENT:
                    if('{' == char) {
                        getEvent();
                        state = State.BODY;
                    }
                    else if(isWhiteSpace(char)) {
                        getEvent();
                    }
                    else if(!isIdentifier(char)) {
                        addError('$event');
                    }
                    break;
                case State.EVENT_SELECTOR:
                    if(('\'' == char || '"' == char)) {
                        if(quote.length == 0) {
                            quote = char;
                        }
                        else {
                            quote = '';
                        }
                    }
                    else if(quote.length == 0 && '$' == char) {
                        action.eventSelector = replaceNewLines(source.substring(start, i)).trim();
                        start = i + 1;
                        state = State.EVENT;
                    }
                    else if(quote.length == 0 && ('{' == char || '}' == char)) {
                        addError('$event');
                    }
                    break;
                case State.MULTILINE_COMMENT:
                    if(('*' == char) && (i + 1 < source.length) && '/' == source[i + 1]) {
                        state = lastState;
                        start = i + 2;
                        ++i;
                    }
                    break;
                case State.PROPERTY_NAME:
                    token = source.substring(start, i).trim();
                    if(':' == char) {
                        if(isMethod(token)) {
                            method = new Method(token);
                        }
                        else if(token == 'classes') {
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
                    else if(';' == char && isMethod(token)) {
                        action.addMethod(new Method(token));
                        state = State.BODY;
                    }
                    else if(!isIdentifier(char) && !isWhiteSpace(char)) {
                        addError(':');
                        if(';' != source[i]) {
                            state = State.PROPERTY_VALUE;
                        }
                    }
                    break;
                case State.PROPERTY_VALUE:
                    if(('\'' == char || '"' == char) && !isClassList) {
                        if(quote.length == 0) {
                            quote = char;
                        }
                        else {
                            quote = '';
                        }
                    }
                    else if(';' == char) {
                        if(method != null) {
                            method.parameter = source.substring(start, i).trim();
                            action.addMethod(method);
                            method = null;
                        }
                        else if(isClassList) {
                            cssClass.name = source.substring(start, i).trim();
                            if(cssClass.name.length > 0) {
                                cssClass.action = classAction;
                                action.addClass(cssClass);
                                cssClass = new CssClass();
                                classAction = 'add';
                                isClassList = false;
                            }
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
                        state = State.BODY;
                    }
                    else if(isClassList) {
                        if('-' == char) {
                            classAction = 'remove';
                            start = i + 1;
                        }
                        else if('+' == char) {
                            classAction = 'add';
                            start = i + 1;
                        }
                        else if('!' == char) {
                            classAction = 'toggle';
                            start = i + 1;
                        }
                        else if(isWhiteSpace(char)) {
                            cssClass.name = source.substring(start, i).trim();

                            if(cssClass.name.length > 0) {
                                cssClass.action = classAction;
                                action.addClass(cssClass);
                                cssClass = new CssClass();
                                classAction = 'add';
                                start = i;
                            }
                        }
                        else if(!isIdentifier(char)) {
                            addError('class name');
                        }
                    }
                    else if(0 == quote.length && (']' == char || '[' == char || '{' == char || '}' == char)) {
                        addError(';');
                        if(';' != source[i]) {
                            state = State.ROOT;
                            ++i;
                        }
                    }
                    break;
                case State.REMOVE_ATTRIBUTE:
                    if(']' == char) {
                        attribute.remove = true;
                        attribute.name = source.substring(start, i);
                        action.addAttr(attribute);
                        attribute = new Attribute();
                        state = State.ATTRIBUTE_AFTER_END;
                    }
                    else if(isWhiteSpace(char)) {
                        attribute.remove = true;
                        attribute.name = source.substring(start, i);
                        state = State.ATTRIBUTE_END;
                    }
                    else if(!isIdentifier(char)) {
                        addError('attribute name', State.ATTRIBUTE_AFTER_END);
                    }
                    break;
                case State.ROOT:
                    if(isLetter(char) || '#' == char || '.' == char) {
                        state = State.EVENT_SELECTOR;
                        start = i;
                    }
                    else if(!isWhiteSpace(char)) {
                        addError('event selector', State.ROOT);
                    }
                    break;
                case State.SINGLELINE_COMMENT:
                    if(isNewLine(char)) {
                        state = lastState;
                        start = i + 1;
                    }
                    break;
            }

            if(isNewLine(char)) {
                ++lineNumber;
                columnNumber = 0;
            }
        }

        if(State.ROOT != state) {
            switch(state) {
                case State.BODY:
                    expecting = '}';
                    break;
                case State.EVENT_SELECTOR:
                    expecting = '$event';
                    break;
                case State.PROPERTY_VALUE:
                    expecting = ';';
                    break;
            }
            ++columnNumber;
            --i;
            addError(expecting);
        }
        
        if(errors.length > 0) {
            for(errorIndex in errors) {
                error = errors[errorIndex];
                message += error.filename + ':' + error.line + ':' + error.column + ': Unexpected `' + error.unexpected + '`, expecting `' + error.expecting + '` on line ' + error.line + '.\n';
            }
            message = message.substring(0, message.length - 1);
            throw message;
        }

        return actions;
    }

    /*
     * Parse the CSS selector and return the tokens.
     */
    function parseSelector(selector) {
        var char;
        var i;
        var start = 0;
        var state = SelectorState.ROOT;
        var tokens = [];
        for(i = 0 ; i < selector.length ; ++i) {
            char = selector[i];
            switch(state) {
                case SelectorState.ATTRIBUTE_NAME:
                    if('=' == char) {
                        tokens.push(selector.substring(start, i));
                        state = SelectorState.ATTRIBUTE_VALUE;
                        tokens.push(char);
                        start = i + 1;
                    }
                    break;
                case SelectorState.ATTRIBUTE_VALUE:
                    if(']' == char) {
                        tokens.push(selector.substring(start, i));
                        state = SelectorState.ROOT;
                        tokens.push(char);
                        start = i + 1;
                    }
                    break;
                case SelectorState.CLASS:
                    if(!isIdentifier(char)) {
                        tokens.push(selector.substring(start, i));
                        --i;
                        state = SelectorState.ROOT;
                        start = i;
                    }
                    break;
                case SelectorState.ID:
                    if(!isIdentifier(char)) {
                        tokens.push(selector.substring(start, i));
                        --i;
                        state = SelectorState.ROOT;
                        start = i;
                    }
                    break;
                case SelectorState.ROOT:
                    if('.' == char) {
                        start = i;
                        state = SelectorState.CLASS;
                    }
                    else if('#' == char) {
                        start = i;
                        state = SelectorState.ID;
                    }
                    else if('[' == char) {
                        tokens.push(char);
                        start = i + 1;
                        state = SelectorState.ATTRIBUTE_NAME;
                    }
                    else if(isLetter(char)) {
                        start = i;
                        state = SelectorState.TAG_NAME;
                    }
                    else {
                        start = i + 1;
                        tokens.push(char);
                    }
                    break;
                case SelectorState.TAG_NAME:
                    if(!isIdentifier(char)) {
                        tokens.push(selector.substring(start, i));
                        --i;
                        state = SelectorState.ROOT;
                    }
                    break;
            }
        }
        tokens.push(selector.substring(start, i));
        return tokens;
    }

    /*
     * Process the CSS selector.
     * It will change the this keyword by an id representing the event target.
     * In case the element does not have an ID, it should be manually removed after it is not needed anymore.
     */
    ces.processSelector = function(selector, eventTarget, attributes) {
        var index;
        var tokens = parseSelector(selector);
        if(0 == eventTarget.id.length) {
            attributes.generatedId = generateId();
            eventTarget.id = attributes.generatedId;
        }
        while(-1 != (index = tokens.indexOf('this'))) {
            tokens[index] = '#' + eventTarget.id;
        }
        selector = tokens.join('');
        return selector;
    };

    /*
     * Replace new lines by space.
     */
    function replaceNewLines(string) {
        return string.replace(/\n/gm, ' ');
    }

    /*
     * Add built-in methods.
     */
    ces.addMethod('focus', function(selector) {
        selector.focus()
    });

    ces.addMethod('prevent', function(selector, event) {
        event.preventDefault();
    });

    ces.addMethod('scroll', function(selector) {
        selector.scrollIntoView();
    });
}(window.ces = window.ces || {}));

window.addEventListener('load', ces.load, false);
