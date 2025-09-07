import Link from "next/link";
const Profile = () => {
  return (
    <>
      <h1>Profile</h1>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/login">Login</Link>
    </>
  )
}
export default Profile;