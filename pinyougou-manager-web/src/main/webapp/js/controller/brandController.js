app.controller('brandController',function ($scope,$controller,brandService) {

    $controller('baseController',{$scope:$scope});


    //读取列表数据绑定到表单中
    // $scope.findAll=function () {
    //     brandService.findAll().success(
    //         function (response) {
    //             $scope.list=response;
    //         }
    //     );
    // };


    //分页查询
    $scope.findPage=function (num,size) {
        brandService.findPage(num,size).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems=response.total;
            }
        );
    };

    //保存
    $scope.save=function () {
        var object;
        if($scope.entity.id != null){
            //执行修改方法
            object =  brandService.update($scope.entity);
        }else{
            //增加
            object = brandService.add($scope.entity);
        }
        object.success(
            function (response) {
                if(response.success){
                    //重新查询 加载
                    $scope.reloadList();
                }else {
                    alert(response.message)
                }
            }
        );
    };
    //获取实体
    $scope.findOne=function (id) {
        brandService.findOne(id).success(
            function (response) {
                $scope.entity = response;
            }
        )
    };



    //批量删除
    $scope.delete=function () {
        brandService.delete($scope.selectIds).success(
            function (response) {
                if(response.success){
                    $scope.reloadList();//删除成功 刷新列表
                    $scope.selectIds=[];
                }
            }
        );
    };

    //分页多条件查询
    $scope.searchentity={};
    $scope.search=function (num,size) {
        brandService.search(num,size,$scope.searchentity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems=response.total;
            }
        );
    }

});
