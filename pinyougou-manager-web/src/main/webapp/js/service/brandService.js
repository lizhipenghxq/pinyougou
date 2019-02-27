app.service('brandService',function ($http) {
    //读取列表数据绑定到表单中
    this.findAll=function () {
        return $http.get('../brand/findAll.do');
    };

    //分页查询
    this.findPage=function (num,size) {
        return  $http.get('../brand/findPage.do?num='+num+'&size='+size);
    };

    //保存方法
    this.add=function (entity) {
        return  $http.post('../brand/add.do',entity);
    };

    //更新方法
    this.update=function (entity) {
        return  $http.post('../brand/update.do',entity);
    };

    //获取实体
    this.findOne=function (id) {
        return $http.get('../brand/findOne.do?id='+id);
    };

    //批量删除
    this.delete=function (selectIds) {
        return  $http.get('../brand/delete.do?ids='+selectIds);
    };
    //多条件查询
    this.search=function (num,size,searchentity) {
        return $http.post('../brand/search.do?num='+num+'&size='+size,searchentity);
    };
    //品牌下拉列表
    this.findOptionList=function () {
        return  $http.get('../brand/findOptionList.do');

    }
});
