
import type React from "react";
import { useState, useEffect, useRef } from "react";
import MobileLayout from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock, MapPin, Mic, Send, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "@/components/ImageUploader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const ReportPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Time picker state
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("PM");

  // Google Maps state
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);

  // Load Google Maps API
  useEffect(() => {
    if (!mapLoaded && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;

      window.initMap = () => {
        setMapLoaded(true);
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
        delete window.initMap;
      };
    }
  }, [mapLoaded]);

  // Initialize map when dialog opens
  useEffect(() => {
    if (mapOpen && mapLoaded && mapRef.current && window.google) {
      const defaultPosition = { lat: 40.7128, lng: -74.006 }; // New York as default
      const position = currentPosition || defaultPosition;

      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center: position,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      markerRef.current = new window.google.maps.Marker({
        position,
        map: googleMapRef.current,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      });

      geocoderRef.current = new window.google.maps.Geocoder();

      // Add event listener for marker drag end
      markerRef.current.addListener("dragend", handleMarkerDragEnd);

      // If we have a current position, center the map on it
      if (currentPosition) {
        googleMapRef.current.setCenter(currentPosition);
      } else {
        // Try to get current location
        getCurrentLocation();
      }
    }
  }, [mapOpen, mapLoaded, currentPosition]);

  const updateTime = (hour: string, minute: string, period: string) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setSelectedPeriod(period);

    // Format the time for display
    setTime(`${hour}:${minute} ${period}`);
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCurrentPosition(pos);

          if (googleMapRef.current && markerRef.current) {
            googleMapRef.current.setCenter(pos);
            markerRef.current.setPosition(pos);

            // Get address from coordinates
            reverseGeocode(pos);
          }

          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description:
              "Unable to get your current location. Please enter it manually.",
            variant: "destructive",
          });
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description:
          "Your browser doesn't support geolocation. Please enter your location manually.",
        variant: "destructive",
      });
      setIsLoadingLocation(false);
    }
  };

  const handleMarkerDragEnd = () => {
    if (markerRef.current) {
      const position = markerRef.current.getPosition().toJSON();
      reverseGeocode(position);
    }
  };

  const reverseGeocode = (position: { lat: number; lng: number }) => {
    if (geocoderRef.current) {
      geocoderRef.current.geocode(
        { location: position },
        (results: any[], status: string) => {
          if (status === "OK" && results[0]) {
            setLocation(results[0].formatted_address);
          } else {
            toast({
              title: "Geocoding Error",
              description: "Couldn't find address for this location.",
              variant: "destructive",
            });
          }
        }
      );
    }
  };

  const handleLocationDetect = () => {
    setMapOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!incidentType || !date || !location || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send the report to the backend
    toast({
      title: "Report Submitted",
      description:
        "Thank you for your report. Your information has been received.",
    });

    // Reset form
    setIncidentType("");
    setDate(new Date());
    setTime("");
    setLocation("");
    setDescription("");
    setImageUrl(null);
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // toast({
      //   title: "Recording Stopped",
      //   description: "Voice recording has been attached to your report.",
      // });
    } else {
      setIsRecording(true);
      // toast({
      //   title: "Recording Started",
      //   description: "Recording your voice description...",
      // });
    }
  };

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
  };

  return (
    <MobileLayout>
      <div className="mobile-container">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-zeb-purple">
            Report an Incident
          </h1>
          <p className="text-muted-foreground">
            Your report will be kept confidential and secure
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="incident-type">Type of Incident</Label>
            <Select value={incidentType} onValueChange={setIncidentType}>
              <SelectTrigger id="incident-type">
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="assault">Assault</SelectItem>
                <SelectItem value="domestic-violence">
                  Domestic Violence
                </SelectItem>
                <SelectItem value="discrimination">Discrimination</SelectItem>
                <SelectItem value="unsafe-conditions">
                  Unsafe Conditions
                </SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {time ? time : "Select time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4">
                  <div className="flex flex-col space-y-4">
                    <div className="text-sm font-medium text-center">
                      Select Time
                    </div>
                    <div className="flex justify-center space-x-4">
                      {/* Hours Column */}
                      <div className="flex flex-col items-center">
                        <Label className="text-xs mb-2">Hour</Label>
                        <div className="border rounded-md h-[150px] overflow-y-auto w-16 scrollbar-thin">
                          {Array.from({ length: 12 }, (_, i) => {
                            const hour = (i + 1).toString().padStart(2, "0");
                            return (
                              <Button
                                key={hour}
                                variant={
                                  selectedHour === hour ? "default" : "ghost"
                                }
                                className="w-full rounded-none justify-center"
                                onClick={() =>
                                  updateTime(
                                    hour,
                                    selectedMinute,
                                    selectedPeriod
                                  )
                                }
                              >
                                {hour}
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Minutes Column */}
                      <div className="flex flex-col items-center">
                        <Label className="text-xs mb-2">Minute</Label>
                        <div className="border rounded-md h-[150px] overflow-y-auto w-16 scrollbar-thin">
                          {Array.from({ length: 12 }, (_, i) => {
                            const minute = (i * 5).toString().padStart(2, "0");
                            return (
                              <Button
                                key={minute}
                                variant={
                                  selectedMinute === minute
                                    ? "default"
                                    : "ghost"
                                }
                                className="w-full rounded-none justify-center"
                                onClick={() =>
                                  updateTime(
                                    selectedHour,
                                    minute,
                                    selectedPeriod
                                  )
                                }
                              >
                                {minute}
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      {/* AM/PM Column */}
                      <div className="flex flex-col items-center">
                        <Label className="text-xs mb-2">Period</Label>
                        <div className="border rounded-md h-[150px] w-16 flex flex-col">
                          <Button
                            variant={
                              selectedPeriod === "AM" ? "default" : "ghost"
                            }
                            className="flex-1 rounded-none"
                            onClick={() =>
                              updateTime(selectedHour, selectedMinute, "AM")
                            }
                          >
                            AM
                          </Button>
                          <Button
                            variant={
                              selectedPeriod === "PM" ? "default" : "ghost"
                            }
                            className="flex-1 rounded-none"
                            onClick={() =>
                              updateTime(selectedHour, selectedMinute, "PM")
                            }
                          >
                            PM
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        const now = new Date();
                        let hours = now.getHours();
                        const period = hours >= 12 ? "PM" : "AM";
                        hours = hours % 12 || 12; // Convert to 12-hour format
                        const hoursStr = hours.toString().padStart(2, "0");
                        const minutes = Math.floor(now.getMinutes() / 5) * 5;
                        const minutesStr = minutes.toString().padStart(2, "0");

                        updateTime(hoursStr, minutesStr, period);
                      }}
                    >
                      Set Current Time
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"/>
                <Input
                  id="location"
                  placeholder="Enter location"
                  className="pl-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleLocationDetect}
                className="flex-shrink-0"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what happened in as much detail as you feel comfortable sharing"
              className="min-h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Evidence (Optional)</Label>
            {imageUrl ? (
              <div className="mb-4">
                <div className="relative rounded-md overflow-hidden">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Evidence"
                    className="w-full h-auto max-h-48 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => setImageUrl(null)}
                  >
                    &times;
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <div className="flex-1">
                  <ImageUploader
                    onImageUploaded={handleImageUploaded}
                    buttonText="Upload Photo"
                  />
                </div>
                <Button
                  type="button"
                  variant={isRecording ? "default" : "outline"}
                  className={`flex-1 ${
                    isRecording ? "bg-red-500 hover:bg-red-600" : ""
                  }`}
                  onClick={handleVoiceRecording}
                >
                  <Mic className="mr-2 h-4 w-4" />
                  {isRecording ? "Stop Recording" : "Voice Input"}
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Files and recordings will be encrypted and stored securely.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-zeb-purple hover:bg-zeb-darkPurple"
          >
            <Send className="mr-2 h-4 w-4" />
            Submit Report
          </Button>
        </form>

        {/* Google Maps Dialog */}
        <Dialog open={mapOpen} onOpenChange={setMapOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Location</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-4">
              <div
                ref={mapRef}
                className="w-full h-[300px] rounded-md border"
                style={{ background: "#f0f0f0" }}
              >
                {!mapLoaded && (
                  <div className="w-full h-full flex items-center justify-center">
                    <p>Loading map...</p>
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting location...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Use Current Location
                    </>
                  )}
                </Button>
                <Button onClick={() => setMapOpen(false)}>
                  Confirm Location
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Drag the pin to adjust your location or use the button to detect
                your current location.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MobileLayout>
  );
};

export default ReportPage;
