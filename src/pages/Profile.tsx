"use client";

import type React from "react";
import { useState } from "react";
import MobileLayout from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Settings,
  Camera,
  Edit,
  UserPlus,
  LogOut,
  Moon,
  Eye,
  Bell,
  Phone,
  MapPin,
  Shield,
  Database,
  Save,
  X,
  Plus,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import ImageUploader from "@/components/ImageUploader";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
}

interface UserProfile {
  name: string;
  username: string;
  quote: string;
}

const ProfilePage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [locationSharing, setLocationSharing] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState<
    "public" | "friends" | "private"
  >("friends");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Mekdelawit Gebre",
    username: "Megdela4",
    quote: "Don’t wait for opportunity. Create it",
  });

  // Edit mode states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);

  // Emergency contacts state
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([
    { id: 1, name: "Etete", phone: "+251-923-4567" },
    { id: 2, name: "Gashe", phone: "+251-999-6987-654" },
    { id: 3, name: "Ayaya", phone: "+251-989-9456-789" },
  ]);

  // Contact edit states
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [editedContacts, setEditedContacts] =
    useState<EmergencyContact[]>(emergencyContacts);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState<Omit<EmergencyContact, "id">>({
    name: "",
    phone: "",
  });

  // Add a new state for tracking which contact is being edited
  const [editingContactId, setEditingContactId] = useState<number | null>(null);
  const [editedContact, setEditedContact] = useState<EmergencyContact>({
    id: 0,
    name: "",
    phone: "",
  });

  // Handle profile edit
  const handleEditProfile = () => {
    setEditedProfile({ ...userProfile });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setUserProfile(editedProfile);
    setIsEditingProfile(false);
    // toast({
    //   title: "Profile Updated",
    //   description: "Your profile information has been updated successfully.",
    // });
  };

  const handleCancelProfileEdit = () => {
    setIsEditingProfile(false);
  };

  // Handle emergency contacts edit
  const handleEditContacts = () => {
    setEditedContacts([...emergencyContacts]);
    setIsEditingContacts(true);
  };

  const handleSaveContacts = () => {
    setEmergencyContacts(editedContacts);
    setIsEditingContacts(false);
    // toast({
    //   title: "Emergency Contacts Updated",
    //   description: "Your emergency contacts have been updated successfully.",
    // });
  };

  const handleCancelContactsEdit = () => {
    setIsEditingContacts(false);
  };

  const handleAddContact = () => {
    setIsAddingContact(true);
  };

  const handleSaveNewContact = () => {
    if (newContact.name.trim() === "" || newContact.phone.trim() === "") {
      toast({
        title: "Invalid Contact",
        description: "Please provide both name and phone number.",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(0, ...editedContacts.map((c) => c.id)) + 1;
    setEditedContacts([...editedContacts, { ...newContact, id: newId }]);
    setNewContact({ name: "", phone: "" });
    setIsAddingContact(false);

    // toast({
    //   title: "Contact Added",
    //   description: "New emergency contact has been added.",
    // });
  };

  const handleRemoveContact = (id: number) => {
    setEditedContacts(editedContacts.filter((contact) => contact.id !== id));
  };

  // Add a function to handle editing a contact
  const handleEditContact = (contact: EmergencyContact) => {
    setEditedContact({ ...contact });
    setEditingContactId(contact.id);
  };

  // Add a function to save edited contact
  const handleSaveEditedContact = () => {
    if (editedContact.name.trim() === "" || editedContact.phone.trim() === "") {
      toast({
        title: "Invalid Contact",
        description: "Please provide both name and phone number.",
        variant: "destructive",
      });
      return;
    }

    setEditedContacts(
      editedContacts.map((contact) =>
        contact.id === editingContactId ? editedContact : contact
      )
    );
    setEditingContactId(null);

    // toast({
    //   title: "Contact Updated",
    //   description: "Emergency contact has been updated successfully.",
    // });
  };

  const handleToggleDarkMode = () => {
    toggleDarkMode();
    // toast({
    //   title: `Dark Mode ${!isDarkMode ? "Enabled" : "Disabled"}`,
    //   description: `The app theme has been set to ${
    //     !isDarkMode ? "dark" : "light"
    //   } mode.`,
    // });
  };

  const handleLogout = () => {
    // toast({
    //   title: "Logging Out",
    //   description: "You are being signed out of your account.",
    // });
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  const handleAvatarUpload = (imageUrl: string) => {
    setAvatarUrl(imageUrl);
    // toast({
    //   title: "Profile Photo Updated",
    //   description: "Your profile photo has been updated successfully.",
    // });
  };

  return (
    <MobileLayout>
      <div className="mobile-container">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-zeb-purple">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </header>

        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              {avatarUrl ? (
                <img
                  src={avatarUrl || "/placeholder.svg"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-zeb-purple text-white h-full w-full flex items-center justify-center text-3xl">
                  {userProfile.name.charAt(0)}
                </div>
              )}
            </Avatar>
            <button
              className="absolute bottom-0 right-0 h-8 w-8 bg-zeb-pink text-white rounded-full flex items-center justify-center shadow-md"
              onClick={() => setIsEditingPhoto(true)}
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <h2 className="text-xl font-bold">{userProfile.name}</h2>
          <p className="text-muted-foreground text-sm">
            @{userProfile.username}
          </p>
          <p className="text-sm mt-1 italic">"{userProfile.quote}"</p>

          <Button
            variant="outline"
            size="sm"
            className="mt-3 text-zeb-purple border-zeb-purple"
            onClick={handleEditProfile}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Profile
          </Button>
        </div>

        <Tabs defaultValue="account" className="mb-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="account">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-4">
            <ScrollArea className="h-[calc(100vh-350px)]">
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-zeb-purple flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Emergency Contacts
                    </h3>
                    {!isEditingContacts ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditContacts}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelContactsEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSaveContacts}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {(isEditingContacts
                      ? editedContacts
                      : emergencyContacts
                    ).map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center p-2 bg-gray-50 rounded-md"
                      >
                        <div className="h-8 w-8 rounded-full bg-zeb-pink/10 flex items-center justify-center mr-3">
                          <UserPlus className="h-4 w-4 text-zeb-pink" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {contact.phone}
                          </p>
                        </div>
                        {isEditingContacts && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditContact(contact)}
                            >
                              <Edit className="h-4 w-4 text-zeb-purple" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => handleRemoveContact(contact.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}

                    {isEditingContacts && (
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={handleAddContact}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Contact
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardContent className="p-4">
                  <h3 className="font-medium text-zeb-purple flex items-center mb-3">
                    <Eye className="h-4 w-4 mr-2" />
                    Profile Visibility
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="visibility-public"
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          id="visibility-public"
                          checked={profileVisibility === "public"}
                          onChange={() => setProfileVisibility("public")}
                          className="sr-only"
                        />
                        <div
                          className={`h-4 w-4 rounded-full border ${
                            profileVisibility === "public"
                              ? "bg-zeb-purple border-zeb-purple"
                              : "border-gray-300"
                          }`}
                        >
                          {profileVisibility === "public" && (
                            <div className="h-2 w-2 rounded-full bg-white m-1"></div>
                          )}
                        </div>
                        <span>Public</span>
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        Visible to everyone
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="visibility-friends"
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          id="visibility-friends"
                          checked={profileVisibility === "friends"}
                          onChange={() => setProfileVisibility("friends")}
                          className="sr-only"
                        />
                        <div
                          className={`h-4 w-4 rounded-full border ${
                            profileVisibility === "friends"
                              ? "bg-zeb-purple border-zeb-purple"
                              : "border-gray-300"
                          }`}
                        >
                          {profileVisibility === "friends" && (
                            <div className="h-2 w-2 rounded-full bg-white m-1"></div>
                          )}
                        </div>
                        <span>Friends Only</span>
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        Only visible to friends
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="visibility-private"
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          id="visibility-private"
                          checked={profileVisibility === "private"}
                          onChange={() => setProfileVisibility("private")}
                          className="sr-only"
                        />
                        <div
                          className={`h-4 w-4 rounded-full border ${
                            profileVisibility === "private"
                              ? "bg-zeb-purple border-zeb-purple"
                              : "border-gray-300"
                          }`}
                        >
                          {profileVisibility === "private" && (
                            <div className="h-2 w-2 rounded-full bg-white m-1"></div>
                          )}
                        </div>
                        <span>Private</span>
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        Only visible to you
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardContent className="p-4">
                  <h3 className="font-medium text-zeb-purple mb-3">
                    Account Preferences
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="location-sharing"
                        className="flex items-center space-x-2"
                      >
                        <MapPin className="h-4 w-4" />
                        <span>Location Sharing</span>
                      </Label>
                      <Switch
                        id="location-sharing"
                        checked={locationSharing}
                        onCheckedChange={setLocationSharing}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="push-notifications"
                        className="flex items-center space-x-2"
                      >
                        <Bell className="h-4 w-4" />
                        <span>Push Notifications</span>
                      </Label>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <ScrollArea className="h-[calc(100vh-400px)]">
              <Card className="mb-4">
                <CardContent className="p-4">
                  <h3 className="font-medium text-zeb-purple mb-3">
                    App Preferences
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="dark-mode"
                        className="flex items-center space-x-2"
                      >
                        <Moon className="h-4 w-4" />
                        <span>Dark Mode</span>
                      </Label>
                      <Switch
                        id="dark-mode"
                        checked={isDarkMode}
                        onCheckedChange={handleToggleDarkMode}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="data-saver"
                        className="flex items-center space-x-2"
                      >
                        <Database className="h-4 w-4" />
                        <span>Data Saver</span>
                      </Label>
                      <Switch
                        id="data-saver"
                        checked={dataSaver}
                        onCheckedChange={setDataSaver}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardContent className="p-4">
                  <h3 className="font-medium text-zeb-purple mb-3">
                    Privacy & Security
                  </h3>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-10 font-normal"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Privacy Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-10 font-normal"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Account Security
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-10 font-normal"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Two-Factor Authentication
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardContent className="p-4">
                  <h3 className="font-medium text-zeb-purple mb-3">About</h3>

                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">App Version</span>
                      <span>1.0.0</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">
                        Terms of Service
                      </span>
                      <button className="text-zeb-purple">View</button>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">
                        Privacy Policy
                      </span>
                      <button className="text-zeb-purple">View</button>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">
                        Help & Support
                      </span>
                      <button className="text-zeb-purple">Contact</button>
                      <span className="text-muted-foreground">
                        Developer
                      </span>
                      <button className="text-zeb-purple">Mekdelawit</button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex items-center">
                <span className="mr-1">@</span>
                <Input
                  id="username"
                  value={editedProfile.username}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      username: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote">Personal Quote</Label>
              <Input
                id="quote"
                value={editedProfile.quote}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, quote: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelProfileEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Contact Dialog */}
      <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Emergency Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Contact Name</Label>
              <Input
                id="contact-name"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                placeholder="Enter contact name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone Number</Label>
              <Input
                id="contact-phone"
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingContact(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewContact}>Add Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog
        open={editingContactId !== null}
        onOpenChange={(open) => !open && setEditingContactId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Emergency Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-contact-name">Contact Name</Label>
              <Input
                id="edit-contact-name"
                value={editedContact.name}
                onChange={(e) =>
                  setEditedContact({ ...editedContact, name: e.target.value })
                }
                placeholder="Enter contact name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contact-phone">Phone Number</Label>
              <Input
                id="edit-contact-phone"
                value={editedContact.phone}
                onChange={(e) =>
                  setEditedContact({ ...editedContact, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingContactId(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditedContact}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Photo Dialog */}
      <Dialog open={isEditingPhoto} onOpenChange={setIsEditingPhoto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                {avatarUrl ? (
                  <img
                    src={avatarUrl || "/placeholder.svg"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="bg-zeb-purple text-white h-full w-full flex items-center justify-center text-4xl">
                    {userProfile.name.charAt(0)}
                  </div>
                )}
              </Avatar>
            </div>

            <div className="space-y-2">
              <div className="flex justify-center">
                <ImageUploader
                  onImageUploaded={(imageUrl) => {
                    handleAvatarUpload(imageUrl);
                    setIsEditingPhoto(false);
                  }}
                  buttonText="Upload New Photo"
                />
              </div>

              {avatarUrl && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setAvatarUrl(null);
                      // toast({
                      //   title: "Profile Photo Removed",
                      //   description: "Your profile photo has been removed.",
                      // });
                      setIsEditingPhoto(false);
                    }}
                  >
                    Remove Photo
                  </Button>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingPhoto(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default ProfilePage;
