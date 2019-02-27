package com.pinyougou.sellergoods.service;


import com.pinyougou.pojo.TbBrand;
import entity.PageResult;

import java.util.List;
import java.util.Map;

/**
 * 品牌服务层接口
 */
public interface BrandService {

    /**
     * 返回全部列表
     */

    public List<TbBrand> findAll();

    /**
     * 品牌分页
     * @param pageNum
     * @param pageSize
     * @return
     */
    public PageResult findPage(int pageNum,int pageSize);

    /**
     * 保存新建品牌
     * @param tbBrand
     */
    public void add (TbBrand tbBrand);

    /**
     * 修改品牌
     * @param tbBrand
     */
    public void update(TbBrand tbBrand);

    /**
     *根据id获取实体
     * @param id
     * @return
     */
    public TbBrand findOne(long id);

    /**
     * 批量删除
     * @param ids
     */
    public void delete(long[] ids);

    /**
     * 条件查询
     * @param num
     * @param size
     * @return
     */
    PageResult search(int num, int size,TbBrand tbBrand);

    List<Map>findOptionList();
}
