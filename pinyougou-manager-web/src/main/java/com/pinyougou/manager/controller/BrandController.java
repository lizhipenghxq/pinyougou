package com.pinyougou.manager.controller;


import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.sellergoods.service.BrandService;
import entity.PageResult;
import entity.Result;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 品牌controller
 */
@RestController
@RequestMapping("/brand")
public class BrandController {
    @Reference
    private BrandService brandService;

    /**
     * 返回全部列表
     */
    @RequestMapping("/findAll")
    public List<TbBrand> findAll() {
        return brandService.findAll();
    }

    /**
     * 分页查询
     *
     * @param num
     * @param size
     * @return
     */
    @RequestMapping("/findPage")
    public PageResult findPage(int num, int size) {
        return brandService.findPage(num, size);
    }

    /**
     * 条件查询+分页
     *
     * @param num
     * @param size
     * @return
     */
    @RequestMapping("/search")
    public PageResult search(int num, int size, @RequestBody TbBrand tbBrand) {
        return brandService.search(num, size, tbBrand);
    }

    /**
     * 增加
     *
     * @param tbBrand
     */
    @RequestMapping("/add")
    public Result add(@RequestBody TbBrand tbBrand) {

        try {
            brandService.add(tbBrand);
            return new Result(true, "成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "失败");
        }
    }

    /**
     * 修改
     *
     * @param tbBrand
     * @return
     */
    @RequestMapping("/update")
    public Result update(@RequestBody TbBrand tbBrand) {
        try {
            brandService.update(tbBrand);
            return new Result(true, "修改成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "修改失败");
        }
    }

    /**
     * 获取实体
     *
     * @param id
     * @return
     */
    @RequestMapping("/findOne")
    public TbBrand findOne(long id) {
        TbBrand one = brandService.findOne(id);
        return one;
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @RequestMapping("/delete")
    public Result delete(long[] ids) {
        try {
            brandService.delete(ids);
            return new Result(true, "删除成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "删除失败");
        }
    }

    @RequestMapping("/findOptionList")
    public List<Map> findOptionList(){
        return brandService.findOptionList();
    }
}
