
module.exports = function(req, res, next){
        var store_id = req.url.split('/')[1];
        store_id = store_id.split('?')[0];
        if(!store_id){
            return next();
        }
        if(!req.user){
            return next();
        }
//        var tblUserStore = require('../../../app/models/userStoreModel');
        var dsSystemController = require('dsSystemController')
        ,   tblStore = dsSystemController.getModel('merchant');
        req.user.permission = {};
        tblStore.fetchRow({key: 'tm_id', value: store_id},function(err, objStore) {
            if(err || !objStore){
                return next();
            }
            if(objStore.tm_user_id == req.user.tu_id){
                req.user.permission
            }

            if( !objStore.tm_permission || !objStore.tm_permission instanceof Array){
                return next();
            }
            
            for(var i=0; i<objStore.tm_permission.length; i++){
                if(objStore.tm_permission[i].id == req.user.tu_id){
                    req.user.permission = objStore.tm_permission[i].values;
                    break;
                }
            }
            next();
        });
    };


