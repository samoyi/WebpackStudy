
async function getComponent() {
    var element = document.createElement('div');
    // const lodash = await import(/* webpackChunkName: "lodash" */ 'lodash');
    const lodash = await import(/* webpackPrefetch: true */ 'lodash');
    const _ = lodash.default;

    element.innerHTML = _.join(['Hello', 'webpack！！@'], ' ');

    return element;
}

getComponent().then(component => {
    document.body.appendChild(component);
});
