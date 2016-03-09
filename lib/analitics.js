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
        this.getAnaliticTbl().fetchRow('host').then(function(objAnalitic){
            if(!objAnalitic){
                row = {a_host: host};
                row["a_" + type] = 1;
                this.getAnaliticTbl().fetchNew(row);
            }
            objAnalitic[type]? ++objAnalitic[type] : objAnalitic[type] = 1;
        });
    };
};
Analitics.prototype = new controller();

module.exports = Analitics;


