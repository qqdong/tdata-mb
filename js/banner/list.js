/**
 * Created by qqdong on 15/5/25.
 */
var tbl;

$(function () {
    //激活左侧对应菜单
    $("#menuBanner").addClass("active");
    $("#menuBanner_list").addClass("active");

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
                "url": root_api + "/banner/mb/list",
                "type": "POST",
                "data": function (d) { // add data to the request
                    d.skip = d.start;
                    d.max = d.length;
                    addSearchParams(d);
                    getBannerCount(d); //获取数量
                },
                "dataSrc": function (json) { // deal the data
                    json.recordsTotal = bannerCount;
                    json.recordsFiltered = bannerCount;
                    return json;
                }, headers: ajaxHeads
            },
            "columns": [{
                "data": "title"
            }, {
                "data": "head_img"
            }, {
                "data": "page_url"
            }, {
                "data": "priority"
            }, {
                "data": "status"
            },{
                "data":"banner_id"
            }],
            "columnDefs": [
                {
                    "targets": [0], // 目标列位置，下标从0开始
                    "data": "title", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        return data;
                    }
                }, {
                    "targets": [1], // 目标列位置，下标从0开始
                    "data": "head_img", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        return "<a href='" + data + "' target='_blank' ><img style='height:40px;width:40px;' src='" + data + "'><a>";
                    }
                },
                {
                    "targets": [2], // 目标列位置，下标从0开始
                    "data": "page_url", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        if (data.length > 20) {
                            return "<a href='" + full.page_url + "' target='_blank' style=‘text-decoration:underline;’>" + "<span  title='" + data + "'>" + data.substr(0, 20) + '...' + "</span></a>";
                        } else {
                            return "<a href='" + full.page_url + "' target='_blank' style=‘text-decoration:underline;’>" + "<span  title='" + data + "'>" + data + "</span></a>";
                        }
                    }
                },
                {
                    "targets": [3], // 目标列位置，下标从0开始
                    "data": "priority", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        return "<input type='hidden' name='bannerIds' value='" + full.banner_id + "' />" + "<input type='text' name='priorities' value='" + data + "' />"
                    }
                },
                {
                    "targets": [4], // 目标列位置，下标从0开始
                    "data": "status", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        if (full.status == 0) {
                            return "<span style='color: red'>不显示</span>";
                        } else {
                            if (full.status == 1) {
                                return "<span style='color: green'>显示</span>";

                            } else {
                                return "未知";
                            }
                        }
                    }
                },
                {
                    "targets": [5], // 目标列位置，下标从0开始
                    "data": "banner_id", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        var retHtml = "";
                        if (full.status == 0) {
                            retHtml += "<a   href='#' onclick='updateStatus(" + data + ",1)'>显示</a>&nbsp;";
                        } else {
                            if (full.status == 1) {
                                retHtml += "<a   href='#' onclick='updateStatus(" + data + ",0)'>不显示</a>&nbsp;";

                            }
                        }
                        retHtml += "<a   href='#' onclick='showBannerUpdate(" + data + ",\"" + full.title + "\"" + ",\"" + full.head_img + "\"" + ",\"" + full.page_url + "\"" + ")'>编辑</a>&nbsp;";
                        retHtml += "<a   href='#' onclick='deleteBanner(" + data + ")'>删除</a>";

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
        showBannerAdd();
    });
    //保存优先级
    $("#btnSavePriority").click(function () {
        savePriority();
    });


    //上传图片
    $("#btnUploadPic").click(function () {
        $('#uploadModal').modal('show');
        return false;
    });

    // 初始化上传控件
    $("#fileUpload").uploadify({
        'formData': {
            'id': '0'
        },
        'auto': false,
        'height': 30,
        'fileObjName': 'file',
        'swf': root + '/plugins/uploadify/uploadify.swf',
        'uploader': root_api + '/mb/upload?Auth-Api-Key=' + ajaxHeads['Auth-Api-Key'] + "&Auth-Uid=" + ajaxHeads['Auth-Uid'] + "&Auth-Token=" + ajaxHeads['Auth-Token'],
        'width': 120,
        'onUploadStart': function (file) {
            $("#fileUpload").uploadify("settings", "formData", ajaxHeads);
        },
        'onUploadSuccess': function (file, data, response) {
            var jsonData = JSON.parse(data);
            if (jsonData.error) {
                alert(jsonData.error);
            } else {
                $("#bannerHeadImg").val(jsonData.url);
                $('#uploadModal').modal('hide');
            }

        }
    });

    // 执行文件上传
    $("#btnUpload").click(function () {
        $('#fileUpload').uploadify('upload')
    });

    // 上传成功之后，重新加载table
    $('#uploadModal').on('hidden.bs.modal', function (e) {
        //tbl.ajax.reload();
    });

});

//#获取列表相关#############################################

// 函数-添加查询参数
function addSearchParams(d) {

}

//获取所有Banner数量
var bannerCount = 0;
function getBannerCount(params) {
    var url = root_api + "/banner/count";
    $(this).ajaxSubmit({
        dataType: 'json', // 返回的数据格式
        type: 'POST',
        async: false,
        data: params,
        url: url,
        success: function (data) {
            if (!data.error) {
                bannerCount = data.count;
            } else {
                alert(data.error);
            }
        }, headers: ajaxHeads
    });
}
//#操作相关#############################################
// 更改Banner状态
function updateStatus(banner_id, status) {
    var jsonData = {
        banner_id: banner_id,
        status: status
    }
    $.ajax({
        dataType: 'json', // 返回的数据格式
        type: 'POST',
        url: root_api + "/banner/updateStatus",
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

// 保存优先级
function savePriority() {
    var jsonData = [];
    var bannerIdArray = $("input[name='bannerIds']");
    var priorityArray = $("input[name='priorities']");
    for (var i = 0; i < bannerIdArray.length; i++) {
        jsonData.push({banner_id: parseInt(bannerIdArray[i].value), priority: parseInt(priorityArray[i].value)})
    }
    jsonData = {array_priority: jsonData}
    $.ajax({
        dataType: 'json', // 返回的数据格式
        type: 'POST',
        url: root_api + "/banner/updatePriority",
        //data: "product_id=" + product_id + "&status=" + status,
        data: $.toJSON(jsonData),
        success: function (data) {
            if (!data.error) {
                alert("批量保存成功");
                tbl.ajax.reload();
            } else {
                alert(data.error);
            }
        }, headers: ajaxHeadsForJson
    });
}

//删除Banner
function deleteBanner(banner_id) {
    if (confirm("确定删除该Banner吗？")) {
        $.ajax({
            dataType: 'json', // 返回的数据格式
            type: 'POST',
            url: root_api + "/banner/delete",
            data: "banner_id=" + banner_id,
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
function showBannerAdd() {
    $('#bannerId').val("");
    $('#bannerTitle').val("");
    $('#bannerHeadImg').val("");
    $('#bannerPageUrl').val("");
    $('#addModal').modal('show');
}

//显示添加界面
function showBannerUpdate(banner_id, title, head_img, page_url) {
    $('#bannerId').val(banner_id);
    $('#bannerTitle').val(title);
    $('#bannerHeadImg').val(head_img);
    $('#bannerPageUrl').val(page_url);
    $('#addModal').modal('show');
}

//提交添加
$('#addForm').submit(function () {
    var url = root_api + "/banner/add";
    if ($('#bannerId').val() != "") {
        url = root_api + "/banner/update";
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