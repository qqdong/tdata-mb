/**
 * Created by qqdong on 15/5/25.
 */
var tbl;

$(function () {
    //激活左侧对应菜单
    $("#menuUser").addClass("active");
    $("#menuUser_list").addClass("active");

    //获取数据
    tbl = $('#tbl1')
        .DataTable(
        {
            "serverSide": true,
            "autoWidth": true,
            "searching": false,
            "lengthChange": false,
            "ordering": false,
            "pageLength": 10,
            "ajax": {
                "url": root_api + "/user/mb/list",
                "type": "POST",
                "data": function (d) { // add data to the request
                    d.skip = d.start;
                    d.max = d.length;
                    addSearchParams(d);
                    getUserCount(d); //获取数量
                },
                "dataSrc": function (json) { // deal the data
                    json.recordsTotal = userCount;
                    json.recordsFiltered = userCount;
                    return json;
                }, headers: ajaxHeads
            },
            "columns": [{
                "data": "mobile"
            }, {
                "data": "status"
            }, {
                "data": "user_id"
            }],
            "columnDefs": [
                {
                    "targets": [1], // 目标列位置，下标从0开始
                    "data": "status", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        if (full.status == 0) {
                            return "<span style='color: red'>拉黑</span>";
                        } else {
                            if (full.status == 1) {
                                return "<span style='color: green'>正常</span>";

                            } else {
                                return "未知";
                            }
                        }
                    }
                },
                {
                    "targets": [2], // 目标列位置，下标从0开始
                    "data": "user_id", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        var retHtml = "";
                        if (full.status == 0) {
                            retHtml += "<a   href='#' onclick='updateStatus(" + data + ",1)'>恢复</a>&nbsp;";
                        } else {
                            if (full.status == 1) {
                                retHtml += "<a   href='#' onclick='updateStatus(" + data + ",0)'>拉黑</a>&nbsp;";

                            }
                        }
                        retHtml += "<a   href='#' onclick='deleteUser(" + data + ")'>删除</a>";

                        return retHtml;
                    }
                }],
            "language": { // 汉化
                "lengthMenu": "每页显示 _MENU_ 条",
                "zeroRecords": "没有检索到数据",
                "info": "从 _START_ 到 _END_ 条；共 _TOTAL_ 条",
                "infoEmtpy": "没有数据",
                "processing": "正在加载数据...",
                "paginate": {
                    "first": "首页",
                    "previous": "前页",
                    "next": "后页",
                    "last": "尾页"
                }
            }
        });

    //添加
    $("#btnAdd").click(function () {
        showUserAdd();
    });

});

//#获取列表相关#############################################

// 函数-添加查询参数
function addSearchParams(d) {

}

//获取所有商品数量
var userCount = 0;
function getUserCount(params) {
    var url = root_api + "/user/count";
    $(this).ajaxSubmit({
        dataType: 'json', // 返回的数据格式
        type: 'POST',
        async: false,
        data: params,
        url: url,
        success: function (data) {
            if (!data.error) {
                userCount = data.count;
            } else {
                alert(data.error);
            }
        }, headers: ajaxHeads
    });
}
//#操作相关#############################################
// 更改用户状态
function updateStatus(user_id, status) {
    var jsonData = {
        user_id: user_id,
        status: status
    };
    $.ajax({
        dataType: 'json', // 返回的数据格式
        type: 'POST',
        url: root_api + "/user/updateStatus",
        //data: "product_id=" + product_id + "&status=" + status,
        data: $.toJSON(jsonData),
        success: function (data) {
            if (!data.error) {
                tbl.ajax.reload();
            } else {
                alert(data.error);
            }
        }, headers: ajaxHeadsForJson
    });
}


//删除用户
function deleteUser(user_id) {
    if (confirm("确定删除该User吗？")) {
        $.ajax({
            dataType: 'json', // 返回的数据格式
            type: 'POST',
            url: root_api + "/user/delete",
            data: "user_id=" + user_id,
            success: function (data) {
                if (!data.error) {
                    tbl.ajax.reload();
                } else {
                    alert(data.error);
                }
            }, headers: ajaxHeads
        });
    }
}

//显示添加界面
function showUserAdd() {
    $('#mobile').val("");
    $('#password').val("");
    $('#addModal').modal('show');
}


//提交添加
$('#addForm').submit(function () {
    var url = root_api + "/user/add";
    if ($('#userId').val() != "") {
        url = root_api + "/user/update";
    }
    $(this).ajaxSubmit({
        dataType: 'json', // 返回的数据格式
        type: 'POST',
        url: url,
        success: function (data) {
            if (!data.error) {
                $('#addModal').modal('hide');
                tbl.ajax.reload();
            } else {
                alert(data.error);
            }
        }, headers: ajaxHeads
    });
    return false;
});