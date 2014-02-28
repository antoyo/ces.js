function trigger(element, eventName) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, true, true);
    event.eventName = eventName;
    element.dispatchEvent(event);
}
