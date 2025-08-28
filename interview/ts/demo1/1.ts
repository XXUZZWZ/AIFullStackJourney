let a:any = 1; // any  任何类型 ts 新手 狂用any
a = "1";

function getFirstElement(arr: any[]): any {
  return arr[0];
}
// 复用性 
const nums = [1,23,3,434]
const firstElement = getFirstElement(nums);
console.log(firstElement);

const strs = ['a','b','c']

const firstStr = getFirstElement(strs);
console.log(firstStr);

// 复用型 这个函数同时可以传入多种类型，而且返回类型由传入参数规定

function getFirstElementT<T>(arr:T[]):T{
  return arr[0];
}
const Nums = [1,2,3,4,4,5,0]
const firstNUM = getFirstElementT<number>(Nums)
firstNUM?.toFixed(2);
// 减少any的使用 而是使用泛型

const Strs = ['we','are','friends']
// 自动类型推导
const FStr = getFirstElementT(Strs); 
