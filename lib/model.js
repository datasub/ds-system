var locomotive = require('locomotive'),
    uuid = require('node-uuid');

var dsSystemModel = function(options){
//    this.types = require('joi');
    this.__construct(options);

};
dsSystemModel.prototype = {
    tableName: '',
    primaryKey: 'id',
    adapter: locomotive.Db,
    _model: null,
//    _initialyzed: false,
    schema: {},
    __construct: function(options){
        this.options = {
            create: true, // Create table in DB, if it does not exist
            waitForActive: true, // Wait for table to be created before trying to us it
            waitForActiveTimeout: 180000 // wait 3 minutes for table to activate
        };
        if(undefined !== options){
            this.options.concat(options);
        }
//        if(this._initialyzed){
//            this._model = this.getModel();
//        }
//        this._initialyzed = true;
    },
    createTable: function(){
        var objModel = this._getModel();
        if(!objModel){
            throw new Error("Model cant be create");
        }

    },
    getUuid: function(){
        return uuid.v4();
    },
    _getModel: function(){
        if (this.tableName.length < 1){
            throw new Error("Table Name not initialized");
        }
        if (this.schema.length < 1){
            throw new Error("Model Shema not initialized");
        }
        var e = locomotive;
        if(null === this._model){
            if(undefined === this.schema['created_at']){
                this.schema['created_at'] = {
                    type: Date,
                    default: Date.now,
                    get: function(val){
                        if(typeof val === 'undefined'){
                            return val;
                        }
                        if(val && val.getTime){
                            val.setTime(val.getTime() - (e.timeZoneOffset? e.timeZoneOffset * 60000 : 0) );
                        }
                        return val;
                    }
                };
            }
            if(undefined === this.schema['updated_at']){
                this.schema['updated_at'] = {
                    type: Date,
                    default:  Date.now,
                    get: function(val){
                        if(typeof val === 'undefined'){
                            return val;
                        }
                        if(val && val.getTime){
                            val.setTime(val.getTime() - (e.timeZoneOffset? e.timeZoneOffset * 60000 : 0) );
                        }
                        return val;
                    }
                };
            }
//            console.log("TBL_NAME: " + this.tableName);
            if(!this.schema instanceof  this.adapter.Schema){
                this.schema = new this.adapter.Schema(this.schema);
            }
            this._model = this.adapter.model(this.tableName, this.schema);//, {throughput: this.throughput || {read: 500, write: 100} }), this.options);
        }
        return this._model;
    },
    _getUUID: function(){
        return uuid.v4();
    },
    _randomInt: function (low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    },
    fetchRow: function(params, callback){
        var objModel = this._getModel();
//        objModel.query(params.key).eq(params.value).exec(callback);
        if( typeof params === 'string' || parseInt(params) ){
            return callback? objModel.get(params).then(function(l){callback(null, l)}) : objModel.get(params);
        }
        objModel.queryOne(params.key).eq(params.value).exec(callback);
    },
    fetchAll: function(params, callback){
        var objModel = this._getModel()
        ,   self = this;
        
        if(params.key){
            return objModel.query(params.key).eq(params.value).exec(callback);
        }else if(params instanceof Array){
            var arrKeys = [];
            params.forEach(function(val){
                var key = {};
                key[self.primaryKey] = val;
                arrKeys.push(key);
            });
            return callback? objModel.batchGet(arrKeys, callback) : objModel.batchGet(arrKeys);
        }
        callback("incorrect params", null);
    },
    fetchNew: function(rowSet, callback){
        var objModel = this._getModel();
        if (undefined === rowSet[this.primaryKey]){
            rowSet[this.primaryKey] = this._getUUID();
        }
//        rowSet['updated_at'] = Date.now();
        var row = new objModel(rowSet);
        return row.save(callback);
    },
    scan: function(filter, options, next){
        return this._getModel().scan(filter, options, next);
    },

    query: function(filter, options, next){
        return this._getModel().query(filter, options, next);
    },

    'delete': function(key, options, callback){
        return this._getModel().delete(key, options, callback);
    },

    'sort':  function(arrObj, key, dir) {
        dir = dir || 'asc';
        arrObj.sort(function(a, b) {
            var x = a[key];
            var y = b[key];
            if(dir === 'desc'){
                return ((x < y) ? 1 : ((x > y) ? -1 : 0));
            }else{
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }
        });
        return arrObj;
    },
    getNewRow: function(){
        var objModel = this._getModel();
        return new objModel();
    },
    update: function(params, callback){
        var objModel = this._getModel();
        
        params.updated_at = Date.now();
        if(params['id'] || params[this.primaryKey]){
            p={}; p[this.primaryKey] = params['id'] || params[this.primaryKey];
            delete params[this.primaryKey];
            return objModel.update(p, params, callback);
        }else{
            return this.fetchNew(params, callback);
        }
    }
    
};

module.exports = dsSystemModel;
