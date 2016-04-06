/**
 * Created by qqdong on 15/5/25.
 */
var tbl;

$(function () {
    //激活左侧对应菜单
    $("#menuTestDate").addClass("active");
    $("#menuTestDate_dayExportList").addClass("active");

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
                "url": root_api + "/testData/export/list",
                "type": "POST",
                "data": function (d) { // add data to the request
                    d.skip = d.start;
                    d.max = d.length;
                    addSearchParams(d);
                    getBannerCount(d); //获取数量
                },
                "dataSrc": function (json) { // deal the data
                    json.recordsTotal = recordCount;
                    json.recordsFiltered = recordCount;
                    return json;
                }, headers: ajaxHeads
            },
            "columns": [{
                "data": "id"
            }, {
                "data": "day"
            }],
            "columnDefs": [
                {
                    "targets": [0], // 目标列位置，下标从0开始
                    "data": "id", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        return data;
                    }
                },
                {
                    "targets": [2], // 目标列位置，下标从0开始
                    "data": "id", // 数据列名
                    "render": function (data, type, full) { // 返回自定义内容
                        return "<a href='"
                            + root_api
                            + "/testData/export/download/"+data
                            + "'>导出</a>";
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


});

//#获取列表相关#############################################

// 函数-添加查询参数
function addSearchParams(d) {

}

//获取所有数量
var recordCount = 0;
function getBannerCount(params) {
    var url = root_api + "/testData/export/count";
    $(this).ajaxSubmit({
        dataType: 'json', // 返回的数据格式
        type: 'POST',
        async: false,
        data: params,
        url: url,
        success: function (data) {
            if (!data.error) {
                recordCount = data.count;
            } else {
                alert(data.error);
            }
        }, headers: ajaxHeads
    });
}
