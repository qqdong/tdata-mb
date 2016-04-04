/**
 * Created by qqdong on 15/5/25.
 */
var tbl;

$(function () {
    //激活左侧对应菜单
    $("#menuProduct").addClass("active");
    $("#menuProduct_catalogList").addClass("active");

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
                "url": root_api + "/catalog/mb/list",
                "type": "POST",
                "data": function (d) { // add data to the request
                    d.skip = d.start;
                    d.max = d.length;
                    addSearchParams(d);
                    getCatalogCount(d); //获取数量
                },
                "dataSrc": function (json) { // deal the data
                    json.recordsTotal = catalogCount;
                    json.recordsFiltered = catalogCount;
                    return json;
                }, headers: ajaxHeads
            },
            "columns": [{
                "data": "catalog_id"
            }, {
                "data": "name"
            }, {
                "data": "priority"
            }, {
                "data": "status"
            }],
            "columnDefs": [
                {
                    "targets": [0], // 目标列位置，下标从0开始
                    "data": "catalog_id", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        return data;
                    }
                },
                {
                    "targets": [2], // 目标列位置，下标从0开始
                    "data": "priority", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        return "<input type='hidden' name='catalogIds' value='" + full.catalog_id + "' />" + "<input type='text' name='priorities' value='" + data + "' />"
                    }
                },
                {
                    "targets": [3], // 目标列位置，下标从0开始
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
                    "targets": [4], // 目标列位置，下标从0开始
                    "data": "catalog_id", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        var retHtml = "";
                        if (full.status == 0) {
                            retHtml += "<a   href='#' onclick='updateStatus(" + data + ",1)'>显示</a>&nbsp;";
                        } else {
                            if (full.status == 1) {
                                retHtml += "<a   href='#' onclick='updateStatus(" + data + ",0)'>不显示</a>&nbsp;";

                            }
                        }
                        retHtml += "<a   href='#' onclick='showCatalogUpdate(" + data + ",\"" + full.name + "\")'>编辑</a>&nbsp;";
                        retHtml += "<a   href='#' onclick='deleteCatalog(" + data + ")'>删除</a>";

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
        showCatalogAdd();
    });
    //保存优先级
    $("#btnSavePriority").click(function () {
        savePriority();
    });

});

//#获取列表相关#############################################

// 函数-添加查询参数
function addSearchParams(d) {

}

//获取所有商品数量
var catalogCount = 0;
function getCatalogCount(params) {
    var url = root_api + "/catalog/count";
    $(this).ajaxSubmit({
        dataType: 'json', // 返回的数据格式
        type: 'POST',
        async: false,
        data: params,
        url: url,
        success: function (data) {
            if (!data.error) {
                catalogCount = data.count;
            } else {
                alert(data.error);
            }
        }, headers: ajaxHeads
    });
}
//#操作相关#############################################
// 更改商品状态
function updateStatus(catalog_id, status) {
    var jsonData = {
        catalog_id:catalog_id,
        status: status
    }
    $.ajax({
        dataType: 'json', // 返回的数据格式
        type: 'POST',
        url: root_api + "/catalog/updateStatus",
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
    var catalogIdArray = $("input[name='catalogIds']");
    var priorityArray = $("input[name='priorities']");
    for (var i = 0; i < catalogIdArray.length; i++) {
        jsonData.push({catalog_id: parseInt(catalogIdArray[i].value), priority: parseInt(priorityArray[i].value)})
    }
    jsonData = {array_priority: jsonData}
    $.ajax({
        dataType: 'json', // 返回的数据格式
        type: 'POST',
        url: root_api + "/catalog/updatePriority",
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

//删除分类
function deleteCatalog(catalog_id) {
    if (confirm("确定删除该分类吗？")) {
        $.ajax({
            dataType: 'json', // 返回的数据格式
            type: 'POST',
            url: root_api + "/catalog/delete",
            data: "catalog_id=" + catalog_id,
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
function showCatalogAdd() {
    $('#catalogId').val("");
    $('#catalogName').val("");
    $('#addModal').modal('show');
}

//显示添加界面
function showCatalogUpdate(catalog_id, catalog_name) {
    $('#catalogId').val(catalog_id);
    $('#catalogName').val(catalog_name);
    $('#addModal').modal('show');
}

//提交添加
$('#addForm').submit(function () {
    var url = root_api + "/catalog/add";
    if ($('#catalogId').val() != "") {
        url = root_api + "/catalog/update";
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