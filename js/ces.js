/* jshint bitwise: true, browser: true, camelcase: true, curly: true, eqeqeq: true, forin: true, freeze: true, immed: true, indent: 4, latedef: true, newcap: true, noarg: true, noempty: true, nonbsp: true, nonew: true, quotmark: single, undef: true, unused: true, strict: true */

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
    'use strict';

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
        CONDITION: 7,
        CONDITION_AFTER: 8,
        CSS_SELECTOR: 9,
        EVENT: 10,
        EVENT_SELECTOR: 11,
        MULTILINE_COMMENT: 12,
        PROPERTY_NAME: 13,
        PROPERTY_VALUE: 14,
        REMOVE_ATTRIBUTE: 15,
        ROOT: 16,
        SINGLELINE_COMMENT: 17
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
        this.conditions = [];
        this.cssSelector = '';
        this.cssProperties = [];
        this.event = '';
        this.eventSelector = '';
        this.methods = [];
    }
    
    /*
     * Add an HTML attribute to the action.
     */
    Action.prototype.addAttr = function(attribute) {
        this.attributes.push(attribute);
    };

    /*
     * Add a condition.
     * A condition is a check of one or more css classes. If these match, the actions between the curly braces are executed.
     */
    Action.prototype.addCondition = function(condition) {
        this.conditions.push(condition);
    };

    /*
     * Add a CSS property to the action.
     */
    Action.prototype.addCss = function(property) {
        this.cssProperties.push(property);
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
     * Class to store a condition.
     */
    function Condition() {
        Action.call(this);

        this.classes = [];
        this.matchThis = false;
    }

    Condition.prototype = Object.create(Action.prototype);

    /*
     * Add a class condition.
     */
    Condition.prototype.addClass = function(classCondition) {
        this.classes.push(classCondition);
    };

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
    function Error(url, lineNumber, columnNumber, unexpected, expecting) {
        this.columnNumber = columnNumber;
        this.expecting = expecting;
        this.url = url;
        this.lineNumber = lineNumber;
        this.unexpected = unexpected;
    }

    /*
     * Class to store a JS method.
     */
    function JsMethod(name) {
        this.context = null;
        this.name = name;
        this.parameter = undefined;
    }

    /*
     * Class to store a custom method added by the user.
     */
    function Method(name, body, isMacro) {
        this.body = body;
        this.isMacro = isMacro;
        this.name = name;
    }

    /*
     * Convert a CES action to JavaScript
     */
    function action2js(action, selector, prefix, suffix) {
        var errorMessage = '';
        var i;
        var js = '';
        var method;
        var name;
        var propertyPrefix;
        var value;
        for(i = 0 ; i < action.methods.length ; ++i) {
            method = action.methods[i];
            js += prefix;
            if(isMacroMethod(method.name)) {
                try {
                    js += methods[method.name].body(selector, method.parameter, method.context);
                }
                catch(exception) {
                    errorMessage += exception + '\n';
                }
            }
            else {
                if(typeof method.parameter !== 'undefined') {
                    js += '        ces.call("' + method.name + '", ' + selector + ', ' + method.parameter + ', event);\n';
                }
                else {
                    js += '        ces.call("' + method.name + '", ' + selector + ', event);\n';
                }
            }
            js += suffix;
        }
        for(i = 0 ; i < action.cssProperties.length ; ++i) {
            name = action.cssProperties[i].name;
            value = action.cssProperties[i].value;
            propertyPrefix = value.substr(0, 2);
            js += prefix;
            if('+=' === propertyPrefix || '-=' === propertyPrefix) {
                value = value.substr(2);
                js += '        var value = parseFloat(getComputedStyle(' + selector + ').getPropertyValue("' + name + '"));\n';
                js += '        value ' + propertyPrefix + ' ' + parseFloat(value) + ';\n';
                js += '        ' + selector + '.style.setProperty("' + name + '", value + "px");\n';
            }
            else {
                js += '        ' + selector + '.style.setProperty("' + name + '", "' + addSlashes(value) + '");\n';
            }
            js += suffix;
        }
        for(i = 0 ; i < action.attributes.length ; ++i) {
            name = action.attributes[i].name;
            //TODO: problem name.length == 0.
            js += prefix;
            if(action.attributes[i].remove) {
                js += '        ' + selector + '.removeAttribute("' + name + '");\n';
            }
            else {
                value = action.attributes[i].value;
                js += '        ' + selector + '.setAttribute("' + name + '", "' + value + '");\n';
            }
            js += suffix;
        }
        if(errorMessage.length > 0) {
            throw errorMessage.substring(0, errorMessage.length - 1);
        }
        return js;
    }

    /*
     * Convert the CES actions to JavaScript.
     */
    function actions2js(actions) {
        var action;
        var condition;
        var i;
        var isDomReady;
        var j;
        var js = '';
        var prefix;
        var selector;
        var suffix;
        for(i = 0 ; i < actions.length ; ++i) {
            action = actions[i];
            isDomReady = 'dom' === action.eventSelector && 'ready' === action.event;
            js += '(function() {\n';
            js += 'var ids = [];\n';
            js += 'var callback;\n';
            js += 'var i;\n';
            js += 'var j;\n';
            if(!isDomReady) {
                js += 'var elements = document.querySelectorAll("' + addSlashes(action.eventSelector) + '");\n';
                js += 'for(i = 0 ; i < elements.length ; ++i) {\n';
            }
            js += '    callback = function(event) {\n';
            if(action.cssSelector.length > 0) {
                prefix = '        for(j = 0 ; j < selectedElements.length ; ++j) {\n';
                selector = 'selectedElements[j]';
                suffix = '        }\n';
                if(!isDomReady) {
                    js += '        var selectedElements = document.querySelectorAll(ces.processSelector("' + addSlashes(action.cssSelector) + '", this, ids));\n';
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
            js += action2js(action, selector, prefix, suffix);
            if(action.conditions.length > 0) {
                js += 'var elementClasses = [];\n';
                js += prefix;
                js += 'elementClasses.push(ces.toArray(' + selector + '.classList));\n';
                js += suffix;
            }
            for(j = 0 ; j < action.conditions.length ; ++j) {
                condition = action.conditions[j];
                js += 'j = 0;\n';
                js += prefix;
                if(condition.classes.length > 0) {
                    js += 'if(elementClasses[j].indexOf("' + condition.classes.join('") != -1 && elementClasses[j].indexOf("') + '") != -1) {\n';
                }
                if(condition.matchThis) {
                    js += 'if(' + selector + ' === this) {\n';
                }
                js += action2js(condition, selector, '', '');
                if(condition.matchThis) {
                    js += '}\n';
                }
                if(condition.classes.length > 0) {
                    js += '}\n';
                }
                js += suffix;
            }
            if('this' !== selector) {
                js += '        while(ids.length > 0) {\n';
                js += '            var element = document.querySelector("#" + ids[0]);\n';
                js += '            if(element != null) {\n';
                js += '                element.id = "";\n';
                js += '            }\n';
                js += '            ids.splice(0, 1);\n';
                js += '        }\n';
            }
            js += '   };\n';
            if(isDomReady) {
                js += '    var toDispatch = document.readyState == "complete";\n';
                js += '    document.addEventListener("DOMContentLoaded", callback, false);\n';
                js += '    if(toDispatch) {\n';
                js += '        var event = document.createEvent("HTMLEvents");\n';
                js += '        event.initEvent("DOMContentLoaded", true, true);\n';
                js += '        event.eventName = "DOMContentLoaded";\n';
                js += '        callback(event);\n';
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
     * A macro method is a method returning the JS to output during the compilation.
     * A normal method will be called at the execution.
     */
    ces.addMethod = function(name, method, isMacro) {
        if(typeof isMacro === 'undefined') {
            isMacro = false;
        }
        methods[name] = new Method(name, method, isMacro);
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
        methods[name].body.apply(undefined, [selector, event]);
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
     * Create an error message from the given context.
     */
    function createErrorMessage(context, unexpected, expecting) {
        return context.url + ':' + context.lineNumber + ':' + context.columnNumber + ': Unexpected `' + unexpected + '`, expecting `' + expecting + '` on line ' + context.lineNumber + '.';
    }

    /*
     * Download the file from url, then execute callback.
     * The callback function receives the downloaded file content in its first parameter.
     */
    ces.download = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('readystatechange', function() {
            if(xhr.readyState === xhr.DONE) {
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
        if(typeof oldScriptTag !== 'undefined') {
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
     * Get or generate an id for the specified element.
     * If a new id is generated, add it to the ids array.
     */
    function getId(element, ids) {
        var id = element.id;
        if(0 === id.length) {
            id = generateId();
            ids.push(id);
            element.id = id;
        }
        return id;
    }

    /*
     * Get the next token in the source from the specified position.
     */
    function getNextToken(source, i) {
        var start;
        while(i < source.length && isWhiteSpace(source[i])) {
            ++i;
        }
        if(i === source.length) {
            return 'EOF';
        }
        if(isIdentifier(source[i])) {
            start = i;
            while(i < source.length && isIdentifier(source[i])) {
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
                if(-1 === i) {
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
                if(-1 === i) {
                    i = source.indexOf('}', start) - 1;
                    offset = 1;
                }
                break;
            case State.CONDITION_AFTER:
            case State.EVENT:
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
     * Check if a user-defined method is a macro.
     */
    function isMacroMethod(name) {
        return methods[name].isMacro;
    }

    /*
     * Check if a defined method exists by name.
     */
    function isMethod(name) {
        return Object.keys(methods).indexOf(name) !== -1;
    }

    /*
     * Check if the specified character is a new line.
     */
    function isNewLine(character) {
        return '\n' === character;
    }

    /*
     * Check if the specified character is a white space (space, new line or tab).
     */
    function isWhiteSpace(character) {
        return ' ' === character || isNewLine(character) || '\t' === character;
    }

    /*
     * Load the event sheets in the current document.
     */
    ces.load = function() {
        var scriptTags = document.getElementsByTagName('script');
        var i;
        var length = scriptTags.length;
        for(i = 0 ; i < length ; ++i) {
            if('text/ces' === scriptTags[i].type) {
                if(scriptTags[i].hasAttribute('src')) {
                    loadHandler(scriptTags[i].src, scriptTags[i].getAttribute('src'), scriptTags[i]);
                }
                else {
                    ces.execute(ces.ces2js(scriptTags[i].textContent), scriptTags[i]);
                }
            }
        }
    };

    /*
     * Download and execute a CES file.
     */
    function loadHandler(url, relativeUrl, scriptTag) {
        ces.download(url, function(source) {
            ces.execute(ces.ces2js(source, relativeUrl), scriptTag);
        });
    }

    /*
     * Parse the Cascading Event Sheet and return the resulting JavaScript source code.
     */
    function parseCES(source, url) {
        var action = new Action();
        var actions = [];
        var attribute = new Attribute();
        var char = '';
        var className = '';
        var columnNumber = 0;
        var condition = new Condition();
        var cssProperty = new CssProperty();
        var errors = [];
        var expecting = '';
        var i;
        var inCondition = false;
        var lastState = State.ROOT;
        var lineNumber = 1;
        var message = '';
        var method = null;
        var needsAttributeValue = false;
        var quote = '';
        var skipNext = false;
        var start = 0;
        var state = State.ROOT;
        var thisCondition = false;
        var token = '';

        function addAction(actionFunction, parameter) {
            if(inCondition) {
                condition[actionFunction](parameter);
            }
            else {
                action[actionFunction](parameter);
            }
        }

        function addError(expecting, newState, token) {
            var data = {};
            if('undefined' === typeof newState) {
                newState = State.BODY;
            }
            if('undefined' === typeof token) {
                token = getNextToken(source, i);
            }

            errors.push(new Error(url, lineNumber, columnNumber, token, expecting));
            data = goAfterError(source, i, state, columnNumber);
            i = data.newPos;
            columnNumber = data.column;
            lineNumber += data.newLineCount;
            state = newState;
        }

        function getContext() {
            var nextCharColumn = columnNumber;
            var nextCharLine = lineNumber;
            var position = i + 1;
            while(position < source.length && isWhiteSpace(source[position])) {
                if(isNewLine(source[position])) {
                    ++nextCharLine;
                    nextCharColumn = 0;
                }
                ++nextCharColumn;
                ++position;
            }
            ++nextCharColumn;
            return {
                columnNumber: nextCharColumn,
                lineNumber: nextCharLine,
                url: url
            };
        }

        function getEvent() {
            action.event = source.substring(start, i).trim();
            start = i + 1;
            state = State.CSS_SELECTOR;
        }

        for(i = 0 ; i < source.length ; ++i) {
            char = source[i];
            ++columnNumber;
            if('/' === char && 0 === quote.length) {
                if((i + 1 < source.length)) {
                    if('*' === source[i + 1]) {
                        lastState = state;
                        state = State.MULTILINE_COMMENT;
                        ++i;
                        continue;
                    }
                    else if('/' === source[i + 1]) {
                        lastState = state;
                        state = State.SINGLELINE_COMMENT;
                        ++i;
                        continue;
                    }
                }
            }
            switch(state) {
                case State.ATTRIBUTE_AFTER_END:
                    if(';' === char) {
                        state = State.BODY;
                    }
                    else if(!isWhiteSpace(char)) {
                        addError(';');
                    }
                    break;
                case State.ATTRIBUTE_END:
                    if(']' === char) {
                        action.addAttr(attribute);
                        attribute = new Attribute();
                        state = State.ATTRIBUTE_AFTER_END;
                    }
                    else if(!isWhiteSpace(char)) {
                        addError(']', State.ATTRIBUTE_AFTER_END);
                    }
                    break;
                case State.ATTRIBUTE_NAME:
                    if('=' === char) {
                        attribute.name = source.substring(start, i).trim();
                        start = i + 1;
                        state = State.ATTRIBUTE_VALUE_START;
                        needsAttributeValue = true;
                    }
                    else if(']' === char) {
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
                    else if('-' === char) {
                        state = State.REMOVE_ATTRIBUTE;
                        start = i + 1;
                    }
                    else if(!isWhiteSpace(char)) {
                        addError('attribute name');
                    }
                    break;
                case State.ATTRIBUTE_VALUE_START:
                    if('"' === char) {
                        state = State.ATTRIBUTE_VALUE_STRING;
                        start = i + 1;
                    }
                    else if(!isWhiteSpace(char)) {
                        addError('"attribute value"');
                    }
                    break;
                case State.ATTRIBUTE_VALUE_STRING:
                    if('"' === char && '\\' !== source[i - 1]) {
                        state = State.ATTRIBUTE_END;
                        attribute.value = source.substring(start, i).trim();
                    }
                    else if(isNewLine(char)) {
                        addError('" (quote)', State.BODY, 'end of line');
                    }
                    break;
                case State.BODY:
                    if(isLetter(char) || '-' === char) {
                        state = State.PROPERTY_NAME;
                        start = i;
                    }
                    else if('.' === char) {
                        state = State.CONDITION;
                        start = i + 1;
                    }
                    else if('[' === char) {
                        state = State.ATTRIBUTE_START;
                    }
                    else if('}' === char) {
                        if(inCondition) {
                            action.addCondition(condition);
                            condition = new Condition();
                            inCondition = false;
                        }
                        else {
                            actions.push(action);
                            action = new Action();
                            state = State.ROOT;
                        }
                        start = i + 1;
                    }
                    else if(!isWhiteSpace(char) && ';' !== char) {
                        addError('css property name or html attribute');
                    }
                    break;
                case State.CONDITION:
                    if('.' === char) {
                        if(thisCondition) {
                            condition.matchThis = true;
                            thisCondition = false;
                            start = i + 1;
                        }
                        else {
                            className = source.substring(start, i).trim();
                            if(className.length > 0) {
                                condition.addClass(source.substring(start, i).trim());
                                start = i + 1;
                            }
                        }
                    }
                    else if(isWhiteSpace(char) || '{' === char) {
                        if(start === i) {
                            addError('class name', State.CONDITION_AFTER, char);
                        }
                        else if(thisCondition) {
                            condition.matchThis = true;
                            thisCondition = false;
                            start = i;
                        }
                        else {
                            className = source.substring(start, i).trim();
                            if(className.length > 0) {
                                condition.addClass(className);
                            }
                            state = State.CONDITION_AFTER;
                        }
                        if('{' === char) {
                            --i;
                        }
                    }
                    break;
                case State.CONDITION_AFTER:
                    if('{' === char) {
                        state = State.BODY;
                        inCondition = true;
                    }
                    else if(!isWhiteSpace(char)) {
                        addError('{');
                        inCondition = true;
                    }
                    break;
                case State.CSS_SELECTOR:
                    if(('\'' === char || '"' === char)) {
                        if(quote.length === 0) {
                            quote = char;
                        }
                        else {
                            quote = '';
                        }
                    }
                    else if(0 === quote.length && '{' === char) {
                        action.cssSelector = replaceNewLines(source.substring(start, i)).trim();
                        state = State.BODY;
                    }
                    else if(0 === quote.length && '}' === char) {
                        addError('{', State.ROOT);
                    }
                    break;
                case State.EVENT:
                    if('{' === char) {
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
                    if(('\'' === char || '"' === char)) {
                        if(quote.length === 0) {
                            quote = char;
                        }
                        else {
                            quote = '';
                        }
                    }
                    else if(quote.length === 0 && '$' === char) {
                        action.eventSelector = replaceNewLines(source.substring(start, i)).trim();
                        start = i + 1;
                        state = State.EVENT;
                    }
                    else if(quote.length === 0 && ('{' === char || '}' === char)) {
                        addError('$event');
                    }
                    break;
                case State.MULTILINE_COMMENT:
                    if(('*' === char) && (i + 1 < source.length) && '/' === source[i + 1]) {
                        state = lastState;
                        start = i + 2;
                        ++i;
                    }
                    break;
                case State.PROPERTY_NAME:
                    token = source.substring(start, i).trim();
                    if(':' === char) {
                        if(isMethod(token)) {
                            method = new JsMethod(token);
                            method.context = getContext();
                        }
                        else {
                            cssProperty.name = token;
                        }
                        state = State.PROPERTY_VALUE;
                        start = i + 1;
                    }
                    else if(0 === quote.length && char.match(/[ .{]/) && 'this' === source.substring(start, i).trim()) {
                        state = State.CONDITION;
                        thisCondition = true;
                        --i;
                    }
                    else if(';' === char && isMethod(token)) {
                        method = new JsMethod(token);
                        method.context = getContext();
                        action.addMethod(method);
                        method = null;
                        state = State.BODY;
                    }
                    else if(!isIdentifier(char) && !isWhiteSpace(char)) {
                        addError(':');
                        if(';' !== source[i]) {
                            state = State.PROPERTY_VALUE;
                        }
                    }
                    break;
                case State.PROPERTY_VALUE:
                    if('\\' === char && 0 !== quote.length) {
                        skipNext = !skipNext;
                    }
                    else if(!skipNext && ('\'' === char || '"' === char)) {
                        if(quote.length === 0) {
                            quote = char;
                        }
                        else {
                            quote = '';
                        }
                    }
                    else if(0 === quote.length && ';' === char) {
                        if(method !== null) {
                            method.parameter = source.substring(start, i).trim();
                            /*action.addMethod(method);*/
                            addAction('addMethod', method);
                            method = null;
                        }
                        else if(cssProperty.name.length > 0) {
                            cssProperty.value = source.substring(start, i).trim();
                            /*action.addCss(cssProperty);*/
                            addAction('addCss', cssProperty);
                            cssProperty = new CssProperty();
                        }
                        state = State.BODY;
                    }
                    else if(0 === quote.length && (']' === char || '[' === char || '{' === char || '}' === char)) {
                        addError(';');
                        if(';' !== source[i]) {
                            state = State.ROOT;
                            ++i;
                        }
                    }
                    else {
                        skipNext = false;
                    }
                    break;
                case State.REMOVE_ATTRIBUTE:
                    if(']' === char) {
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
                    if(isLetter(char) || '#' === char || '.' === char) {
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

        if(State.ROOT !== state) {
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
            message = errors.map(function(error) {
                return createErrorMessage(error, error.unexpected, error.expecting);
            }).join('\n');
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
                    if('=' === char) {
                        tokens.push(selector.substring(start, i));
                        state = SelectorState.ATTRIBUTE_VALUE;
                        tokens.push(char);
                        start = i + 1;
                    }
                    break;
                case SelectorState.ATTRIBUTE_VALUE:
                    if(']' === char) {
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
                    if('.' === char) {
                        start = i;
                        state = SelectorState.CLASS;
                    }
                    else if('#' === char) {
                        start = i;
                        state = SelectorState.ID;
                    }
                    else if('[' === char) {
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
     * It also support the :parent token to select the parent of the current element.
     * In case the element does not have an ID, it should be manually removed after it is not needed anymore (with the information returned in the ids parameter).
     * The ids paramater is an array of the element's id which need to remove its id.
     */
    ces.processSelector = function(selector, eventTarget, ids) {
        var delta;
        var element;
        var i;
        var id;
        var index;
        var tokenCountToDelete;
        var tokens = parseSelector(selector);
        var toUpdate = -1 !== tokens.indexOf('this');
        if(toUpdate) {
            while(-1 !== (index = tokens.indexOf('this'))) {
                delta = 1;
                tokenCountToDelete = 0;
                element = eventTarget;
                while(index + delta + 1 < tokens.length && ':' === tokens[index + delta] && 'parent' === tokens[index + delta + 1]) {
                    tokenCountToDelete += 2;
                    element = element.parentNode;
                    delta += 2;
                }
                id = getId(element, ids);

                tokens[index] = '#' + id;

                for(i = 1 ; i <= tokenCountToDelete ; ++i) {
                    tokens[index + i] = '';
                }
            }
            selector = tokens.join('');
        }
        return selector;
    };

    /*
     * Replace new lines by space.
     */
    function replaceNewLines(string) {
        return string.replace(/\n/gm, ' ');
    }

    /*
     * Get the values of an object as an array.
     */
    ces.toArray = function(object) {
        var array = [];
        var index;
        for(index in object) {
            if(object.hasOwnProperty(index)) {
                array.push(object[index]);
            }
        }
        return array;
    };

    /*
     * Validate a string literal.
     */
    function validateStringLiteral(string, context) {
        var char;
        var end = false;
        var i;
        var skipNext = false;
        if('"' !== string[0]) {
            throw createErrorMessage(context, getNextToken(string, 0), '"');
        }
        for(i = 1 ; i < string.length ; ++i) {
            char = string[i];
            if('\\' === char) {
                skipNext = !skipNext;
            }
            else if(!skipNext && '"' === char) {
                end = true;
            }
            else if(!end && isNewLine(char)) {
                context.columnNumber += i;
                throw createErrorMessage(context, 'newline', '"');
            }
            else if(end && !isWhiteSpace(char)) {
                context.columnNumber += i;
                throw createErrorMessage(context, getNextToken(string, i), ';');
            }
            else {
                skipNext = false;
            }
        }
    }

    /*
     * Add built-in methods.
     */
    /*
     * Give the focus to the selected element.
     */
    ces.addMethod('focus', function(selector) {
        selector.focus();
    });

    /*
     * Prevent the default action on the selected element.
     */
    ces.addMethod('prevent', function() {
        return 'event.preventDefault();\n';
    }, true);

    /*
     * Scroll to the selected element.
     */
    ces.addMethod('scroll', function(selector) {
        selector.scrollIntoView();
    });

    /*
     * Change the text content of the selected element.
     */
    ces.addMethod('text', function(selector, text, context) {
        if('+=' === text.substr(0, 2)) {
            validateStringLiteral(text.substr(2).trim(), context);
            return selector + '.textContent ' + text + ';\n';
        }
        else if('=+' === text.substr(0, 2)) {
            validateStringLiteral(text.substr(2).trim(), context);
            return selector + '.textContent = ' + text.substr(2).trim() + ' + ' + selector + '.textContent;\n';
        }
        else {
            validateStringLiteral(text.trim(), context);
            return selector + '.textContent = ' + text + ';\n';
        }
    }, true);

    /*
     * Change the text content of the selected element.
     */
    ces.addMethod('html', function(selector, html, context) {
        if('+=' === html.substr(0, 2)) {
            validateStringLiteral(html.substr(2).trim(), context);
            return selector + '.innerHTML ' + html + ';\n';
        }
        else if('=+' == html.substr(0, 2)) {
            validateStringLiteral(html.substr(2).trim(), context);
            return selector + '.innerHTML = ' + html.substr(2).trim() + ' + ' + selector + '.innerHTML;\n';
        }
        else {
            validateStringLiteral(html.trim(), context);
            return selector + '.innerHTML = ' + html + ';\n';
        }
    }, true);

    /*
     * Add, remove and/or toggle CSS classes of the selected element.
     */
    ces.addMethod('class', function(selector, classes, context) {
        var char;
        var classAction = 'add';
        var columnNumber = context.columnNumber;
        var end;
        var hasAction = false;
        var i;
        var js = '';
        var lineNumber = context.lineNumber;
        var name;
        var start = 0;

        for(i = 0 ; i < classes.length ; ++i) {
            end = classes.length - 1 === i;
            char = classes[i];
            if(!hasAction && '-' === char) {
                classAction = 'remove';
                start = i + 1;
                hasAction = true;
            }
            else if(!hasAction && '+' === char) {
                classAction = 'add';
                start = i + 1;
                hasAction = true;
            }
            else if(!hasAction && '!' === char) {
                classAction = 'toggle';
                start = i + 1;
                hasAction = true;
            }
            else if(isWhiteSpace(char) || end) {
                if(end) {
                    ++i;
                }
                name = classes.substring(start, i).trim();

                js += selector + '.classList.' + classAction + '("' + name + '");\n';
                classAction = 'add';
                hasAction = false;
            }
            else if(!isIdentifier(char) && '!' !== char && '-' !== char && '+' !== char) {
                context.columnNumber = columnNumber;
                context.lineNumber = lineNumber;
                throw createErrorMessage(context, char, 'class name');
            }
            if(isNewLine(char)) {
                columnNumber = 0;
                ++lineNumber;
            }
            ++columnNumber;
        }

        return js;
    }, true);

    /*
     * Redirect to another url.
     */
    ces.addMethod('redirect', function(selector, url, context) {
        url = url.trim();
        validateStringLiteral(url, context);
        return 'location.href = "' + url.substr(1, url.length - 2) + '";\n';
    }, true);

    /*
     * Wrap the element with the specified html structure.
     */
    ces.addMethod('wrap', function(selector, html) {
        var element = document.createElement('div');
        element.innerHTML = html;
        var newElement = element.childNodes[0];
        var target = newElement;
        while(target.childNodes.length > 0) {
            target = target.childNodes[0];
        }

        selector.parentNode.replaceChild(newElement, selector);
        target.appendChild(selector);
    });

    /*
     * Wrap the inner html of the element with the specified html structure.
     */
    ces.addMethod('wrapInner', function(selector, html) {
        var child;
        var element = document.createElement('div');
        element.innerHTML = html;
        var newElement = element.childNodes[0];
        var target = newElement;
        while(target.childNodes.length > 0) {
            target = target.childNodes[0];
        }

        while(selector.childNodes.length > 0) {
            child = selector.removeChild(selector.childNodes[0]);
            target.appendChild(child);
        }

        selector.appendChild(newElement);
    });

}(window.ces = window.ces || {}));

window.addEventListener('load', window.ces.load, false);
