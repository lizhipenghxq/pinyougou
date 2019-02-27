app.service('indexService',function ($http) {
    //获取登录名
    this.loginName=function () {
        return $http.get('../login/findLoginName.do')
    }

});