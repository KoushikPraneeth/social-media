import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Post, Comment } from '../../types'
import { formatDate } from '../../lib/utils'
import { CommentsList } from './CommentsList'
import { ShareModal } from './ShareModal'
import { posts } from '../../lib/api'

interface PostCardProps {
  post: Post
  onLike?: (postId: number) => void
  onComment?: (postId: number, content: string) => void
  onShare?: (postId: number) => void
}

export function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [isCommenting, setIsCommenting] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [areCommentsVisible, setAreCommentsVisible] = useState(false)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('areCommentsVisible changed:', areCommentsVisible)
    if (areCommentsVisible) {
      loadComments()
    }
  }, [areCommentsVisible])

  const loadComments = async () => {
    try {
      console.log('Loading comments for post:', post.id)
      setIsLoading(true)
      setError(null)
      const response = await posts.getComments(post.id)
      console.log('Comments loaded:', response.data.data)
      setComments(response.data.data)
    } catch (error) {
      console.error('Failed to load comments:', error)
      setError('Failed to load comments. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCommentSubmit = async () => {
    if (commentContent.trim() && onComment) {
      try {
        console.log('Adding comment:', commentContent)
        await onComment(post.id, commentContent)
        const newComment = await posts.addComment(post.id, commentContent)
        console.log('Comment added:', newComment.data)
        setComments(prev => [newComment.data, ...prev])
        setCommentContent('')
        setIsCommenting(false)
        // Ensure comments section remains visible after posting
        setAreCommentsVisible(true)
      } catch (error) {
        console.error('Failed to add comment:', error)
        setError('Failed to add comment. Please try again.')
      }
    }
  }

  const handleShare = async () => {
    try {
      console.log('Sharing post:', post.id)
      await onShare?.(post.id)
      setIsShareModalOpen(true)
    } catch (error) {
      console.error('Failed to share post:', error)
      setError('Failed to share post. Please try again.')
    }
  }

  const toggleComments = () => {
    console.log('Toggling comments visibility')
    setAreCommentsVisible(!areCommentsVisible)
    setIsCommenting(false)
  }

  const showCommentInput = () => {
    console.log('Showing comment input')
    setIsCommenting(true)
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div>
              <Link 
                to={`/user/${post.user.id}`}
                className="text-sm font-semibold hover:underline"
              >
                {post.user.username}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.timestamp)}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <p className="text-sm">{post.content}</p>
          {post.imageUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={post.imageUrl}
                alt="Post image"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between border-t p-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onLike?.(post.id)}
          className="flex items-center space-x-2"
        >
          <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current text-red-500" : ""}`} />
          <span className="text-xs">{post.likesCount}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center space-x-2"
          onClick={toggleComments}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{post.commentsCount || 0}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center space-x-2"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          <span className="text-xs">{post.shareCount || 0}</span>
        </Button>
        <ShareModal 
          postId={post.id} 
          isOpen={isShareModalOpen} 
          onClose={() => setIsShareModalOpen(false)} 
        />
      </div>
      {areCommentsVisible && !isCommenting && (
        <div className="border-t p-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={showCommentInput}
          >
            Write a comment...
          </Button>
        </div>
      )}
      {isCommenting && (
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <Button 
              variant="default" 
              size="sm"
              onClick={handleCommentSubmit}
              disabled={!commentContent.trim()}
            >
              Post
            </Button>
          </div>
        </div>
      )}
      {areCommentsVisible && (
        <div className="border-t p-4">
          {error && (
            <div className="mb-4 text-sm text-red-500">{error}</div>
          )}
          {isLoading ? (
            <div className="flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : comments.length > 0 ? (
            <CommentsList comments={comments} />
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              No comments yet
            </div>
          )}
        </div>
      )}
    </div>
  )
}
