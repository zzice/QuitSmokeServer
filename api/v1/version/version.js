/*Android版本更新*/
var BaseModel = require('../../../model/base_model');
var Version = require('../../../model/version');

module.exports.checkVersion = function (req, res) {
    var versionCode = req.params.versionCode;
    if (!versionCode) {
        BaseModel(false, res, '请检查参数是否输入正确');
        return;
    }
    /*      添加数据
     var version = new Version({
     versionCode:2,
     newestUrl:'http://www.baidu.com/'
     });
     version.save(function (err, data) {
     BaseModel(true,res,data);
     });*/
    Version.findOne(function (err, version) {
        if (err) {
            BaseModel(false, res, '查询错误');
        } else if (version) {
            //数据库存储版本号
            var versionCodeDb = version.versionCode;
            if (versionCodeDb) {
                if (versionCode >= versionCodeDb) {
                    version.isNewest = false;
                    BaseModel(true, res, version);
                }
                else {
                    version.isNewest = true;
                    BaseModel(true, res, version);
                }
            }
        }
    });
};