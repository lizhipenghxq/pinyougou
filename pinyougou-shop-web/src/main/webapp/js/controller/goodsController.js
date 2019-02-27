 //控制层 
app.controller('goodsController' ,function($scope,$location,$controller,goodsService,
				uploadService,itemCatService,typeTemplateService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
                $scope.list=response;
			}			
		);
	};
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	};
	
	//查询实体 
	$scope.findOne=function(){

        var id= $location.search()['id'];//获取参数值
        if(id==null){
            return ;
        }

		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;
				//向富文本编辑器添加商品介绍
                editor.html($scope.entity.goodsDesc.goods_edit.html);
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
	
	//保存 
	$scope.save=function(){
        $scope.entity.goodsDesc.introduction=editor.html();

        var serviceObject;//服务层对象
		if($scope.entity.goods.id!=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改  
		}else{
            serviceObject=goodsService.add( $scope.entity  );//增加
		}				
		serviceObject.success(
			function(response){
				if(response.success){
                    location.href="goods.html";//跳转到商品列表页
				}else{
					alert(response.message);
				}
			}		
		);				
	};

	 
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
	//上传图片
	$scope.uploadFile=function () {
		uploadService.uploadFile().success(
			function (response) {
				if (response.success){ //上传成功，取出url
					$scope.image_entity.url=response.message; //设置文件地址
				}else{
					alert(response.message);
				}
            }
		);
    };

   //添加图片列表
    $scope.entity={ goodsDesc:{itemImages:[],specificationItems:[]}  };

    $scope.add_image_entity=function () {
        $scope.entity.goodsDesc.itemImages.push($scope.image_entity);
    };
	//删除图片列表
    $scope.remove_image_entity = function (index) {

        $scope.entity.goodsDesc.itemImages.splice(index, 1);
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

    // [{"id":1,"text":"联想"},{"id":3,"text":"三星"}, {"id":12,"text":"锤子"}]

    //模板ID选择后  更新品牌列表
    $scope.$watch('entity.goods.typeTemplateId', function(newValue, oldValue) {
        typeTemplateService.findOne(newValue).success(
            function(response){
                $scope.typeTemplate=response;//获取类型模板
                $scope.typeTemplate.brandIds= JSON.parse( $scope.typeTemplate.brandIds);//品牌列表
                //更新扩展属性
				if ($location.search()['id']==null) {
                    $scope.entity.goodsDesc.customAttributeItems =
                        JSON.parse($scope.typeTemplate.customAttributeItems);
                }
                //规格
				$scope.entity.goodsDesc.specificationItems=JSON.parse($scope.entity.goodsDesc.specificationItems)
            }
        );

        //查询规格列表
		typeTemplateService.findSpecList(newValue).success(
			function (response) {
				$scope.specList=response;
            }
		)
    });

    //选择规格选项
    $scope.updateSpecAttribute=function ($event,name,value) {
        var object = $scope.searchObjectByKey(
        	$scope.entity.goodsDesc.specificationItems,'attributeName',name);

        if (object!=null){ //有规格名称
			if ($event.target.checked){
                object.attributeValue.push(value) //在对象的attributeValue属性里添加value值（选项）。
            }else {
                object.attributeValue.splice( object.attributeValue.indexOf(value),1);
                if (object.attributeValue.length==0){
                    $scope.entity.goodsDesc.specificationItems.splice(
                    	$scope.entity.goodsDesc.specificationItems.indexOf(object),1);
				}

			}
		}else {
            $scope.entity.goodsDesc.specificationItems.push({"attributeName":name,"attributeValue":[value]});
		}
    };

    //创建sku列表
    $scope.createItemList = function () {
    	$scope.entity.itemList = [{spec: {}, price: 0, num: 99999, status: '0', isDefault: '0'}];//初始

        var items = $scope.entity.goodsDesc.specificationItems;
        for (var i = 0;i<items.length;i++){
            $scope.entity.itemList = addColumn($scope.entity.itemList,items[i].attributeName,items[i].attributeValue);
		}


    };

    //添加列值
	addColumn=function (list,columnName,columnValues) {
		var newList=[]; //新的集合
		for (var i=0;i<list.length;i++){
			var oldRow=list[i];
			for (var j=0;j<columnValues.length;j++){
                var newRow = JSON.parse(JSON.stringify(oldRow));
                newRow.spec[columnName] = columnValues[j];
                newList.push(newRow);
			}
		}
		return newList;
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
                }


            }
		);
    };

//根据规格名称和选项名称判断是否勾选
    $scope.checkAttributeValue = function (specName, optionName) {
      var items = $scope.entity.goodsDesc.specificationItems;
      var object = $scope.searchObjectByKey(items,'attributeName',specName);
      if (object!=null){
      	if (object.attributeValue.indexOf(optionName)>=0){
            return true;
        }else {
      		return false;
		}
	  }else {
          return false;
      }
    };
//规格是否启用勾选
    $scope.checkStatusValue=function (status) {
		if (status==1){
			return true;
		}else {
			return false;


		}
    }
});	
