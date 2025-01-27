import { useState, FormEvent, ChangeEvent } from 'react'
import { ImagePlus, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { CreatePostRequest } from '../../types'
import { posts } from '../../lib/api'
import { useToast } from '../../contexts/ToastContext'

interface CreatePostProps {
  onSuccess?: () => void
}

export function CreatePost({ onSuccess }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('content', content)
    if (image) {
      formData.append('image', image)
    }

    try {
      await posts.create(formData)
      showToast({
        title: 'Success',
        description: 'Post created successfully',
        type: 'success',
      })
      setContent('')
      setImage(null)
      onSuccess?.()
    } catch (err: any) {
      showToast({
        title: 'Error',
        description: err.message || 'Failed to create post',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast({
          title: 'Error',
          description: 'Image size should be less than 5MB',
          type: 'error',
        })
        return
      }
      if (!file.type.startsWith('image/')) {
        showToast({
          title: 'Error',
          description: 'Please upload an image file',
          type: 'error',
        })
        return
      }
      setImage(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-4">
      <div className="space-y-2">
        <Label htmlFor="content">Create a post</Label>
        <Textarea
          id="content"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="image" className="cursor-pointer">
            <ImagePlus className="h-5 w-5" />
          </Label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {image && <span className="text-sm">{image.name}</span>}
        </div>

        <Button type="submit" disabled={!content.trim() || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            'Post'
          )}
        </Button>
      </div>
    </form>
  )
}
