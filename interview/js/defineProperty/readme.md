# 响应式底层原理

- DOM API --> 响应式业务
- Object.defineProperty(obj,"value",{
  get : function(){},
  set : function(){},
  })

- 对对象上的 set 和 get 方法进行重新定义 也就是拦截，在完成本来要完成的职责同时，去做 dom 更新
  这就是响应式

- 缺点： 每次只能定义一个属性

- 属性描述符 (propertyDescriptor)
  - configurable : false 不能删除也不能配置 writeable 等属性 ，属性变换为不可配置
  - enumerable : false 不能枚举
