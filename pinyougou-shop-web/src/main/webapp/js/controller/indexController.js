app.controller('indexController',function ($scope,$controller,indexService) {

    //获取登录名

    $scope.loginName=function () {
        indexService.loginName().success(
            function (response) {
                $scope.loginName=response.loginName;
            }
        )


    }

});