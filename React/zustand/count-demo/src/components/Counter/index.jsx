import {useCounterStore} from  '../../store/count'
export const Counter = () =>{
  
  const {
    count,
    increment,
    decrement
  } = useCounterStore()

  return (
    <div>
      <h2>Counter</h2>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
}

 