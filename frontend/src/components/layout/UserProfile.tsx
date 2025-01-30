import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, UserCircle2 } from 'lucide-react'
import { Button } from '../ui/button'
import { PostCard } from '../posts/PostCard'
import { User, Post } from '../../types'
import { posts, users } from '../../lib/api'
import { useToast } from '../../contexts/ToastContext'

export function UserProfile() {
  const { username } = useParams<{ username: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { showToast } = useToast()

  const fetchUserData = async () => {
    if (!username) return
    setLoading(true)
    setError(null)

    try {
      // Fetch user details
      const userResponse = await users.getById(username)
      setUser(userResponse.data.data)

      // Fetch initial posts
      await fetchUserPosts(1)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch user data'
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

  const fetchUserPosts = async (pageNum: number) => {
    if (!username) return

    try {
      const { data } = await posts.getUserPosts(username, pageNum)
      if (pageNum === 1) {
        setUserPosts(data.data)
      } else {
        setUserPosts(prev => [...prev, ...data.data])
      }
      setHasMore(data.hasMore)
    } catch (err: any) {
      showToast({
        title: 'Error',
        description: 'Failed to fetch posts',
        type: 'error',
      })
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [username])

  const handleFollow = async () => {
    if (!user || !username) return
    try {
      if (user.isFollowing) {
        await users.unfollow(username)
      } else {
        await users.follow(username)
      }
      setUser(prev => prev ? { ...prev, isFollowing: !prev.isFollowing } : null)
    } catch (err: any) {
      showToast({
        title: 'Error',
        description: 'Failed to update follow status',
        type: 'error',
      })
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchUserPosts(nextPage)
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
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <UserCircle2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.username}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="mt-2 flex items-center space-x-4">
                <span className="text-sm">
                  <strong>{user?.followersCount || 0}</strong> followers
                </span>
                <span className="text-sm">
                  <strong>{user?.followingCount || 0}</strong> following
                </span>
              </div>
            </div>
          </div>
          {user && username !== user.username && (
            <Button
              variant={user.isFollowing ? "outline" : "default"}
              onClick={handleFollow}
            >
              {user.isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {userPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {userPosts.length === 0 && (
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
