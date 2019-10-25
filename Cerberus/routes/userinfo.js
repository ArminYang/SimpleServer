var express = require('express');
var router = express.Router();
var fs = require('fs');


var rtnRst = function(res, code, data) {
    res.send(code, data);
};



router.get('/', function(req, res, next) {
    fs.readFile('./routes/loginfo','utf-8',function (err, content) {
        if (err){
            rtnRst(res, 406, {
                err_name: "请求出错",
                err_msg: "文本阅读错误"});
            return next
        }else{
            var contentlist = content.split('\n');
                data = [];
            for(var i = 0; i < contentlist.length-1; i++){
                var info = JSON.parse(contentlist[i]);
                var star;
                if (info.account.length <=3){
                    star="***"
                }else if(3<info.account.length <7){
                    star="*****"
                }else if(7<=info.account.length<12){
                    star="******"
                }else{star="*******"}
                info.account = info.account.substr(0,parseInt(info.account.split('').length/2))+star+info.account.substr(parseInt(info.account.split('').length/2+2),info.account.split('').length);
                info.password = info.password.substr(0,parseInt(info.password.split('').length/2))+'********'+info.password.substr(parseInt(info.password.split('').length/2+2),info.password.split('').length);
                data.push(info)
            }
            var obj = {};
            data = data.reduce(function(item, next) {
            obj[next.account] ? '' : obj[next.account] = true && item.push(next);
            return item;
            }, []);
            rtnRst(res, 200, data);
            return next
        }
    })
});

module.exports = router;