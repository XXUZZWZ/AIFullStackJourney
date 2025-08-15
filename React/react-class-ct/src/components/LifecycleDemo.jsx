import { Component } from "react";


// 纯 UI 展示 StatelessComponent 性能优化
//  无状态
const Chiild = ({ count }) => {
  return (
    <div>
      <h2> 目前的 count 值为 {count} </h2>
      <button>{count}</button>

    </div>
  )
}

class LifecycleDemo extends Component {
  // 状态 生命周期
  // JSX 
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      name: "LifecycleDemo"
    };

    console.log("constructor");
  }
  componentDidMount() {
    console.log('组件挂载了')
  }
  componentDidUpdate() {
    console.log('组件更新了')
  }
  componentWillUnmount() {
    console.log("componentWillUnmount");
  }
  doDecrement() {
    this.setState({ count: this.state.count - 1 });
    console.log("doDecrement", this);
  }

  render() {
    console.log("render");
    return (
      <div>
        <h1>LifecycleDemo</h1>
        <h1>{this.state.name}</h1>
        <h1>{this.state.count}</h1>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          +1
        </button>
        <button
          onClick={() => this.doDecrement()}
        >-1</button>
        <button
          onClick={() => this.doDecrement().bind(this)}
        >- -1</button>
        <button onClick={() => this.setState({ name: "LifecycleDemo" + Math.random() })}>
          change name
        </button>
        <Chiild count={this.state.count} />
      </div>
    )
  }
}
export default LifecycleDemo;