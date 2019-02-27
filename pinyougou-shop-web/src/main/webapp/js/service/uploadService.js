app.service('uploadService',function ($http) {

    this.uploadFile = function () {
      var formData =new FormData();
      formData.append('file',file.files[0]); //file 文件传输框的name--获取第一个file，
        // 其实页面也只有一个

        return $http({
            method:'post',
            url:"../upload.do",
            data:formData,
            headers:{'Content-Type':undefined},
            transformRequest:angular.identity //表单2进制序列化
        })
    };


});