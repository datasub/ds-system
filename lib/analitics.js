var controller = require(__dirname + '/controller');

var Analitics = function(){
    this.getAnaliticTbl = function(){
        if(this.tblAnalitic){
            return this.tblAnalitic;
        }
        return this.tblAnalitic = this.getModel('analitics');
    };
    this.track = function(type, req){
        var host = req.get('host');
        var self = this;
        this.getAnaliticTbl().fetchRow(host).then(function(objAnalitic){
            if(!objAnalitic){
                row = {a_host: host};
                row["a_" + type] = 1;
                self.getAnaliticTbl().fetchNew(row);
            }
            objAnalitic[type]? ++objAnalitic[type] : objAnalitic[type] = 1;
            objAnalitic.save();
        });
        this.getAnaliticTbl().fetchRow('all').then(function(objAnalitic){
            if(!objAnalitic){
                row = {a_host: 'all'};
                row["a_" + type] = 1;
                self.getAnaliticTbl().fetchNew(row);
            }
            objAnalitic[type]? ++objAnalitic[type] : objAnalitic[type] = 1;
            objAnalitic.save();
        });
    };
};
Analitics.prototype = new controller();
var objAnalitics = objAnalitics || new Analitics();
module.exports = objAnalitics;


