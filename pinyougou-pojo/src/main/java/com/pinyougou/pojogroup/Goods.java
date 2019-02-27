package com.pinyougou.pojogroup;

import com.pinyougou.pojo.TbGoods;
import com.pinyougou.pojo.TbGoodsDesc;
import com.pinyougou.pojo.TbItem;

import java.io.Serializable;
import java.util.List;

public class Goods implements Serializable{

    private TbGoods goods; //商品spu
    private TbGoodsDesc goodsDesc; //商品spu拓展
    private List<TbItem> itemList; //商品sku列表

    public TbGoods getGoods() {
        return goods;
    }

    public void setGoods(TbGoods goods) {
        this.goods = goods;
    }

    public TbGoodsDesc getGoodsDesc() {
        return goodsDesc;
    }

    public void setGoodsDesc(TbGoodsDesc goodsDesc) {
        this.goodsDesc = goodsDesc;
    }

    public List<TbItem> getItemList() {
        return itemList;
    }

    public void setItemList(List<TbItem> itemList) {
        this.itemList = itemList;
    }

    public Goods(TbGoods goods, TbGoodsDesc goodsDesc, List<TbItem> itemList) {
        this.goods = goods;
        this.goodsDesc = goodsDesc;
        this.itemList = itemList;
    }

    public Goods() {
    }


    //
//    private int category1Id; //1级类目
//    private int category2Id; //2级类目
//    private int category3Id; //3级类目
//    private String goodsName; //商品名称
//    private String brand_id; //品牌
//    private String caption; //副标题
//    private double price; //价格
//
//    private String introduction; //介绍
//    private String packageList; //包装列表
//    private String saleService; //售后服务

}
