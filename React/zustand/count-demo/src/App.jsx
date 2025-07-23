import './App.css'
import { create } from 'zustand'
import {Counter} from './components/Counter' 
import TodoList from './components/TodoList'
import {useCounterStore } from './store/count'
import RepoList from './components/RepoList'
const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))
function App() {
  const count = useCounterStore(state=>state.count); 
  const bears = useBearStore((state) => state.bears)
  const increasePopulation = useBearStore((state) => state.increasePopulation)
  return (
    <>
      <Counter />
      <TodoList />
      <button onClick={increasePopulation}>one up {bears} </button>
      <br />
      <h3>APP count: {count}</h3>
      <RepoList/>
    </>
  )
}

export default App
