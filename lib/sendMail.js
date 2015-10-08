'use strict';
var config = require('../../../config');

module.exports = {
    sendError:  function(strSubject, strBody) {
        var email 	= require("emailjs/email.js");
        var server 	= email.server.connect(config.email.server);

        server.send({
            text:    strBody,
            from:    config.email.from,
            to:      config.system.developers.join(','),
            cc:      '',
            subject: 'TAPLY Developers: ' + strSubject
         }, function(err, message) { });
    },

    send:  function(strTo, strSubject, strBody) {
        var email 	= require("emailjs/email.js");
        var server 	= email.server.connect(config.email.server);

        server.send({
            text:    strBody,
            from:    config.email.from,
            to:      strTo,
            cc:      '',
            subject: 'TAPLY Developers: ' + strSubject
         }, function(err, message) { });
    }
};