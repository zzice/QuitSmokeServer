/*Android版本更新*/
var BaseModel = require('../../../model/base_model');
var Version = require('../../../model/version');

/*移除旧版本信息并上传新版本*/
module.exports.uploadVersionInfo = function (req, res) {
    var newestVersionCode = req.body.newestVersionCode;
    var newestVersionName = req.body.newestVersionName;
    var newestUrl = req.body.newestUrl;
    if (!newestVersionCode || !newestUrl) {
        BaseModel(false, res, '请检查参数是否输入正确');
        return;
    }
    if (!newestVersionName) {
        newestVersionName = '';
    }
    //添加数据
    function saveVersionData() {
        var version = new Version({
            newestVersionCode: newestVersionCode,
            newestVersionName: newestVersionName,
            newestUrl: newestUrl
        });
        version.save(function (err, data) {
            if (err) {
                console.log('操作数据库错误:' + err);
            } else {
                BaseModel(true, res, data);
            }
        });
    }
    Version.find(function (err, version) {
        if (err) {
            BaseModel(false, res, err);
        } else if (version) {
            //remove
            Version.remove(function (error) {
                if (error) {
                    console.log('操作数据库错误:' + error);
                } else {
                    saveVersionData();
                }
            });
        } else {
            saveVersionData();
        }
    })
};
/*检查最新版本*/
module.exports.checkVersion = function (req, res) {
    var versionCode = req.params.versionCode;
    if (!versionCode) {
        BaseModel(false, res, '请检查参数是否输入正确');
        return;
    }
    Version.findOne(function (err, version) {
        if (err) {
            BaseModel(false, res, '查询错误');
        } else if (version) {
            //数据库存储版本号
            var newestVersionCode = version.newestVersionCode;
            if (newestVersionCode) {
                if (versionCode >= newestVersionCode) {
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