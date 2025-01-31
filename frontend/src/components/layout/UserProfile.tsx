import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2, UserCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { PostCard } from "../posts/PostCard";
import { User, Post } from "../../types";
import { posts, users } from "../../lib/api";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/auth/AuthContext";

export function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { showToast } = useToast();

  const fetchUserData = async () => {
    if (!username) return;
    setLoading(true);
    setError(null);

    try {
      // Fetch user details
      const userResponse = await users.getById(username);
      setUser(userResponse.data.data);

      // Fetch initial posts
      await fetchUserPosts(1);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch user data";
      setError(errorMessage);
      showToast({
        title: "Error",
        description: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (pageNum: number) => {
    if (!username) return;
    console.log("Fetching posts for username:", username, "page:", pageNum);

    try {
      const response = await posts.getUserPosts(username, pageNum);
      console.log("Posts API response:", response.data);

      if (pageNum === 1) {
        setUserPosts(response.data.data);
      } else {
        setUserPosts((prev) => [...prev, ...response.data.data]);
      }
      setHasMore(response.data.hasMore);
    } catch (err: any) {
      console.error("Error fetching posts:", err);
      showToast({
        title: "Error",
        description: err.message || "Failed to fetch posts",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const handleFollow = async () => {
    if (!user || !username) return;
    console.log("Attempting to", user.isFollowing ? "unfollow" : "follow", username);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast({
          title: "Error",
          description: "You must be logged in to follow users",
          type: "error",
        });
        return;
      }

      let response;
      if (user.isFollowing) {
        console.log("Making unfollow request");
        response = await users.unfollow(username);
      } else {
        console.log("Making follow request");
        response = await users.follow(username);
      }
      
      console.log("Follow/unfollow response:", response);
      
      // Update user state with the response data
      const updatedUser = response.data.data;
      setUser(updatedUser);
      
      showToast({
        title: "Success",
        description: `Successfully ${user.isFollowing ? "unfollowed" : "followed"} ${username}`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Follow error:", err);
      showToast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update follow status",
        type: "error",
      });
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUserPosts(nextPage);
  };

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const { username: loggedInUsername } = useAuth();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
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
          {loggedInUsername && username !== loggedInUsername && (
            <Button
              variant={user?.isFollowing ? "outline" : "default"}
              onClick={handleFollow}
            >
              {user?.isFollowing ? "Unfollow" : "Follow"}
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
            <Button variant="outline" onClick={loadMore} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
