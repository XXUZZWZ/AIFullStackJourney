import {
  useState
}from "react";
import {Link,Navigate,useParams} from "react-router-dom";
 const UserProfile = () =>{
  const handleClick = () =>{
    Navigate("/");
  }
  const {id} = useParams();
  console.log(window.location);
 

  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {id}</p>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <button onClick={handleClick}>Home</button>
      
    
    </div>
  )
}
export default UserProfile;