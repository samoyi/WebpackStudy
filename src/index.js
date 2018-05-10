import _ from 'lodash';
import './another';
import './style.css';
import Icon from './assets/icon.jpg';
console.log(Icon);
console.log(typeof Icon);
function component() {
    let element = document.createElement('div');

    element.innerHTML = _.join(['index', 'module'], ' ');
    element.classList.add('index');

    // let myIcon = new Image();
    // myIcon.src = './assets/icon.jpg';
    // // myIcon.src = Icon;
    // element.appendChild(myIcon);

    return element;
}

document.body.appendChild(component());

console.log(document.querySelector('.another')); // 冲突 获取了其他模块的内容
