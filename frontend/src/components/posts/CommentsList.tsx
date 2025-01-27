import React from 'react'
import { Comment } from '../../types'
import { formatDate } from '../../lib/utils'

interface CommentsListProps {
  comments: Comment[]
}

export function CommentsList({ comments }: CommentsListProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
          <div className="flex-1">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{comment.user.username}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
