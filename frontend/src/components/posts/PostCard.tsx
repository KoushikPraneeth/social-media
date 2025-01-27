import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Post } from '../../types'
import { formatDate } from '../../lib/utils'

interface PostCardProps {
  post: Post
  onLike?: (postId: number) => void
}

export function PostCard({ post, onLike }: PostCardProps) {
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
                {formatDate(post.createdAt)}
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
          <Heart className="h-4 w-4" />
          <span className="text-xs">{post.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">Comment</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <Share2 className="h-4 w-4" />
          <span className="text-xs">Share</span>
        </Button>
      </div>
    </div>
  )
}
