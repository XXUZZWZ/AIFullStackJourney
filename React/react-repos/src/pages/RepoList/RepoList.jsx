import { useParams,Navigate,useNavigate } from "react-router-dom"
import {
  useEffect
}from "react"
import {Link}from "react-router-dom"
import {
  useRepos
}from '../../hooks/useRepos'
const RepoList = ()=>{
  const {id} = useParams()
  console.log(id)
  const navigate = useNavigate();
  const state =  useRepos(id);
  let  {repos,loading,error} = state;
  

  // console.log(repos,loading,error)
  // hooks 
  // useEffect(()=>{
  //   if(!id.trim()) {
  //     navigate("/")
  //     return;
  //    }
  // },[]);
  // if(loading) return <div>Loading...</div>
  // if(error) return <div>{error}...</div>
  return (
    <>
        <h1>Repositories for {id}</h1>
        {
         repos.map((repo)=>(
          <div key={repo.id+Date.now()}>
            <Link to={`/users/${id}/repos/${repo.id}`}>
              <h2>{repo.name}</h2>
            </Link>
          </div>
         ))
        }
        </>
  )
}

export default RepoList