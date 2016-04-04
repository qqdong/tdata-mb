/**
 * Created by qqdong on 15/5/25.
 */


var root_api = 'http://localhost:6301';
var root = 'file:///Users/qqdong/Documents/library/tdata-mb';
var auth_api_key = 'AutoTest';
var current_user_id;
var current_user_token;
var current_user;
var ajaxHeads;
var ajaxHeadsForJson;

$(function () {
    current_user_token = window.sessionStorage.getItem('current_user_token');
    //权限验证
    //if (current_user_token == null || current_user_token == '') {
    //    //跳转到登录页面
    //    window.location.href = root + '/pages/login.html';
    //}
    ////登录成功，设置用户信息
    //current_user_id = window.sessionStorage.getItem('current_user_id');
    //current_user = JSON.parse(window.sessionStorage.getItem('current_user'));

    ajaxHeads = {
        //"Auth-Uid": current_user_id,
        //"Auth-Token": window.sessionStorage.getItem('current_user_token'),
        'Auth-Api-Key': auth_api_key
    }
    ajaxHeadsForJson = {
        //"Auth-Uid": current_user_id,
        //"Auth-Token": window.sessionStorage.getItem('current_user_token'),
        'Auth-Api-Key': auth_api_key,
        'Content-Type': 'application/json'
    }

    //在页面上显示当前用户信息
    //$('[name="header_nickname"]').html(current_user.mobile);
    ////$('[name="headImg"]').attr("src",current_user.headImg);
    //$("#header_nickname_phone").html(current_user.mobile + '<small>' + current_user.mobile + '</small>');


});

//用户退出
function exit() {
    window.sessionStorage.removeItem('current_user_token');
    window.location.href = root + "/pages/login.html";
};