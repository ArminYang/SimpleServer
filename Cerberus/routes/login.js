var express = require('express');
var router = express.Router();
var fs = require('fs');
var Joi = require('Joi');

var rtnRst = function(res, code, data) {
    res.send(code, data);
};

router.post('/', function (req, res, next) {
    var schema = Joi.object().keys({
        loginType: Joi.number().integer().valid([1, 2, 3]).required().error(new Error('登录类型有误')), //1手机+验证码 2邮箱+验证码 3密码登录
        account: Joi.string().required().error(new Error('请输入用户名')),
        password: Joi.string().regex(/^\w{6,18}$/).required().error(new Error('请输入正确格式的密码')),
    });
    Joi.validate(req.body, schema, function (err ,value) {
        if(err){
            rtnRst(res,406,{
                err:err.message
            });
            return next
        }else {
            loginType = value.loginType;
            account =value.account;
            if(loginType === 1 && /^[1]([3-9])[0-9]{9}$/.test(account)){
            } else if(loginType === 2 && /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(account)){
            } else if(loginType === 3 && /^[\u4E00-\u9FA5\w]{2,20}$/.test(account)){
            }else{
                rtnRst(res, 406, {
                    err_name: "请求出错",
                    err_msg: "用户名格式错误"});
                return next
            }

            fs.open('./routes/loginfo', "a+", function (err, fd) {
                if (err) {
                    rtnRst(res, 406, {
                        err_name: "请求出错",
                        err_msg: "文件打开错误"})
                }
                var data = {
                    account: value.account,
                    password: value.password
                };
                fs.writeFile(fd, JSON.stringify(data)+"\n",
                    function (err) {
                    if (err) {
                        rtnRst(res, 406, {
                            err_name: "请求出错",
                            err_msg: "写入错误"});
                        return next
                    }
                });
                fs.close(fd,function (err) {
            });
            });
            rtnRst(res,200,{
                msg:'成功插入数据'
            });
            return next
        }
    })
});

module.exports = router;