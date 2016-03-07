'use strict';

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

var dsSystem = {
    Model: require('./lib/model'),
    Controller: require('./lib/controller'),
    AppleService: require('./lib/apple-service'),
    AndroidService: require('./lib/android-service'),
    ErrorHandler: require('./lib/errorHandler'),
//    getUserPermission: require('./lib/getUserPermission'),
    acl: require('./lib/acl'),
    mail: require('./lib/sendMail'),
    analitics: require('./lib/analitics')
};

module.exports = dsSystem;