import useUserId from "../../hooks/useUserId";
import TextItem from "./TextItem";
const TextList = function(props){
  const {
    textList,
    onScroll,
    currentIndex,
    ref,
  } = props;

const userId = useUserId(); // Using the custom hook to get userId
 
  return (
    <div 
    className="text-container"  
    ref={ref}
    onScroll={onScroll}
    >
    {
      currentIndex===0&&<div className="isLoadingAll">scroll to top will reload all</div>
    }
    {
      textList.map((text,index) => (
          <TextItem
            key = {index}
            text={text}
            currentIndex={currentIndex}
            userId={userId}
          />
      ))
    }
    </div>
  )
}

export default TextList;