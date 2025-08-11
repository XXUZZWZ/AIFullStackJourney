// 进度条组件 
const Progress = ({ text, precentage = 0, }) => {
  return (
    <div className="relative m-5 text-black bg-white rounded-lg text-left overflow-hidden">
      <div className="px-2 w-[1%] h-full bg-blue-500  whitespace-nowrap"
        style={{
          width: `${precentage}%`
        }}
      >
        {text} {`${precentage.toFixed(2)}%`}
      </div>
    </div>
  )
}
export default Progress;