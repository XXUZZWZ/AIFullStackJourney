
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
}from '@/components/ui/card'
import {type Repo} from '@/app/types/repos'
export default async  function Repos(){
  // 在服务器端获取数据
  // const response = await fetch('/api/repos');
  // const repos = await response.json();

  const response  = await fetch('https://api.github.com/users/XXUZZWZ/repos');
  const repos:Repo[] = await response.json();
  
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Github Repos</h1>
      {
        repos.map((repo:Repo)=>(
          <Card key={repo.id}>
            <CardHeader>
              <CardTitle>{repo.name}</CardTitle>
              <CardDescription>{repo.description}</CardDescription>
            </CardHeader>
          </Card>
        ))
      }
    </main>
  )
}