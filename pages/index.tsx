import { env } from '../env/server'
import { useEffect } from 'react'
import axios from 'axios'
import { useInfiniteQuery } from 'react-query'
import { useInView } from 'react-intersection-observer'


export default function Home() {
  const { ref, inView } = useInView()
  const { data, isFetchingNextPage, isLoading, isError, error, fetchNextPage } = useInfiniteQuery('posts', async ({ pageParam = '' }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 1000))
    const res = await axios('/api/post?cusor=' + pageParam)
    return res.data
  }, {
    getNextPageParam: (lastPage) => {
      return lastPage.nextId ?? false
    }
  })
  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])

  if (isLoading) return <div className="loading">Loading...</div>
  if (isError) return <div>Error! {JSON.stringify(error)}</div>


  return (
    <div className="container">
      {data &&
        data.pages.map((page) => {
          return (
            <div key={page.nextId ?? 'lastPage'}>
              {page.posts.map((post: { id: number; title: string; createdAt: Date }) => (
                <div className="post" key={post.id}>
                  <p>{post.id}</p>
                  <p>{post.title}</p>
                </div>
              ))}
            </div>
          )
        })}

      {isFetchingNextPage ? <div className="loading">Loading...</div> : null}

      <span style={{ visibility: 'hidden' }} ref={ref}>
        intersection observer marker
      </span>
    </div>
  )
}
