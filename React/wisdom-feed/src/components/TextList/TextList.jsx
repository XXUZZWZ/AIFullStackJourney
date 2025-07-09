const TextList = function(props){
  const {
    textList,
    onScroll,
    currentIndex,
  } = props;
  
 
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
          </div>
        </div>
))}
    </div>
  )
}

export default TextList;