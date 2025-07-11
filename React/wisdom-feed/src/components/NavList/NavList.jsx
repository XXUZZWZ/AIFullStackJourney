import  useUserId  from "@/hooks/useUserId";

const NavList = () =>{
  const userId = useUserId(); // Accessing userId from context
  return (
    <div className="nav-list">
      <div className="nav-item">Home</div>
      <div className="nav-item">+</div>
      <div className="nav-item">Profile {userId}</div>
    </div>

  )
}
export default NavList;