import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div className="max-w-xs  rounded-lg overflow-hidden bg-amber-100 transition-transfrom duration-500 hover:shadow-xl hover:scale-105 mx-auto">
//         <div className="relative">
//           <img
//             src='https://tse2.mm.bing.net/th/id/OIP.sVMWX_86VuwjMYC_80gywQHaEK?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3'
//             className='w-full h-64 object-cover '
//           />
//           <span className="absolute top-2 left-2 bg-red-400 text-white text-xs font-bold px-2 py-1 rounded">New</span>
//           {/* 矢量图 数学计算 可以无限放大 区别于像素图 */}
//           <button className='absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors '>
//             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//             </svg>
//           </button>
//         </div>

//         <div className="p-4">
//           <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">  芙莉莲 <br />芙莉莲芙莉莲芙莉莲芙莉莲芙莉莲 </h3>
//           <p className="text-sm text-gray-500 mt-1 line-clamp-2">
//             芙莉莲，日本漫画《葬送的芙莉莲》及其衍生作品中的女主角。打倒魔王的勇者一行的魔法使，长寿的精灵族，人类族大魔法使伏拉梅的徒弟。芙莉莲在小时候所居住的村子被魔族屠村，而她在杀死魔族将军后为大魔法使伏拉梅所救，并成为了伏拉梅的徒弟。因替人类研究解析杀人魔法作出巨大贡献并葬送最多魔族性命，被魔族称为“葬送的芙莉莲”。
//           </p>
//           <div className="flex items-center mt-2 ">
//             <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
//               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//             </svg>
//             <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
//               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//             </svg>
//             <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
//               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//             </svg>
//             <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
//               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//             </svg>
//             <svg class="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">
//               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//             </svg>
//             <span className="text-sm text-gray-500">4.5 (233 review)</span>
//           </div>
//         </div>
//         <div class="mt-3 flex items-center justify-between">
//           <span class="text-xl font-bold text-gray-900">$199.99</span>
//           <span class="text-sm text-gray-500 line-through">$249.99</span>
//         </div>


//         <button class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
//           Add to Cart
//         </button>

//         <button class="mt-2 w-full text-blue-600 hover:text-blue-800 text-sm font-medium mb-4">
//           Quick View
//         </button>
//       </div>


//     </>
//   )
// }
function App() {
  return (
    <div className="App">
      <div className='rounded'>
        <div className="rounded-t-2xl bg-blue-400 h-30 text-6xl text-gray-200 flex items-center justify-center ">
          BANNER
        </div>
        <div className="bg-gray-300 w-20 h-20 m-auto rounded-full "></div>
        <h2 className='  '>张小明</h2>
      </div>
    </div>
  )
}

export default App
