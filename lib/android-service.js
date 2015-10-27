module.exports = {
    apiUrl: 'https://android.googleapis.com/gcm/send',
    apiAccessKey: 'AIzaSyADoTgX_aiYcPzfXVXSOd4xoKLJpFTwsn4',
    senderId: 82478686452,
    push: function(params){   
        var P = require('bluebird')
        ,   request = require('request')
        ,   post = P.promisify(request.post)
        ,   self = this;
        if(!params || !params['token'] || !params['message']){
            return;
        }
        console.log(params['token']);
        return post(this.apiUrl, {
            headers: {
                'Authorization': 'key=' + self.apiAccessKey,
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                'registration_ids': [params['token']],
                'data': params['message']
            })
        }).then(function (resp){
//            console.log(resp);
        });
    }
};
