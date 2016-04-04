/**
 * Created by qqdong on 15/5/25.
 */
$(function() {
    // 登陆
    $('#loginForm').submit(function() {
        //var root_api='https://muse-dev.weimai.com:6301';
        var root_api='https://localhost:6302';
        var auth_api_key='overseas_mb';

        var url=root_api+'/user/login';
        $(this).ajaxSubmit({
            dataType : 'json', // 返回的数据格式
            type : 'POST',
            url : url,
            success : function(data) {
                if (!data.error) {
                    window.location.href =  "../index.html";

                    //用户信息保存到sessionStorage
                    window.sessionStorage.setItem('current_user_token',data.token);
                    window.sessionStorage.setItem('current_user_id',data.user_id);
                    window.sessionStorage.setItem('current_user',JSON.stringify(data));

                } else {
                    alert(data.error);
                }
                return false;
            }, headers: {
                'Auth-Api-Key':auth_api_key
            }
        });
        return false;
    });
});