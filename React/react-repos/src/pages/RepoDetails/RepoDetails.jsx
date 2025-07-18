import {useRepos} from '../../hooks/useRepos'
import {useParams} from 'react-router-dom'
const RepoDetails = () =>{
  
  const {repoId,id} = useParams();
  const {repos,loading} = useRepos(id);
  const repo = repos.find(repo => repo.id == repoId);
  console.log(repos)
  console.log(repoId)
  console.log(repo)
  if(loading){
    return <div>Loading...</div>
  }
  return (
  <>
    <div>RepoDetails</div>
   {/* <h1>{repo.id}</h1> */}
    {/* <p>description{repo.description === null?"无":repo.description}</p> */}
    {/* <p>language:{repo.language}</p> */}
    {/* <p>stargazers_count{repo.stargazers_count}</p> */}
    <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0', fontFamily: 'Arial, sans-serif' }}>
  {Object.keys(repo)
    .filter(key => typeof repo[key] !== 'object')
    .map(key => (
      <li 
        key={key} 
        style={{ 
          padding: '6px 12px',
          marginBottom: '4px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          display: 'flex'
        }}
      >
        <span style={{ 
          fontWeight: 'bold', 
          minWidth: '120px',
          color: '#24292e'
        }}>{key}:</span>
        <span style={{
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: '#586069'
        }}>{String(repo[key])}</span>
      </li>
  ))}
</ul>
  </>
  )
}

export default RepoDetails