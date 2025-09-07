import Link from "next/link";
const Dashboard = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <Link href="/login">Login</Link>
      <Link href="/profile">Profile</Link>

    </>
  )
}

export default Dashboard;