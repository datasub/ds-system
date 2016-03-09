var controller = require(__dirname + '/controller');

var Analitics = function(){
    this.getAnaliticTbl = function(){
        if(this.tblAnalitic){
            return this.tblAnalitic;
        }
        return this.tblAnalitic = this.getModel('analitics');
    };
    this.track = function(type, req){
        var host = req.headers.referrer || req.headers.referer; //req.get('host');
        if(!host){
            host = 'unknown';
        }
        console.log('track host: ' + host);
        var self = this;
        var k = "a_" + type;
        this.getAnaliticTbl().fetchRow(host).then(function(objAnalitic){
            if(!objAnalitic){
                row = {a_host: host};
                row[k] = 1;
                self.getAnaliticTbl().fetchNew(row);
            }
            objAnalitic[k]? ++objAnalitic[k] : objAnalitic[k] = 1;
            objAnalitic.save();
        });
        this.getAnaliticTbl().fetchRow('all').then(function(objAnalitic){
            if(!objAnalitic){
                row = {a_host: 'all'};
                row[k] = 1;
                self.getAnaliticTbl().fetchNew(row);
            }
            objAnalitic[k]? ++objAnalitic[k] : objAnalitic[k] = 1;
            objAnalitic.save();
        });
    };
};
Analitics.prototype = new controller();
var objAnalitics = objAnalitics || new Analitics();
module.exports = objAnalitics;


