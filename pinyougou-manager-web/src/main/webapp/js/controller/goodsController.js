 //控制层 
app.controller('goodsController' ,function($scope,$controller ,$location,itemCatService
                                           ,goodsService,typeTemplateService,brandService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		// goodsService.findOne(id).success(
		// 	function(response){
		// 		$scope.entity= response;
		// 	}
		// );
        var id= $location.search()['id'];//获取参数值
        if(id==null){
            return ;
        }

        goodsService.findOne(id).success(
            function(response){
                $scope.entity= response;
                //向富文本编辑器添加商品介绍
                editor.html($scope.entity.goodsDesc.introduction);
                //读取图片
                $scope.entity.goodsDesc.itemImages= JSON.parse($scope.entity.goodsDesc.itemImages);
                //读取扩展属性
                $scope.entity.goodsDesc.customAttributeItems=JSON.parse($scope.entity.goodsDesc.customAttributeItems);
                //读取sku商品列表
                for (var i=0; i<$scope.entity.itemList.length; i++){
                    $scope.entity.itemList[i].spec=
                        JSON.parse($scope.entity.itemList[i].spec);
                }

            }
        );
    };
    //读取一级分类
    $scope.selectItemCat1List=function() {
        itemCatService.findByParentId(0).success(
            function (response) {
                $scope.itemCat1List=response;

            }
        )
    };
    //读取二级分类
    $scope.$watch('entity.goods.category1Id',function (newValue,oldValue) {
        //清空二级分类id
        // $scope.entity.goods.category2Id=null;
        //根据一级分类选择二级分类
        itemCatService.findByParentId(newValue).success(
            function (response) {

                $scope.itemCat2List=response;
            }
        )
    });

    //读取三级级分类
    $scope.$watch('entity.goods.category2Id',function (newValue,oldValue) {
        //清空三级分类id
        // $scope.entity.goods.category3Id=null;
        //根据二级分类选择二级分类
        itemCatService.findByParentId(newValue).success(
            function (response) {
                $scope.itemCat3List=response;
            }
        )
    });

    //读取模板id,品牌下拉列表
    //监听三级分类id变化
    $scope.$watch('entity.goods.category3Id',function (newValue,oldValue) {
        itemCatService.findOne(newValue).success(
            function (response) {
                $scope.entity.goods.typeTemplateId = response.typeId;

            }
        );
    });
	
	//保存
	$scope.save=function(){
		var serviceObject;//服务层对象
		if($scope.entity.id!=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改
		}else{
			serviceObject=goodsService.add( $scope.entity  );//增加
		}
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询
		        	$scope.reloadList();//重新加载
				}else{
					alert(response.message);
				}
			}
		);
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	};
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	};


    //修改状态显示值
    $scope.status=['未审核','已审核','审核未通过','关闭'];
    //加载商品分类列表
    $scope.itemCatList=[];
    $scope.findItemCatList=function () {
        itemCatService.findAll().success(

            function (response) {
                //获取分类列表的id和name.
                for (var i = 0;response.length;i++){
                    $scope.itemCatList[response[i].id]=response[i].name;
                    //每个模板名称赋值给itemCatList的模板id属性值
                }

            }
    	);

    };

    //更改状态
    $scope.updateStatus=function(status) {
        goodsService.updateStatus($scope.selectIds, status).success(
            function (response) {
                if (response.success) {//成功
                    $scope.reloadList();//刷新列表
                    $scope.selectIds = [];//清空ID集合
                } else {
                    alert(response.message);
                }
            }
        );
    };

    //模板ID选择后  更新品牌列表
    $scope.$watch('entity.goods.typeTemplateId', function(newValue, oldValue) {
        typeTemplateService.findOne(newValue).success(
            function(response){
                $scope.typeTemplate=response;//获取类型模板
                $scope.typeTemplate.brandIds= JSON.parse( $scope.typeTemplate.brandIds);//品牌列表

            }
        );
    });

    //加载品牌列表
    $scope.brandList=[];
    $scope.findbrandList=function () {
        brandService.findAll().success(
            function (response) {
                //获取品牌列表的id和name.
                for (var i = 0;response.length;i++){
                    $scope.brandList[response[i].id]=response[i].name;
                }


            }
        );
    };

});
