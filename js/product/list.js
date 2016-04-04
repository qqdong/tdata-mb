/**
 * Created by qqdong on 15/5/25.
 */
var tbl;

$(function () {
    //激活左侧对应菜单
    $("#menuProduct").addClass("active");
    $("#menuProduct_list").addClass("active");

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
                "url": root_api + "/product/mb/list",
                "type": "POST",
                "data": function (d) { // add data to the request
                    d.skip = d.start;
                    d.max = d.length;
                    addSearchParams(d);
                    getProductCount(d); //获取数量
                },
                "dataSrc": function (json) { // deal the data
                    json.recordsTotal = productCount;
                    json.recordsFiltered = productCount;
                    return json;
                }, headers: ajaxHeads
            },
            "columns": [{
                "data": "catalog_name"
            }, {
                "data": "title"
            }, {
                "data": "price"
            }, {
                "data": "price_message"
            }, {
                "data": "head_img"
            }, {
                "data": "status"
            }, {
                "data": "priority"
            }],
            "columnDefs": [
                {
                    "targets": [0], // 目标列位置，下标从0开始
                    "data": "catalog_name", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        return data;
                    }
                },
                {
                    "targets": [1], // 目标列位置，下标从0开始
                    "data": "title", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        if (data.length > 20) {
                            return "<a href='" + full.source_page_url + "' target='_blank' style=‘text-decoration:underline;’>" + "<span  title='" + data + "'>" + data.substr(0, 20) + '...' + "</span></a>";
                        } else {
                            return "<a href='" + full.source_page_url + "' target='_blank' style=‘text-decoration:underline;’>" + "<span  title='" + data + "'>" + data + "</span></a>";
                        }
                    }
                }, {
                    "targets": [4], // 目标列位置，下标从0开始
                    "data": "head_img", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        return "<a href='" + data + "' target='_blank' ><img style='height:40px;width:40px;' src='" + data + "'><a>";
                    }
                },
                {
                    "targets": [5], // 目标列位置，下标从0开始
                    "data": "status", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        if (data == 0) { //普通用户
                            return "<span style='color: darkgray'>未显示</span>";
                        } else if (data == 1) {
                            return "推荐";
                        } else if (data == 2) {
                            return "<span style='color: green'>优选</span>";
                        } else if (data == 3) {
                            return "<span style='color: red'>未设置</span>";
                        }
                        return "未知";
                    }
                },
                {
                    "targets": [6], // 目标列位置，下标从0开始
                    "data": "priority", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        return "<input type='hidden' name='productIds' value='" + full.product_id + "' />" + "<input type='text' name='priorities' value='" + data + "' />"
                    }
                },
                {
                    "targets": [7], // 目标列位置，下标从0开始
                    "data": "product_id", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        var retHtml = "";
                        if (full.status == 0) {
                            retHtml += "<a   href='#' onclick='updateStatus(" + data + ",1)'>显示</a>&nbsp;";
                        } else {
                            if (full.status == 1) {
                                retHtml += "<a   href='#' onclick='updateStatus(" + data + ",0)'>不显示</a>&nbsp;";
                                retHtml += "<a   href='#' onclick='updateStatus(" + data + ",2)'>设为优选</a>&nbsp;";
                            }
                        }
                        retHtml += "<a   href='#' onclick='showUpdateCatalog(" + data + "," + full.catalog_id + ")'>设置分类</a>&nbsp;";
                        //retHtml += "<a   href='#' onclick='showProductEdit(" + data + ",\"" + full.title + "\"," + full.priority + ")'>编辑</a>&nbsp;";
                        retHtml += "<a   href='#' onclick='deleteProduct(" + data + ")'>删除</a>";

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

    //获取分类列表
    initCatalogList();

    //查询
    $("#btnSearch").click(function () {
        tbl.ajax.reload(); // 重新加载table，会自动发起请求
    });

    //添加
    $("#btnAdd").click(function () {
        showProductAdd();
    });
    //保存优先级
    $("#btnSavePriority").click(function () {
        savePriority();
    });

});

//#获取列表相关#############################################

// 函数-添加查询参数
function addSearchParams(d) {
    var catalogId = $("#search_catalogId").val();
    if (catalogId && catalogId != "") {
        d.catalog_id = catalogId;
    }
    var status = $("#search_status").val();
    if (status && status != "") {
        d.status = status;
    }
}

//获取所有商品数量
var productCount = 0;
function getProductCount(params) {
    var url = root_api + "/product/count";
    $(this).ajaxSubmit({
        dataType: 'json', // 返回的数据格式
        type: 'POST',
        async: false,
        data: params,
        url: url,
        success: function (data) {
            if (!data.error) {
                productCount = data.count;
            } else {
                alert(data.error);
            }
        }, headers: ajaxHeads
    });
}

//获取所有分类列表
function initCatalogList() {
    var url = root_api + "/catalog/list";
    $(this).ajaxSubmit({
        dataType: 'json', // 返回的数据格式
        type: 'POST',
        async: false,
        url: url,
        success: function (data) {
            if (!data.error) {
                var selectHtml = '<option value="">选择分类</option>';
                for (var i = 0; i < data.length; i++) {
                    selectHtml += '<option value="' + data[i].catalog_id + '">' + data[i].name + '</option>';
                }
                $("#search_catalogId").html(selectHtml);
                $("#updateCatalog_catalogId").html(selectHtml);
            } else {
                alert(data.error);
            }
        }, headers: ajaxHeads
    });
}

//#操作相关#############################################
// 更改商品状态
function updateStatus(product_id, status) {
    var jsonData = {
        product_id: product_id,
        status: status
    }
    $.ajax({
        dataType: 'json', // 返回的数据格式
        type: 'POST',
        url: root_api + "/product/updateStatus",
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
    var productIdArray = $("input[name='productIds']");
    var priorityArray = $("input[name='priorities']");
    for (var i = 0; i < productIdArray.length; i++) {
        jsonData.push({product_id: parseInt(productIdArray[i].value), priority: parseInt(priorityArray[i].value)})
    }
    jsonData = {array_priority: jsonData}
    $.ajax({
        dataType: 'json', // 返回的数据格式
        type: 'POST',
        url: root_api + "/product/updatePriority",
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

//删除商品
function deleteProduct(product_id) {
    if (confirm("确定删除该商品吗？")) {
        $.ajax({
            dataType: 'json', // 返回的数据格式
            type: 'POST',
            url: root_api + "/product/delete",
            data: "product_id=" + product_id,
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

//显示编辑界面
function showUpdateCatalog(product_id, catalog_id) {
    $('#updateCatalog_productId').val(product_id);
    initCatalogList();
    $('#updateCatalog_catalogId').val(catalog_id);
    $('#updateCatalogModal').modal('show');
}
//提交更新分类
$('#updateCatalogForm').submit(function () {
    var url = root_api + "/product/updateCatalog"
    $(this).ajaxSubmit({
        dataType: 'json', // 返回的数据格式
        type: 'POST',
        url: url,
        data: "product_id=" + $('#updateCatalog_productId').val() + "&catalog_id=" + $('#updateCatalog_catalogId').val(),
        success: function (data) {
            if (!data.error) {
                $('#updateCatalogModal').modal('hide');
                tbl.ajax.reload();
            } else {
                alert(data.error);
            }
        }, headers: ajaxHeads
    });
    return false;
});

//显示添加界面
function showProductAdd() {
    $('#asins').val("");
    $('#addModal').modal('show');
}
//提交添加
$('#addForm').submit(function () {
    var url = root_api + "/product/add"
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