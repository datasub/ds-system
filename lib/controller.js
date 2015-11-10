var locomotive = require('locomotive');
//var appDir = path.dirname(require.main.filename);
var config = require.main.require(process.cwd() + '/config');

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
};

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

dsSystemController.prototype.getLogModel = function(){
    if(!this.logModel){
        this.logModel = this.getModel('logs');
    }
    return this.logModel;
};

dsSystemController.prototype.log = function(){
    
    if(!config.log){
         return;
    }
    
    console.log(this.__action);
    if(!this.logedActions){
        return;
    }
    if(!this.logedActions[this.__action]){
        return;
    }
    
    this.getLogModel().log(this);
};

dsSystemController.prototype.after ('*', function(next) {
    this.log();
    next();
});

module.exports = dsSystemController;

