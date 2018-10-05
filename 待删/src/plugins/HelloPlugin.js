function HelloPlugin(options) {
    // Setup the plugin instance with options...
}

HelloPlugin.prototype.apply = compiler => {
    compiler.hooks.run.tap('HelloPlugin', compiler => {
        console.log('Hello run!');
    });
    compiler.hooks.done.tap('HelloPlugin', compiler => {
        console.log('Hello done!');
    });
};

module.exports = HelloPlugin;


// function HelloCompilationPlugin(options) {}
//
// HelloCompilationPlugin.prototype.apply = function(compiler) {
//     // Setup callback for accessing a compilation:
//     compiler.hooks.compilation.tap('HelloCompilationPlugin', compilation => {
//         console.log('compilation!');
//         // Now setup callbacks for accessing compilation steps:
//         compilation.hooks.optimize.tap('HelloCompilationPlugin', compilation => {
//             console.log("Assets are being optimized.");
//         });
//     });
// };
//
// module.exports = HelloCompilationPlugin;
