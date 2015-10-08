var config = require('../../../config');
module.exports = {
    permissions: config.acl.permissions,
    defaults: config.acl.defaults,
    getRootPermission: function(){
        var rootPerm = this.defaults;
        for(var i = 0; i < rootPerm.length; i++){
            rootPerm[i] = 1;
        }
        return rootPerm;
    },
    getUserPermission: function(req, res, next){
        var store_id = req.url.split('/')[1];
        store_id = store_id.split('?')[0];
        if(!store_id){
            return next();
        }
        if(!req.user){
            return next();
        }
        var dsSystemController = require('./controller')
        ,   tblMerchant = dsSystemController.prototype.getModel('merchant')
        ,   self = require('../index').acl;
        req.user.permission = {};
        tblMerchant.fetchRow({key: 'tm_id', value: store_id},function(err, objStore) {
            if(err || !objStore){
                return next();
            }
            if(objStore.tm_user_id == req.user.tu_id){
                req.user.permission = self.getRootPermission();
                return next();
            }

            if( !objStore.tm_permissions || !objStore.tm_permissions instanceof Array){
                return next();
            }
            
            for(var i=0; i<objStore.tm_permissions.length; i++){
                if(objStore.tm_permissions[i].tu_name == req.user.tu_name){
                    req.user.permission = objStore.tm_permissions[i].values;
                    break;
                }
            }
            next();
        });
    }
};


