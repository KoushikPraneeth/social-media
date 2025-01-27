import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { PostCard } from '../posts/PostCard'
import { Post } from '../../types'
import { posts } from '../../lib/api'
import { useToast } from '../../contexts/ToastContext'
import { Button } from '../ui/button'

export function HashtagView() {
  const { tag } = useParams<{ tag: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hashtagPosts, setHashtagPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { showToast } = useToast()

  const fetchHashtagPosts = async (pageNum: number = 1) => {
    if (!tag) return
    if (pageNum === 1) setLoading(true)
    setError(null)

    try {
      const { data } = await posts.getHashtagPosts(tag, pageNum)
      if (pageNum === 1) {
        setHashtagPosts(data.data)
      } else {
        setHashtagPosts(prev => [...prev, ...data.data])
      }
      setHasMore(data.hasMore)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch posts'
      setError(errorMessage)
      showToast({
        title: 'Error',
        description: errorMessage,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHashtagPosts()
    // Reset page when tag changes
    setPage(1)
  }, [tag])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchHashtagPosts(nextPage)
  }

  const handleLike = async (postId: number) => {
    try {
      await posts.like(postId)
      setHashtagPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, likes: post.likes + 1, isLiked: true }
            : post
        )
      )
    } catch (err: any) {
      showToast({
        title: 'Error',
        description: 'Failed to like post',
        type: 'error',
      })
    }
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
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold">#{tag}</h1>
        <span className="text-muted-foreground">
          {hashtagPosts.length} {hashtagPosts.length === 1 ? 'post' : 'posts'}
        </span>
      </div>

      <div className="space-y-6">
        {hashtagPosts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} />
        ))}

        {hashtagPosts.length === 0 && (
          <p className="text-center text-muted-foreground">
            No posts found with #{tag}
          </p>
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
