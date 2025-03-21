import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageSquare, Share2, Send, User } from "lucide-react";
import { Post, Comment, likePost, addCommentToPost, getCommentsForPost } from '@/services/postService';
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
  post: Post;
  onUpdate: (updatedPost: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const { toast } = useToast();

  const handleLike = () => {
    const updatedPost = likePost(post.id);
    if (updatedPost) {
      onUpdate(updatedPost);
      // toast({
      //   title: updatedPost.userHasLiked ? "Post Liked" : "Like Removed",
      //   description: updatedPost.userHasLiked 
      //     ? "You've shown support for this post."
      //     : "You've removed your like from this post.",
      // });
    }
  };

  const handleShare = () => {
    toast({
      title: "Share Options",
      description: "Share options would appear here in the full version.",
    });
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const newComment = addCommentToPost(post.id, commentText);
    if (newComment) {
      // If comments are not loaded yet, load them
      if (!showComments) {
        handleToggleComments();
      } else {
        // Otherwise just update the local state
        setComments(prev => [newComment, ...prev]);
      }
      
      // toast({
      //   title: "Comment Added",
      //   description: "Your comment has been posted.",
      // });
      
      setCommentText("");
      
      // Update the post with new comment count
      onUpdate({
        ...post,
        comments: post.comments + 1
      });
    }
  };
  
  const handleToggleComments = () => {
    if (!showComments) {
      // Load comments when toggling on
      const loadedComments = getCommentsForPost(post.id);
      setComments(loadedComments);
    }
    setShowComments(!showComments);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3 mb-3">
          <Avatar>
            {post.author.isAnonymous ? (
              <User className="flex items-center justify-center w-full h-full rounded-full border-2 border-gray-500 bg-white"></User>
            ) : (
              <div className="bg-zeb-purple text-white h-full w-full flex items-center justify-center">
                {post.author.name.charAt(0)}
              </div>
            )}
          </Avatar>
          <div>
            <div className="flex items-center">
              <p className="font-medium">{post.author.name}</p>
              {post.author.isVerified && (
                <Badge
                  variant="outline"
                  className="ml-2 bg-blue-50 text-blue-600 hover:bg-blue-50"
                >
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{post.time}</span>
              <span className="mx-1">•</span>
              <span className="text-zeb-purple">{post.group}</span>
            </div>
          </div>
        </div>

        <p className="text-sm mb-4">{post.content}</p>

        {post.image && (
          <div className="mb-4 rounded-md overflow-hidden">
            <img src={post.image} alt="Post" className="w-full h-auto" />
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <button
              className={`flex items-center space-x-1 ${
                post.userHasLiked ? "text-red-500" : ""
              }`}
              onClick={handleLike}
            >
              <Heart
                className={`h-4 w-4 ${
                  post.userHasLiked ? "fill-current text-red-500" : ""
                }`}
              />
              <span>{post.likes}</span>
            </button>
            <button
              className="flex items-center space-x-1"
              onClick={handleToggleComments}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments}</span>
            </button>
          </div>
          <button onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </CardContent>

      {showComments && comments.length > 0 && (
        <div className="px-4 pb-2">
          <h4 className="text-sm font-medium mb-2">Comments</h4>
          <div className="space-y-2 mb-3">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-2 rounded-md">
                <div className="flex justify-between">
                  <span className="text-xs font-medium">
                    {comment.authorName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {comment.timestamp}
                  </span>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <CardFooter className="p-4 pt-0 border-t">
        <form
          onSubmit={handleComment}
          className="flex w-full space-x-2 space-y-2"
        >
          <Input
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1"
          />
          <Button size="sm" type="submit" className="bg-zeb-purple">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
