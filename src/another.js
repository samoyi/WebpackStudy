
import './another.css';

function component() {
    let element = document.createElement('div');

    element.innerHTML = 'another module';
    element.classList.add('another');

    return element;
}

document.body.appendChild(component());

export {};
