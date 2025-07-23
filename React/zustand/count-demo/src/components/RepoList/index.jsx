import {useRepoStore} from '../../store/repos'
import { useEffect } from 'react'

const RepoList = () => {
  const {repos,loading,error,fetchRepos} = useRepoStore() 

  useEffect(()=>{
    fetchRepos()
  },[])
  if(loading) return <p>loading</p>
  else if(error) return <p>{error}</p>
  return (
    <div>
       {
        repos.map(
          (repo)=>(
            <div key={repo.id}>
              <p>{repo.name}</p>
              <a 
              href={repo.html_url}
              target='_blank'
              rel='noreferrer'
              // 告诉搜索引擎的爬虫忽略这个链接
              >{repo.name}</a>
              <p>{repo.description||'无简介'}</p>
            </div>
          )
        )
       }
    </div>
  )

}

export default RepoList