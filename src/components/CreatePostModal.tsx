
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createPost } from '@/services/postService';
import { Send, Image as ImageIcon } from "lucide-react";
import ImageUploader from './ImageUploader';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [group, setGroup] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Post Content Required",
        description: "Please write something for your post.",
        variant: "destructive"
      });
      return;
    }
    
    if (!group) {
      toast({
        title: "Group Selection Required",
        description: "Please select a group for your post.",
        variant: "destructive"
      });
      return;
    }
    
    createPost(content, isAnonymous, group, imageUrl);
    
    // toast({
    //   title: "Post Created",
    //   description: "Your post has been published successfully.",
    // });
    
    // Reset form
    setContent("");
    setGroup("");
    setIsAnonymous(false);
    setImageUrl(undefined);
    
    // Notify parent component
    onPostCreated();
    onClose();
  };

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
  };

  return (
    <ScrollArea>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md mt-4">
          <DialogHeader>
            <DialogTitle>Create a Post</DialogTitle>
            <DialogDescription>
              Share your thoughts, experiences, or questions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-32"
            />

            <div className="space-y-2">
              <Label htmlFor="post-group">Select Group</Label>
              <Select value={group} onValueChange={setGroup}>
                <SelectTrigger id="post-group">
                  <SelectValue placeholder="Choose a community group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tech Women">Tech Women</SelectItem>
                  <SelectItem value="University Safety">
                    University Safety
                  </SelectItem>
                  <SelectItem value="Health Advice">Health Advice</SelectItem>
                  <SelectItem value="Workplace Safety">
                    Workplace Safety
                  </SelectItem>
                  <SelectItem value="Pregnancy Support">
                    Pregnancy Support
                  </SelectItem>

                  <SelectItem value="Healing & Recovery">
                    Healing & Recovery
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="post-anonymous" className="cursor-pointer">
                Post Anonymously
              </Label>
              <Switch
                id="post-anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </div>

            {imageUrl ? (
              <div className="space-y-2">
                <div className="relative rounded-md overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Post"
                    className="w-full h-auto max-h-48 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => setImageUrl(undefined)}
                  >
                    &times;
                  </Button>
                </div>
              </div>
            ) : (
              <ImageUploader
                onImageUploaded={handleImageUploaded}
                buttonText="Add Photo to Post"
              />
            )}

            <DialogFooter className="sm:justify-end mt-4">
              {/* <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button> */}
              <Button type="submit" className="bg-zeb-purple">
                <Send className="h-4 w-4 " />
                Post
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
};

export default CreatePostModal;
