import React, { useState, useEffect } from 'react'
import { CreatePost } from '../posts/CreatePost'
import { PostCard } from '../posts/PostCard'
import { Post } from '../../types'
import { posts } from '../../lib/api'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'

export function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = async (pageNum: number = 1) => {
    try {
      const response = await posts.getAll(pageNum - 1) // Spring Page starts at 0
      const { data, hasMore } = response.data
      if (pageNum === 1) {
        setAllPosts(data)
      } else {
        setAllPosts(prev => [...prev, ...data])
      }
      setHasMore(hasMore)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleLike = async (postId: number) => {
    try {
      await posts.like(postId)
      setAllPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, likes: post.likes + 1, isLiked: true }
            : post
        )
      )
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(nextPage)
  }

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CreatePost onSuccess={() => fetchPosts(1)} />
      <div className="space-y-6">
        {allPosts && allPosts.length > 0 ? (
          allPosts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))
        ) : (
          <p className="text-center text-muted-foreground">No posts yet</p>
        )}
        {hasMore && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
