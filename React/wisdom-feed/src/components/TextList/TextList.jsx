const TextList = function(props){
  const {textList} = props;

  return (
    <div className="text-container">
      {textList.map((text, index) => (
        <div key={index} className="text-item">
          <div className="text">
            {text}
          </div>
        </div>
))}
    </div>
  )
}

export default TextList;