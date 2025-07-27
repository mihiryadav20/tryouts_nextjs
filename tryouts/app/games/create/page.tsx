"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function CreateGamePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    gameDate: "",
    startTime: "",
    endTime: "",
    location: "",
    costPerPerson: "",
    description: "",
    playersRequired: "",
    maxPlayers: "",
    sportType: "",
    skillLevel: "Beginner",
  });

  if (status === "loading") {
    return (
      <div className="container mx-auto p-6 text-center">Loading...</div>
    );
  }
  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Game</CardTitle>
            <CardDescription>Please sign in to create a game.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      skillLevel: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const startTime = `${formData.gameDate}T${formData.startTime}`;
      const endTime = `${formData.gameDate}T${formData.endTime}`;
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, startTime, endTime }),
        credentials: "include",
      });
      if (response.ok) {
        router.push("/games");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Error creating game");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Game</CardTitle>
          <CardDescription>Fill out the details below to organize a new sports game.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name *</Label>
              <Input id="eventName" name="eventName" value={formData.eventName} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gameDate">Date *</Label>
                <Input id="gameDate" name="gameDate" type="date" value={formData.gameDate} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sportType">Sport Type *</Label>
                <Input id="sportType" name="sportType" value={formData.sportType} onChange={handleInputChange} required placeholder="e.g., Basketball, Football, Tennis" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input id="startTime" name="startTime" type="time" value={formData.startTime} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input id="endTime" name="endTime" type="time" value={formData.endTime} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="playersRequired">Players Required *</Label>
                <Input id="playersRequired" name="playersRequired" type="number" min="1" value={formData.playersRequired} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPlayers">Max Players *</Label>
                <Input id="maxPlayers" name="maxPlayers" type="number" min="1" value={formData.maxPlayers} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPerPerson">Cost Per Person (₹)</Label>
                <Input id="costPerPerson" name="costPerPerson" type="number" min="0" value={formData.costPerPerson} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skillLevel">Skill Level</Label>
                <Select value={formData.skillLevel} onValueChange={handleSelectChange}>
                  <SelectTrigger id="skillLevel" name="skillLevel">
                    <SelectValue placeholder="Skill Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your game, venue, or any requirements..." />
            </div>
            <div className="pt-4">
              <Button type="submit" disabled={creating} className="w-full">
                {creating ? "Creating..." : "Create Game"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
