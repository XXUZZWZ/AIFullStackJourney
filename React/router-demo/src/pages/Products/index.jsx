import { 
  Outlet,
  Link,
  useNavigate
 } from "react-router-dom";
const Products = () => {
  const navigate = useNavigate();
  const  handleClick = () =>{
    navigate("/home");
  }
  return (
    <div>
      <h1>Products</h1>
      {/* 二级路由的占位符 */}
      <Link to="/products/new">New Products</Link>
     
      <br />
      <Link to={"/"}>home</Link>
      <Outlet/>
      <div>
      <button
      onClick={handleClick}
      >
        to home
      </button>
      </div>
    </div>
  )
}

export default Products;