module.exports = {
    apiUrl: 'https://android.googleapis.com/gcm/send',
    apiAccessKey: '',
    push: function(params){   
        var P = require('bluebird')
        ,   request = require('request')
        ,   post = P.promisify(request.post)
        ,   self = this;
        if(!params || !params['token'] || !params['message']){
            return;
        }
        return post(this.apiUrl, {
            headers: {
                'Authorization': 'key=' + self.apiAccessKey,
                'Content-Type': 'application/json'
            },
            form: {
                'registration_ids': [params['token']],
                'data': params['message']
            }
        });
    }
};

