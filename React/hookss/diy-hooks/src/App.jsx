import { useEffect, useRef } from 'react';
import useInterval2 from './hooks/useInterval2';

function App() {
  const countRef = useRef(0);

  useEffect(() => {
    const clearInterval = useInterval2(() => {
      countRef.current += 1;
      console.log('Count:', countRef.current);
    }, 1000);

    // 清理函数
    return () => clearInterval();
  }, []);

  return <div>Count: {countRef.current}</div>;
}

export default App;