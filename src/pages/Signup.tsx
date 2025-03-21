
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, ArrowLeft, Plus, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface EmergencyContact {
  name: string;
  phone: string;
}

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: "", phone: "" }
  ]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const addEmergencyContact = () => {
    if (emergencyContacts.length < 3) {
      setEmergencyContacts([...emergencyContacts, { name: "", phone: "" }]);
    }
  };

  const removeEmergencyContact = (index: number) => {
    if (emergencyContacts.length > 1) {
      const newContacts = [...emergencyContacts];
      newContacts.splice(index, 1);
      setEmergencyContacts(newContacts);
    }
  };

  const updateEmergencyContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const newContacts = [...emergencyContacts];
    newContacts[index][field] = value;
    setEmergencyContacts(newContacts);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !phone || !password) {
      toast({
        title: "Required",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Validate emergency contacts
    const validContacts = emergencyContacts.filter(contact => contact.name && contact.phone);
    if (validContacts.length === 0) {
      toast({
        title: "Required",
        description: "Please add at least one emergency contact",
        variant: "destructive"
      });
      return;
    }
    
    // Mock signup - in a real app, this would call an authentication API
    // toast({
    //   title: "Success",
    //   description: "Account created successfully!",
    // });
    
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-background">
      <div className="w-full max-w-md mx-auto">
        <Link
          to="/login"
          className="inline-flex items-center text-zeb-purple mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zeb-purple">
            Create Your Account
          </h1>
          <p className="text-muted-foreground">
            Join our community for support and safety
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="name"
                placeholder="your name"
                className="pl-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+251923456789"
                className="pl-10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Create a secure password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label>Emergency Contacts</Label>
                <span className="block text-sm text-gray-500">(up to 3)</span>
              </div>
              {emergencyContacts.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEmergencyContact}
                  className="text-zeb-purple"
                >
                  <Plus className="h-4 w-4" />
                  Add Contact
                </Button>
              )}
            </div>

            {emergencyContacts.map((contact, index) => (
              <div key={index} className="space-y-2 bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Contact {index + 1}</h3>
                  {emergencyContacts.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEmergencyContact(index)}
                      className="h-8 w-8 p-0 text-black-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Contact Name"
                    value={contact.name}
                    onChange={(e) =>
                      updateEmergencyContact(index, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Phone Number"
                    value={contact.phone}
                    onChange={(e) =>
                      updateEmergencyContact(index, "phone", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full bg-zeb-purple hover:bg-zeb-darkPurple"
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
