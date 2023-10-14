import useSWR from "swr";

const fetcher = () => fetch('https://jsonplaceholder.typicode.com/users/1').then(res => res.json())


export function Author() {

  const {data, isLoading, error} = useSWR('author', fetcher)

  if(isLoading){
    return <div>加载中....</div>
  }

  if(error) {
    return <div>页面加载失败</div>
  }

  return (
    <div>{JSON.stringify(data)}</div>
  )
}
