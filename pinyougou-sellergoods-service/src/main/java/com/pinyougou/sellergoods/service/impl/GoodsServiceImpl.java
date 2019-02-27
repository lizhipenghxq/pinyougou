package com.pinyougou.sellergoods.service.impl;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.pinyougou.mapper.*;
import com.pinyougou.pojo.*;
import com.pinyougou.pojogroup.Goods;
import org.springframework.beans.factory.annotation.Autowired;
import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.pojo.TbGoodsExample.Criteria;
import com.pinyougou.sellergoods.service.GoodsService;

import entity.PageResult;
import org.springframework.transaction.annotation.Transactional;

/**
 * 服务实现层
 * @author Administrator
 *
 */
@Service
@Transactional
public class GoodsServiceImpl implements GoodsService {

	@Autowired
	private TbGoodsMapper goodsMapper;
	@Autowired
	private TbGoodsDescMapper goodsDescMapper;
	@Autowired
	private TbItemMapper itemMapper;
	@Autowired
	private TbBrandMapper tbBrandMapper;
	@Autowired
	private TbItemCatMapper tbItemCatMapper;
	@Autowired
	private TbSellerMapper sellerMapper;


	
	/**
	 * 查询全部
	 */
	@Override
	public List<TbGoods> findAll() {
		return goodsMapper.selectByExample(null);
	}

