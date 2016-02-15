module.exports = {
    push: function(params){
        var P = require('bluebird')
        ,   resolver = P.pending();
        
        if(!params || !params['token'] || !params['message']){
            return;
        }
        var apn = require('apn'),
            options = {   
                cert: params['cert'],
                key:params['key'],
                debug : false,
                production: true,
                "batchFeedback": true,
                "interval": 300
            },
            apnConnection = new apn.Connection(options),
            myDevice = new apn.Device(params['token']),
            note = new apn.Notification();
        
        note.expiry = Math.floor(Date.now() / 1000) + 3600;
        note.badge = params['badge'] || 0;
        note.sound = params['sound'] || 'default';
        note.alert = params['message'];
        if( params['transId']){
            note.payload = {'transId': params['transId']};
        }
        apnConnection.pushNotification(note, myDevice);


        var feedback = new apn.Feedback(options);
        feedback.on("feedback", function(devices) {
            if(devices.length === 0){
                resolver.resolve(false);
                return;
            }
            devices.forEach(function(item) {

            });
            resolver.resolve(true);
        });
        
        return resolver.promise;
    }
};

