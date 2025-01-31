import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Post, Comment } from '../../types'
import { formatDate, getFullImageUrl } from '../../lib/utils'
import { CommentsList } from './CommentsList'
import { ShareModal } from './ShareModal'
import { posts } from '../../lib/api'
import { useAuth } from '../../contexts/auth/AuthContext'
import { useToast } from '../../contexts/ToastContext'

interface PostCardProps {
  post: Post
  onComment?: (postId: number, content: string) => void
  onShare?: (postId: number) => void
  onPostDelete?: () => void
}

export function PostCard({ post, onComment, onShare, onPostDelete }: PostCardProps) {
  const [isCommenting, setIsCommenting] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [areCommentsVisible, setAreCommentsVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [localPost, setLocalPost] = useState<Post>(post)
  const { isAuthenticated, username } = useAuth()
  const { showToast } = useToast()

  // Update localPost when post prop changes
  useEffect(() => {
    setLocalPost(post);
  }, [post]);

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
      const response = await posts.getComments(post.id, 0, 10) // Start from page 0
      console.log('Comments API response:', response)
      if (response.data && Array.isArray(response.data.data)) {
        console.log('Comments loaded:', response.data.data)
        setComments(response.data.data)
      } else {
        console.error('Invalid response format:', response)
        setError('Invalid response format from server')
      }
    } catch (error) {
      console.error('Failed to load comments:', error)
      setError('Failed to load comments. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCommentSubmit = async () => {
    if (!commentContent.trim() || !username || !isAuthenticated) return;

    setIsSubmittingComment(true);
    const originalPost = localPost;
    const now = new Date().toISOString();
    const tempComment: Comment = {
      id: Date.now(), // Temporary ID
      content: commentContent,
      createdAt: now,
      user: {
        id: 0, // Temporary ID
        username,
        email: '', // Will be updated with real data on refresh
        createdAt: now,
        profileUrl: `/user/${username}`
      },
      postId: localPost.id
    };

    try {
      // Optimistically update UI
      setComments(prev => [tempComment, ...prev]);
      setLocalPost(prev => ({
        ...prev,
        commentsCount: (prev.commentsCount || 0) + 1
      }));
      
      // Make API call
      await posts.addComment(localPost.id, commentContent);
      
      // Clear input and update UI state
      setCommentContent('');
      setIsCommenting(false);
      setAreCommentsVisible(true);
      
      // Refresh comments to get server-generated IDs
      await loadComments();
    } catch (err) {
      console.error('Failed to add comment:', err);
      // Revert optimistic updates
      setComments(prev => prev.filter(c => c.id !== tempComment.id));
      setLocalPost(originalPost);
      setError('Failed to add comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated || !localPost || localPost.isLiked) return;

    const originalPost = localPost;
    try {
      // Optimistic update
      setLocalPost(prev => ({
        ...prev,
        likesCount: prev.likesCount + 1,
        isLiked: true
      }));

      await posts.like(localPost.id);
    } catch (err) {
      // Rollback on error
      setLocalPost(originalPost);
      showToast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        type: "error"
      });
    }
  };

  const handleShare = async () => {
    try {
      console.log('Sharing post:', localPost.id)
      await posts.share(localPost.id)
      setIsShareModalOpen(true)
      if (onShare) {
        onShare(localPost.id)
      }
    } catch (error) {
      console.error('Failed to share post:', error)
      setError('Failed to share post. Please try again.')
    }
  }

  const handleDelete = async () => {
    try {
      await posts.delete(localPost.id)
      showToast({
        title: "Success",
        description: "Post deleted successfully",
        type: "success"
      })
      if (onPostDelete) {
        onPostDelete()
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
      showToast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        type: "error"
      })
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
                to={localPost.user.profileUrl || `/user/${localPost.user.id}`}
                className="text-sm font-semibold hover:underline"
              >
                {localPost.user.username}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatDate(localPost.timestamp)}
              </p>
            </div>
          </div>
          {isAuthenticated && localPost.user.username === username && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border bg-card shadow-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-4 space-y-4">
          <p className="text-sm">{localPost.content}</p>
          {localPost.imageUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={getFullImageUrl(localPost.imageUrl)}
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
          onClick={handleLike}
          className="flex items-center space-x-2"
        >
          <Heart className={`h-4 w-4 ${localPost.isLiked ? "fill-current text-red-500" : ""}`} />
          <span className="text-xs">{localPost.likesCount}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2"
          onClick={toggleComments}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{localPost.commentsCount || 0}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          <span className="text-xs">{localPost.shareCount || 0}</span>
        </Button>
        <ShareModal 
          postId={localPost.id}
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
              disabled={!commentContent.trim() || isSubmittingComment}
              className="min-w-[80px]"
            >
              {isSubmittingComment ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Posting...</span>
                </div>
              ) : (
                "Post"
              )}
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
