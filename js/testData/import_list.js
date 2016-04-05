/**
 * Created by qqdong on 15/5/25.
 */
var tbl;

$(function () {
    //激活左侧对应菜单
    $("#menuTestData").addClass("active");
    $("#menuTestData_importList").addClass("active");


    //添加
    //$("#btnImport").click(function () {
    //    showTestDataImport();
    //});


    //上传图片
    $("#btnUploadExcel").click(function () {
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
        'uploader': root_api + '/testData/import?Auth-Api-Key=' + ajaxHeads['Auth-Api-Key'],
        'width': 120,
        'onUploadStart': function (file) {
            $("#fileUpload").uploadify("settings", "formData", ajaxHeads);
        },
        'onUploadSuccess': function (file, data, response) {
            var jsonData = JSON.parse(data);
            if (jsonData.error) {
                alert(jsonData.error);
            } else {
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
        //alert("上传成功");
        //tbl.ajax.reload();
    });

});


//#操作相关#############################################

//显示添加界面
function showTestDataImport() {
    $('#addModal').modal('show');
}

