import { useRef, useState, useCallback } from "react";

const VirtualList = ({
  data,
  height,
  itemHeight,
  renderItem,
  overscan = 3 // 默认缓冲区为3个项目
}) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  // 计算总高度
  const totalHeight = data.length * itemHeight;
  
  // 计算可见区域的起始和结束索引
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(height / itemHeight),
    data.length - 1
  );
  
  // 考虑缓冲区的实际渲染范围
  const visibleStartIndex = Math.max(0, startIndex - overscan);
  const visibleEndIndex = Math.min(data.length - 1, endIndex + overscan);
  
  // 可见项目数组
  const visibleItems = [];
  for (let i = visibleStartIndex; i <= visibleEndIndex; i++) {
    visibleItems.push({
      index: i,
      data: data[i]
    });
  }
  
  // 滚动事件处理
  const onScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);
  
  // 可见区域的偏移量
  const offsetY = visibleStartIndex * itemHeight;
  
  return (
    <>
     <div 
     ref={containerRef}
     onScroll={onScroll}
     style={{
      height,
      overflowY:'auto',
      position:'relative',
      // 性能优化点，分离出新图层
      willChange:'transform'
     }
     }
     >
          {/* 总容器，撑开滚动条 */}
          <div
          style={{height:totalHeight,position:"relative"}}
          >
          {/* 可见项目容器 */}
          <div style={{
            position:'absolute',
            top:0,
            left:0,
            right:0,
            transform:`translateY(${offsetY}px)`
          }}>
            {/* 渲染可见项目 */}
            {visibleItems.map(({ index, data: item }) => (
              <div
                key={index}
                style={{
                  height: itemHeight,
                  overflow: 'hidden'
                }}
              >
                {renderItem(item, index)}
              </div>
            ))}
          </div>
          </div>
     </div>
    </>
  )
}

export default VirtualList;