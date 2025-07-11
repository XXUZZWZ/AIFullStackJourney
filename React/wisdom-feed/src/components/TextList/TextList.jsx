import useUserId from "../../hooks/useUserId";

const TextList = function(props){
  const {
    textList,
    onScroll,
    currentIndex,
  } = props;

const userId = useUserId(); // Using the custom hook to get userId
 
  return (
    <div 
    className="text-container" 
    onScroll={onScroll} 
    >
      {textList.map((text, index) => (
        
        <div 
        key={index}
        className="text-item"
        >
          <div className="text">
            {text}
            {userId}
          </div>
        </div>
))}
    </div>
  )
}

export default TextList;