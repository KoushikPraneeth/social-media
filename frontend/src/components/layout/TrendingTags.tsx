import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Hash } from 'lucide-react'
import { trends } from '../../lib/api'
import { Hashtag as HashtagType } from '../../types'

export function TrendingTags() {
  const [hashtags, setHashtags] = useState<HashtagType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const { data } = await trends.getHashtags()
        setHashtags(data)
      } catch (error) {
        console.error('Failed to fetch trending hashtags:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrends()
  }, [])

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <h2 className="font-semibold mb-4">Trending</h2>
        <div className="space-y-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 bg-muted rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (hashtags.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h2 className="font-semibold mb-4">Trending</h2>
      <div className="space-y-3">
        {hashtags.map((tag) => (
          <Link
            key={tag.id}
            to={`/hashtag/${tag.name.slice(1)}`}
            className="flex items-center space-x-2 text-sm hover:text-primary transition-colors"
          >
            <Hash className="h-4 w-4" />
            <span>{tag.name}</span>
            <span className="text-muted-foreground">
              {tag.postsCount} posts
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
