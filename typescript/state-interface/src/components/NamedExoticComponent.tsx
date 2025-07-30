import React from "react";

interface Props{
  userName:string;
  onChange:()=>void;
}
const NamedExoticComponent:React.FC<Props> = (props) =>{
  return (

    <div>
      NamedExoticComponent
      <label htmlFor="inp">updateName</label>
      <input 
      type="text"  
      id="inp" 
      value={props.userName}
      onChange={props.onChange}
      />
    </div>

  )
}

export default NamedExoticComponent;