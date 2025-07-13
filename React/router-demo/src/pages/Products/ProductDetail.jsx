import {
  Link,
}
from 'react-router-dom'
const ProductDetail = () =>{
  return (
    <div>
      <h1>Product Detail</h1>
      <Link to="/products">Back to Products</Link>
      <Link to="/">Home</Link>
    </div>
  )
}

export default ProductDetail