// 数据库存的是啥？？
// 多级列表，在数据中怎么存储
// 树形结构菜单
// 解决了场景题
/*
id   title   parent
86   中国     null
36   江西     86
0591 抚州     36
11201临川     0591
 */

const sourceList = [
  {
    id: 1,
    name: "电子产品",
    parentId: null,
  },
  {
    id: 2,
    name: "电脑",
    parentId: 1,
  },
  {
    id: 3,
    name: "手机",
    parentId: 1,
  },
  {
    id: 4,
    name: "折叠屏",
    parentId: 3,
  },
  {
    id: 5,
    name: "手机膜",
    parentId: 3,
  },
  {
    id: 6,
    name: "手机壳",
    parentId: 3,
  },
];


function list2tree(list) {
  
}
