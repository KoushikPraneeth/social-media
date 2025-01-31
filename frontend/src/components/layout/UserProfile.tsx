import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2, UserCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { PostCard } from "../posts/PostCard";
import { User, Post } from "../../types";
import { posts, users } from "../../lib/api";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/auth/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

export function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
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

    const originalUser = user;
    setIsFollowingLoading(true);
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

      if (user.isFollowing) {
        setShowUnfollowConfirm(true);
        setIsFollowingLoading(false);
        return;
      }

      // Optimistically update UI
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          isFollowing: true,
          followersCount: (prev.followersCount || 0) + 1,
        };
      });

      try {
        const response = await users.follow(username);
        if (response.status >= 400) {
          // Revert optimistic update on error
          setUser(originalUser);
          throw new Error(response.data.message);
        }
      } catch (err: any) {
        // Revert optimistic update on error
        setUser(originalUser);
        throw new Error(err.response?.data?.message || "Failed to follow user");
      }

      showToast({
        title: "Success",
        description: `Successfully followed ${username}`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Follow error:", err);
      showToast({
        title: "Error",
        description: err.message,
        type: "error",
      });
    } finally {
      setIsFollowingLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!user || !username) return;

    const originalUser = user;
    setIsFollowingLoading(true);
    try {
      // Optimistically update UI
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          isFollowing: false,
          followersCount: (prev.followersCount || 0) - 1,
        };
      });

      let response;
      try {
        response = await users.unfollow(username);
        if (response.status >= 400) {
          throw new Error(response.data.message);
        }
      } catch (err: any) {
        // Revert optimistic update on error
        setUser(originalUser);
        throw new Error(
          err.response?.data?.message || "Failed to unfollow user"
        );
      }

      showToast({
        title: "Success",
        description: `Successfully unfollowed ${username}`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Unfollow error:", err);
      showToast({
        title: "Error",
        description: err.message,
        type: "error",
      });
    } finally {
      setIsFollowingLoading(false);
      setShowUnfollowConfirm(false);
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
            <>
              <div className="flex gap-2">
                <Button
                  variant={user?.isFollowing ? "destructive" : "default"}
                  onClick={handleFollow}
                  disabled={isFollowingLoading}
                  className="min-w-[100px]"
                >
                  <div className="flex items-center gap-2">
                    {isFollowingLoading && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    <span>{user?.isFollowing ? "Unfollow" : "Follow"}</span>
                  </div>
                </Button>
              </div>

              <Dialog
                open={showUnfollowConfirm}
                onOpenChange={setShowUnfollowConfirm}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Unfollow</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to unfollow @{user?.username}?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowUnfollowConfirm(false)}
                      disabled={isFollowingLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleUnfollow}
                      disabled={isFollowingLoading}
                      className="min-w-[100px]"
                    >
                      <div className="flex items-center gap-2">
                        {isFollowingLoading && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        <span>Unfollow</span>
                      </div>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
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
