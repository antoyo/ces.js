asyncTest('CSS Classes', function() {
    expect(28);

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
        text.classList.add('backred');
        text.classList.add('big');
        body.appendChild(text);

        var js = ces.ces2js(source, 'test3.ces');
        ces.execute(js);

        equal(showButton.classList.length, 0, 'Class list is empty.');
        ok(!showButton.classList.contains('blue'), 'Class blue is not set.');

        trigger(showButton, 'click');

        equal(showButton.classList.length, 1, 'Class list contains 1 element.');
        ok(showButton.classList.contains('blue'), 'Class blue is set.');

        trigger(removeButton, 'click');

        equal(showButton.classList.length, 0, 'Class list is empty.');
        ok(!showButton.classList.contains('blue'), 'Class blue is not set.');

        trigger(toggleButton, 'click');

        equal(showButton.classList.length, 1, 'Class list contains 1 element.');
        ok(showButton.classList.contains('blue'), 'Class blue is set.');

        trigger(toggleButton, 'click');

        equal(showButton.classList.length, 0, 'Class list is empty.');
        ok(!showButton.classList.contains('blue'), 'Class blue is not set.');

        equal(text.classList.length, 2, 'Class list contains 2 elements.');
        ok(text.classList.contains('backred'), 'Class backred is set.');
        ok(text.classList.contains('big'), 'Class big is set.');
        ok(!text.classList.contains('underline'), 'Class underline is not set.');

        trigger(addButton, 'click');

        equal(text.classList.length, 1, 'Class list contains 1 element.');
        ok(!text.classList.contains('backred'), 'Class backred is not set.');
        ok(!text.classList.contains('big'), 'Class big is not set.');
        ok(text.classList.contains('underline'), 'Class underline is set.');

        trigger(changeButton, 'click');

        equal(text.classList.length, 3, 'Class list contains 3 elements.');
        ok(text.classList.contains('backred'), 'Class backred is set.');
        ok(text.classList.contains('big'), 'Class big is set.');
        ok(text.classList.contains('italic'), 'Class italic is set.');
        ok(!text.classList.contains('underline'), 'Class underline is not set.');

        trigger(changeButton, 'click');

        equal(text.classList.length, 2, 'Class list contains 2 elements.');
        ok(text.classList.contains('backred'), 'Class backred is set.');
        ok(text.classList.contains('big'), 'Class big is set.');
        ok(!text.classList.contains('italic'), 'Class italic is not set.');
        ok(!text.classList.contains('underline'), 'Class underline is not set.');

        start();
    });
});
