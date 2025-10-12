import React, {
  useEffect, useState, useCallback
} from 'react';
import { type Component, useComponentsStore } from '../../stores/components';
import { useComponentConfigStore } from '../../stores/component-config';

export  function EditArea() {
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const [renderedComponents, setRenderedComponents] = useState<React.ReactNode[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  // useEffect(() => {
  //   addComponent({
  //     id: 222,
  //     name: 'Container',
  //     props: {},
  //     children: []
  //   }, 1);
  //    addComponent({
  //     id: 333,
  //     name: 'Button',
  //     props: {},
  //     children: []
  //   }, 222)
  //   // setTimeout(() => {
  //   //   deleteComponent(333);
  //   // }, 3000)
  // }, [])

  // 同步渲染子组件（用于递归调用）
  const renderComponentsSync = useCallback((components: Component[]): React.ReactNode => {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];
      if (!config?.component) {
        return null;
      }
      return React.createElement(
        config.component,
        {
          key: component.id,
          id: component.id,
          ...config.defaultProps,
          ...component.props
        },
        renderComponentsSync(component.children || [])
      );
    });
  }, [componentConfig]);

  // 异步渲染组件树
  const renderComponentsAsync = useCallback((components: Component[]) => {
    if (isRendering) return;
    
    setIsRendering(true);
    const result: React.ReactNode[] = [];
    let currentIndex = 0;
    
    const renderBatch = (deadline?: IdleDeadline) => {
      const startTime = performance.now();
      const timeSlice = 5; // 每批处理5ms
      
      while (currentIndex < components.length && 
             (deadline ? deadline.timeRemaining() > timeSlice : performance.now() - startTime < timeSlice)) {
        const component = components[currentIndex];
        const config = componentConfig?.[component.name];
        
        if (config?.component) {
          result.push(
            React.createElement(
              config.component,
              {
                key: component.id,
                id: component.id,
                ...config.defaultProps,
                ...component.props
              },
              // 递归渲染子组件（同步，因为子组件通常较少）
              renderComponentsSync(component.children || [])
            )
          );
        }
        currentIndex++;
      }
      
      if (currentIndex < components.length) {
        // 继续下一批渲染
        if (typeof window.requestIdleCallback === 'function') {
          requestIdleCallback(renderBatch);
        } else {
          // 降级到setTimeout
          setTimeout(() => renderBatch(), 0);
        }
      } else {
        // 渲染完成
        setRenderedComponents(result);
        setIsRendering(false);
      }
    };
    
    // 开始异步渲染
    if (typeof window.requestIdleCallback === 'function') {
      requestIdleCallback(renderBatch);
    } else {
      // 降级到setTimeout
      setTimeout(() => renderBatch(), 0);
    }
  }, [componentConfig, isRendering, renderComponentsSync]);

  // 监听组件变化，触发异步渲染
  useEffect(() => {
    renderComponentsAsync(components);
  }, [components, renderComponentsAsync]);

  return (
    <div className='h-full overflow-y-auto'>
      {/* <pre>
        {JSON.stringify(components, null, 2)}
      </pre> */}
      {isRendering && (
        <div className="p-4 text-center text-gray-500">
          正在渲染组件...
        </div>
      )}
      {renderedComponents}
    </div>
  )
}