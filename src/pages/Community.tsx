
import React, { useState, useEffect } from "react";
import MobileLayout from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchIcon, Plus, Users, BookOpen, ShieldCheck, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllPosts, Post } from "@/services/postService";
import PostCard from "@/components/PostCard";
import CreatePostModal from "@/components/CreatePostModal";

const CommunityPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const { toast } = useToast();

  // Initial data load
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const fetchedPosts = getAllPosts();
    setPosts(fetchedPosts);
  };

  const handleShare = () => {
    toast({
      title: "Share Options",
      description: "Share options would appear here in the full version.",
    });
  };

  const handleCreatePost = () => {
    setIsPostModalOpen(true);
  };

  const handleJoinGroup = (groupName: string) => {
    // toast({
    //   title: `Joined ${groupName}`,
    //   description: "You've successfully joined this group.",
    // });
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const groups = [
    {
      id: 1,
      name: "High School Girls",
      members: 1240,
      posts: 56,
      isJoined: false,
    },
    {
      id: 2,
      name: "Women in Tech",
      members: 985,
      posts: 32,
      isJoined: false,
    },
    {
      id: 3,
      name: "Home Business",
      members: 1850,
      posts: 78,
      isJoined: false,
    },
    {
      id: 4,
      name: "Women's Leadership",
      members: 735,
      posts: 41,
      isJoined: true,
    },
    {
      id: 5,
      name: "Workplace Safety",
      members: 1120,
      posts: 63,
      isJoined: true,
    },
  ];

  const resources = [
    {
      id: 1,
      title: "Legal Aid for Domestic Violence Survivors",
      organization: "Women's Legal Aid",
      type: "Resource Guide"
    },
    {
      id: 2,
      title: "24/7 Crisis Hotline",
      organization: "National Support Network",
      type: "Emergency Contact"
    },
    {
      id: 3,
      title: "Finding Support After Trauma",
      organization: "Healing Together",
      type: "Support Guide"
    }
  ];

  return (
    <MobileLayout>
      <div className="mobile-container">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zeb-purple">Enawga</h1>
            <p className="text-muted-foreground">
              Connect, share, and support 
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleCreatePost}
            className="bg-zeb-purple hover:bg-zeb-darkPurple"
          >
            <Plus className="h-4 w-4" />
            Post
          </Button>
        </header>

        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search communities and posts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="feed" className="mb-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="feed">
              <BookOpen className="h-4 w-4 mr-2" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="groups">
              <Users className="h-4 w-4 mr-2" />
              Groups
            </TabsTrigger>
            <TabsTrigger value="support">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-4">
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onUpdate={handlePostUpdate}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="groups" className="mt-4">
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="space-y-3">
                {groups.map((group) => (
                  <Card key={group.id} className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium mb-1">{group.name}</h3>
                          <div className="flex items-center text-xs text-muted-foreground space-x-2">
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{group.members.toLocaleString()} members</span>
                            </div>
                            <span>•</span>
                            <span>{group.posts} posts this week</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={group.isJoined ? "outline" : "default"}
                          onClick={() => handleJoinGroup(group.name)}
                          className={group.isJoined ? "text-zeb-purple border-zeb-purple" : "bg-zeb-purple"}
                        >
                          {group.isJoined ? "Joined" : "Join"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="support" className="mt-4">
            <Card className="mb-4 bg-zeb-purple text-white">
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">24/7 Support Resources</h3>
                <p className="text-sm mb-3">
                  Connect with trained professionals who can provide guidance and support.
                </p>
                <Button className="w-full bg-white text-zeb-purple hover:bg-white/90">
                  Contact Support Hotline
                </Button>
              </CardContent>
            </Card>
            
            <h3 className="font-medium mb-2 text-zeb-purple">Resources & Guidance</h3>
            <ScrollArea className="h-[calc(100vh-500px)]">
              <div className="space-y-3">
                {resources.map((resource) => (
                  <Card key={resource.id} className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-1">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zeb-pink/10 text-zeb-pink">
                              {resource.type}
                            </span>
                          </div>
                          <h3 className="font-medium text-sm mb-1">{resource.title}</h3>
                          <p className="text-xs text-muted-foreground">{resource.organization}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      
      <CreatePostModal 
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostCreated={loadPosts}
      />
    </MobileLayout>
  );
};

export default CommunityPage;
