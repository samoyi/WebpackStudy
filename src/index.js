import {cube} from './math.js';


function component() {
    let element = document.createElement('pre');

    element.innerHTML = [
        'Hello webpack!',
        '5 cubed is equal to ' + cube(5)
    ].join('\n\n');

    return element;
}

document.body.appendChild(component());


if (module.hot) {
    module.hot.accept('./math.js', function() {
        console.log('Accepting the updated printMe module!');
        document.body.appendChild(component());
    })
}
