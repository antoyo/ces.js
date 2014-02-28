asyncTest('HTML Attributes', function() {
    expect(2);

    ces.download('test2.ces', function(source) {
        var body = document.querySelector('#qunit-fixture');

        var button2 = document.createElement('button');
        button2.id = 'button2';
        button2.textContent = 'Disable';
        body.appendChild(button2);

        var enableButton = document.createElement('button');
        enableButton.id = 'enableButton';
        enableButton.textContent = 'Enable';
        body.appendChild(enableButton);

        var textInput = document.createElement('input');
        textInput.id = 'textInput';
        body.appendChild(textInput);

        var js = ces.ces2js(source, 'test2.ces');
        ces.execute(js);

        equal(button2.disabled, false, 'HTML attribute disabled is not set.');

        trigger(button2, 'click');

        equal(button2.disabled, true, 'HTML attribute disabled is set.');

        start();
    });
});
