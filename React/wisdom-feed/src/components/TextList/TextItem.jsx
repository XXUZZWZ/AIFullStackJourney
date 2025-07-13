const TextItem = function(props) { 
  const {
    text,
    currentIndex,
    userId,
  } = props;
  return (
    <div>
      <div 
      className="text-item"
      key={currentIndex}
      >
        <div className="text"> 
            <h3>{text}</h3>
        </div>
        {/* <div className="user-id">{userId}</div> */}
      </div>
    </div>
  )
}
export default TextItem;