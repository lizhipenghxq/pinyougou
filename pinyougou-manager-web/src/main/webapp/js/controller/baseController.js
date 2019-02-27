app.controller('baseController',function ($scope) {


    //重新加载列表
    $scope.reloadList=function () {

        $scope.search($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);

    };

    //分页控件配置
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function(){
            $scope.reloadList()
        }
    };


    //更新复选
    $scope.selectIds=[]; //定义一个空数组接收所选的id
    //点击时,定义方法判断是否将id存入数组中
    $scope.updateSelection=function ($event,id) {
        if($event.target.checked){  //如果选中，添加到数组
            $scope.selectIds.push(id);
        }else {  //删除数组里的id
            var index = $scope.selectIds.indexOf(id) ; //index 该id在数组中的位置
            $scope.selectIds.splice(index,1);
        }
    };
    //提取json字符串数据中某个属性，返回拼接字符串 逗号分隔
    $scope.jsonToString=function (jsonString,key) {

       var json = JSON.parse(jsonString);
            var value ="";
       for(var i = 0;i<json.length;i++){
           if (i>0){
               value+=",";
           }
             value+=json[i][key];
       }
       return value;
    }

});