	/**
	 * 按分页查询
	 */
	@Override
	public PageResult findPage(int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);		
		Page<TbGoods> page=   (Page<TbGoods>) goodsMapper.selectByExample(null);
		return new PageResult(page.getTotal(), page.getResult());
	}

	/**
	 * 增加
	 */
	@Override
	public void add(Goods goods) {
		//设置未申请状态
		goods.getGoods().setAuditStatus("0");
		goodsMapper.insert(goods.getGoods()); //商品表插入商品
		//商品细节表插入goodDesc扩展数据
		goods.getGoodsDesc().setGoodsId(goods.getGoods().getId());
		goodsDescMapper.insert(goods.getGoodsDesc()); //插入商品扩展数据
		saveItemList(goods);

	}
	//插入sku列表数据
	private void saveItemList(Goods goods){

		if ("1".equals(goods.getGoods().getIsEnableSpec())){
			for (TbItem item:goods.getItemList()){
				//标题 （商品名称+规格）
				String title = goods.getGoods().getGoodsName();//SPU名称
				Map<String,Object> specMap=JSON.parseObject(item.getSpec());
				for(String key:specMap.keySet()){
					title+=""+specMap.get(key);
				}
				item.setTitle(title);
				setItemValus(goods,item);
				itemMapper.insert(item);
			}
		}else {//没有启用规格
			TbItem item = new TbItem();
			item.setTitle(goods.getGoods().getGoodsName()); //商品KPU+规格描述串作为SKU名称

			item.setPrice(goods.getGoods().getPrice()); //价格
			item.setIsDefault("1"); //是否默认
			item.setStatus("1");//状态
			item.setNum(9999); //库存数量
			item.setSpec("{}"); //规格为空
			setItemValus(goods,item);
			itemMapper.insert(item);


		}
	}

	private void setItemValus(Goods goods,TbItem item){

		item.setGoodsId(goods.getGoods().getId());//商品spu编号
		item.setSellerId(goods.getGoods().getSellerId()); //商家id
		item.setCategoryid(goods.getGoods().getCategory3Id()); //商品分类编号(3级)
		item.setCreateTime(new Date()); //创建时间
		item.setUpdateTime(new Date());	//更新时间

		//品牌名称
		TbBrand tbBrand = tbBrandMapper.selectByPrimaryKey(goods.getGoods().getBrandId());
		item.setBrand(tbBrand.getName());
		//分类名称
		TbItemCat tbItemCat = tbItemCatMapper.selectByPrimaryKey(goods.getGoods().getCategory3Id());
		item.setCategory(tbItemCat.getName());
		//商家名称
		TbSeller seller = sellerMapper.selectByPrimaryKey(goods.getGoods().getSellerId());
		item.setSeller(seller.getNickName());
		//图片地址（取第一个图片）
		List<Map>imageList = JSON.parseArray(goods.getGoodsDesc().getItemImages(),Map.class);
		if (imageList.size()>0){
			item.setImage((String) imageList.get(0).get("url"));
		}
	}

	
	/**
	 * 修改
	 */
	@Override
	public void update(Goods goods){
		goods.getGoods().setAuditStatus("0");//修改的商品需要重新设置状态
		goodsDescMapper.updateByPrimaryKey(goods.getGoodsDesc());//更新商品扩展
		goodsMapper.updateByPrimaryKey(goods.getGoods());//更新商品表
		//删除原有的sku列表
		TbItemExample example = new TbItemExample();
		TbItemExample.Criteria criteria = example.createCriteria();
		criteria.andGoodsIdEqualTo(goods.getGoods().getId());
		itemMapper.deleteByExample(example);
		//添加新的sku列表
		saveItemList(goods);

	}
	
	/**
	 * 根据ID获取实体
	 * @param id
	 * @return
	 */
	@Override
	public Goods findOne(Long id){
		Goods goods = new Goods();
		TbGoods tbGoods = goodsMapper.selectByPrimaryKey(id);
		TbGoodsDesc tbGoodsDesc = goodsDescMapper.selectByPrimaryKey(id);
		goods.setGoods(tbGoods);
		goods.setGoodsDesc(tbGoodsDesc);

		//根据goodsid查询item集合 (sku商品列表)
		TbItemExample example = new TbItemExample();
		TbItemExample.Criteria criteria = example.createCriteria();
		criteria.andGoodsIdEqualTo(id); //查询条件 商品id
		List<TbItem> itemList = itemMapper.selectByExample(example);
		goods.setItemList(itemList);

		return goods;
	}

	/**
	 * 批量删除
	 */
	@Override
	public void delete(Long[] ids) {
		for(Long id:ids){
			//修改tb_goods表的is_delete字段为1
			TbGoods goods = goodsMapper.selectByPrimaryKey(id);
			goods.setIsDelete("1");
			goodsMapper.updateByPrimaryKey(goods);
		}
	}
	
	
		@Override
	public PageResult findPage(TbGoods goods, int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);
		
		TbGoodsExample example=new TbGoodsExample();
		Criteria criteria = example.createCriteria();
		criteria.andIsDeleteIsNull();
		
		if(goods!=null){			
						if(goods.getSellerId()!=null && goods.getSellerId().length()>0){
				criteria.andSellerIdEqualTo(goods.getSellerId());
			}
			if(goods.getGoodsName()!=null && goods.getGoodsName().length()>0){
				criteria.andGoodsNameLike("%"+goods.getGoodsName()+"%");
			}
			if(goods.getAuditStatus()!=null && goods.getAuditStatus().length()>0){
				criteria.andAuditStatusLike("%"+goods.getAuditStatus()+"%");
			}
			if(goods.getIsMarketable()!=null && goods.getIsMarketable().length()>0){
				criteria.andIsMarketableLike("%"+goods.getIsMarketable()+"%");
			}
			if(goods.getCaption()!=null && goods.getCaption().length()>0){
				criteria.andCaptionLike("%"+goods.getCaption()+"%");
			}
			if(goods.getSmallPic()!=null && goods.getSmallPic().length()>0){
				criteria.andSmallPicLike("%"+goods.getSmallPic()+"%");
			}
			if(goods.getIsEnableSpec()!=null && goods.getIsEnableSpec().length()>0){
				criteria.andIsEnableSpecLike("%"+goods.getIsEnableSpec()+"%");
			}
			if(goods.getIsDelete()!=null && goods.getIsDelete().length()>0){
				criteria.andIsDeleteLike("%"+goods.getIsDelete()+"%");
			}
	
		}
		
		Page<TbGoods> page= (Page<TbGoods>)goodsMapper.selectByExample(example);		
		return new PageResult(page.getTotal(), page.getResult());
	}

	@Override
	public void updateGoodsStatus(long[] ids, String status) {
		//遍历每个商品id
		for (long id : ids) {
			TbGoods goods = goodsMapper.selectByPrimaryKey(id);
			goods.setAuditStatus(status);
			goodsMapper.updateByPrimaryKey(goods);

		}
	}


}