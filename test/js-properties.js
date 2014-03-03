asyncTest('JS Properties', function() {
    expect(4);

    ces.download('test.ces', function(source) {
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
});
