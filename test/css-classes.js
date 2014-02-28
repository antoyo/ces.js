asyncTest('CSS Classes', function() {
    expect(7);

    ces.download('test3.ces', function(source) {
        var body = document.querySelector('#qunit-fixture');

        var showButton = document.createElement('button');
        showButton.id = 'show';
        showButton.textContent = 'Show';
        body.appendChild(showButton);

        var removeButton = document.createElement('button');
        removeButton.id = 'remove';
        removeButton.textContent = 'Remove';
        body.appendChild(removeButton);

        var toggleButton = document.createElement('button');
        toggleButton.id = 'toggle';
        toggleButton.textContent = 'Toggle';
        body.appendChild(toggleButton);

        var addButton = document.createElement('button');
        addButton.id = 'add';
        addButton.textContent = 'Add';
        body.appendChild(addButton);

        var changeButton = document.createElement('button');
        changeButton.id = 'change';
        changeButton.textContent = 'Change';
        body.appendChild(changeButton);

        var text = document.createElement('p');
        text.id = 'text';
        body.appendChild(text);

        var js = ces.ces2js(source, 'test3.ces');
        ces.execute(js);

        equal(showButton.classList.length, 0, 'Class list is empty.');

        trigger(showButton, 'click');

        equal(showButton.classList.length, 1, 'Class list is not empty.');
        equal(showButton.classList[0], 'blue', 'Class blue is set.');

        trigger(removeButton, 'click');

        equal(showButton.classList.length, 0, 'Class list is empty.');

        trigger(toggleButton, 'click');

        equal(showButton.classList.length, 1, 'Class list is not empty.');
        equal(showButton.classList[0], 'blue', 'Class blue is set.');

        trigger(toggleButton, 'click');

        equal(showButton.classList.length, 0, 'Class list is empty.');

        start();
    });
});
