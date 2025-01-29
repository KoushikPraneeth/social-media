import React from 'react'
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  CopyIcon,
  XIcon
} from 'lucide-react'
import { posts } from '../../lib/api'
import { Button } from '../ui/button'

interface ShareModalProps {
  postId: number
  isOpen: boolean
  onClose: () => void
}

export function ShareModal({ postId, isOpen, onClose }: ShareModalProps) {
  if (!isOpen) return null

  const postUrl = `${window.location.origin}/post/${postId}`

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: CopyIcon,
      onClick: async () => {
        await posts.share(postId)
        navigator.clipboard.writeText(postUrl)
        onClose()
      }
    },
    {
      name: 'Twitter',
      icon: TwitterIcon,
      onClick: async () => {
        await posts.share(postId)
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`, '_blank')
        onClose()
      }
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      onClick: async () => {
        await posts.share(postId)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank')
        onClose()
      }
    },
    {
      name: 'LinkedIn',
      icon: LinkedinIcon,
      onClick: async () => {
        await posts.share(postId)
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank')
        onClose()
      }
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Share Post</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-4 w-4 p-0"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {shareOptions.map((option) => (
            <Button
              key={option.name}
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={option.onClick}
            >
              <option.icon className="h-4 w-4" />
              <span>{option.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
