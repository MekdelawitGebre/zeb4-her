
// Types for posts and interactions
export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    isAnonymous: boolean;
    isVerified?: boolean;
  };
  time: string;
  content: string;
  likes: number;
  comments: number;
  group: string;
  image?: string;
  userHasLiked?: boolean;
}

export interface Comment {
  id: string;
  authorName: string;
  content: string;
  timestamp: string;
}

// Mock data store
let posts: Post[] = [
  {
    id: "1",
    author: {
      name: "Sarah J.",
      avatar: "",
      isAnonymous: false
    },
    time: "2 hours ago",
    content: "I just had my first prenatal checkup today! Feeling excited and nervous at the same time. Any advice from experienced moms?",
    likes: 24,
    comments: 8,
    group: "Pregnancy Support",
    userHasLiked: false
  },
  {
    id: "2",
    author: {
      name: "Anonymous",
      avatar: "",
      isAnonymous: true
    },
    time: "Yesterday",
    content: "I've been experiencing harassment at my workplace but I'm afraid to report it. Has anyone dealt with a similar situation?",
    likes: 32,
    comments: 15,
    group: "Workplace Safety",
    userHasLiked: false
  },
  {
    id: "3",
    author: {
      name: "Dr. Lisa Patel",
      avatar: "",
      isAnonymous: false,
      isVerified: true
    },
    time: "3 days ago",
    content: "Important reminder: Regular health checkups during pregnancy are essential. Don't skip your appointments, even if you feel fine!",
    likes: 87,
    comments: 12,
    group: "Health Advice",
    userHasLiked: false
  }
];

const commentsMap: Record<string, Comment[]> = {
  "1": [
    { id: "c1", authorName: "Emily R.", content: "Congrats! Make sure to take your prenatal vitamins daily.", timestamp: "1 hour ago" },
    { id: "c2", authorName: "Jessica K.", content: "Stay hydrated and get plenty of rest!", timestamp: "30 minutes ago" }
  ],
  "2": [
    { id: "c3", authorName: "Anita S.", content: "Document everything and consider speaking with HR.", timestamp: "12 hours ago" },
    { id: "c4", authorName: "Legal Aid", content: "Our organization can provide confidential guidance. Check our resources section.", timestamp: "6 hours ago" }
  ],
  "3": [
    { id: "c5", authorName: "Maria G.", content: "Thank you for the reminder, doctor!", timestamp: "2 days ago" }
  ]
};

// Service functions
export const getAllPosts = (): Post[] => {
  return [...posts];
};

export const getPostById = (id: string): Post | undefined => {
  return posts.find(post => post.id === id);
};

export const createPost = (content: string, isAnonymous: boolean, groupName: string, image?: string): Post => {
  const newPost: Post = {
    id: (posts.length + 1).toString(),
    author: {
      name: isAnonymous ? "Anonymous" : "Current User", // In a real app, get from auth
      avatar: "",
      isAnonymous: isAnonymous
    },
    time: "Just now",
    content,
    likes: 0,
    comments: 0,
    group: groupName,
    image,
    userHasLiked: false
  };
  
  posts = [newPost, ...posts];
  return newPost;
};

export const likePost = (postId: string): Post | undefined => {
  const postIndex = posts.findIndex(post => post.id === postId);
  if (postIndex === -1) return undefined;
  
  const post = posts[postIndex];
  const updatedPost = { 
    ...post, 
    likes: post.userHasLiked ? post.likes - 1 : post.likes + 1,
    userHasLiked: !post.userHasLiked
  };
  
  posts[postIndex] = updatedPost;
  return updatedPost;
};

export const getCommentsForPost = (postId: string): Comment[] => {
  return commentsMap[postId] || [];
};

export const addCommentToPost = (postId: string, content: string): Comment | undefined => {
  const postIndex = posts.findIndex(post => post.id === postId);
  if (postIndex === -1) return undefined;
  
  // Create the new comment
  const newComment: Comment = {
    id: `c${Date.now()}`,
    authorName: "Current User", // In a real app, get from auth
    content,
    timestamp: "Just now"
  };
  
  // Add to comments map
  if (!commentsMap[postId]) {
    commentsMap[postId] = [];
  }
  commentsMap[postId].unshift(newComment);
  
  // Update comment count
  posts[postIndex].comments += 1;
  
  return newComment;
};
