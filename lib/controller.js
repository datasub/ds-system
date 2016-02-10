var locomotive = require('locomotive');
//var appDir = path.dirname(require.main.filename);
var config = locomotive.config;

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

function check(old, n, labels, old_data, new_data){
    var objectMerge = require('object-merge');
    if(!labels){
        labels = {};
    }
    var res = true;
    if(typeof old === 'object' || typeof n === 'object'){
        if(!old){
            old = {};
        }
        if (!n){
            n = {};
        }
        var indexes =  Object.keys( objectMerge(old,n) );
        for(var i=0; i < indexes.length; i++){
            var k=indexes[i]
            ,   field = labels[k]? labels[k] : k;
            old_data[field] = {};
            new_data[field] = {};
            if(!check(old[k], n[k], labels, old_data[field], new_data[field])){
                if( typeof old[k] !== 'object'){
                    old_data[field] = (typeof old[k] === 'undefined')? " " : (labels && labels[old[k]]? labels[old[k]] : old[k]);
                }
                if( typeof n[k] !== 'object'){
                    new_data[field] = (typeof n[k] === 'undefined')? " " : (labels && labels[n[k]]? labels[n[k]] : n[k]);
                }
                res = false;
            }else{ 
                delete old_data[field];
                delete new_data[field];
            }
        }
    }else{
        res = (old === n);
        if(!res){
            old_data = labels && labels[old]? labels[old] : old;
            new_data = labels && labels[n]? labels[n] : n;
        }
    }
    return res;
}
function isDate(val) {
    var d = new Date(val);
    return !isNaN(d.valueOf());
}
dsSystemController.prototype._updateCallback = function(tblForUpdate, params, callback){
    var self = this;
    var dateFormat = require('dateformat');
    callback = callback? callback :
        function(err){
            if(err){
                self.response.status(501).json({error: err});
            }else{
                self.response.json({status: 'success'});
            }
        };
    if(!self.changes){
        self.changes = [];
    }
    if(config.log){
         if(params['id'] || params[tblForUpdate.primaryKey]){
             tblForUpdate._getModel().get(params['id']? params['id'] : params[tblForUpdate.primaryKey])
                .then(function(row){
                    for(var field in tblForUpdate.schema){
                        if(field != tblForUpdate.primaryKey && (row[field] !== undefined || params[field]) && !tblForUpdate.schema[field].noLoged ){
                            if(tblForUpdate.schema[field].type === Date && isDate(params[field])){
                                row[field] = dateFormat(row[field], "mm/dd/yyyy");
                                params[field] = dateFormat(params[field], "mm/dd/yyyy");
                            }
                            var old_data = {}, new_data = {}, l = tblForUpdate.schema[field].labels;
                            try {
                                if(!check(row[field], params[field], l, old_data, new_data)){
                                    var old_data = row[field] instanceof Object ? old_data : l && l[row[field]]? l[row[field]] : row[field]
                                    ,   new_data = params[field] instanceof Object ? new_data : l && l[params[field]]? l[params[field]] : params[field]
                                    ,   old_data_type = typeof old_data
                                    ,   new_data_type = typeof new_data;
                                    self.changes.push({tbl: tblForUpdate.tableName, field: field, label: tblForUpdate.schema[field].label || field, old_data_type: old_data_type, old_data: old_data, new_data_type: new_data_type, new_data: new_data });
                                }
                            } catch(e){
                                console.log(e);
                            }
                        }
                        if(params[field] !== undefined && params[field] !== null){
                            row[field] = params[field];
                        }
                    }
                    row.save(callback);
                });
         }else{
             for(var field in tblForUpdate.schema){
                 if(params[field]){
                    var type = typeof params[field];
                    var old_data = {}, new_data = {}
                    if(type === 'object' && tblForUpdate.schema[field].labels){
                        check(undefined, params[field], tblForUpdate.schema[field].labels, old_data, new_data);
                    }else{
                        new_data = tblForUpdate.schema[field].labels && tblForUpdate.schema[field].labels[params[field]]? tblForUpdate.schema[field].labels[params[field]] : params[field];
                    }
                    self.changes.push({tbl: tblForUpdate.tableName, field: field, label: tblForUpdate.schema[field].label || field, new_data: new_data, new_data_type: type});
                }
             }
             tblForUpdate.fetchNew(params, callback);
         };
    }else{  
        tblForUpdate.update(params, callback);
    }
};

dsSystemController.prototype.after ('*', function(next) {
    this.log();
    next();
});

module.exports = dsSystemController;

