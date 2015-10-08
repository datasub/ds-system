var locomotive = require('locomotive');

var dsSystemController = function(){};

dsSystemController.prototype = new locomotive.Controller();

dsSystemController.prototype.getModel = function(name){
    if(undefined === name){
        name = this.__id;
    }
    if(undefined === this.__models){
        this.__models = [];
    }
    if(undefined === this.__models[name]){
        var scripts = require('scripts'), path = require('path');
        var script = scripts.resolve(path.resolve('app/models/' + name + 'Model'), 'js');
        var model = require(script);
//        console.log(model);
        this.__models[name] = model;
    }

    return this.__models[name];
}

dsSystemController.prototype.sendError = function(code, descr){
    this.response.status(404).json({
        status: "error",
        errors:[
            {
                error_code: code,
                error_message: descr
            }
        ]
    });
};

/**
 * Expose `Controller`.
 */
module.exports = dsSystemController;

