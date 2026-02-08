import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Bell,
  Shield,
  Database,
  Webhook,
  Mail,
  MessageSquare,
  Globe,
  Key,
  Smartphone,
  Save,
  RefreshCw,
  Link,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  // Profile form state
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(
    user?.name?.split(" ").slice(1).join(" ") || "",
  );
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [territory, setTerritory] = useState(user?.territory || "east");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const profileMutation = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: () => {
      setProfileMsg("Profile updated successfully!");
      setTimeout(() => setProfileMsg(""), 3000);
    },
    onError: (err) => setProfileMsg(err.message || "Failed to update profile"),
  });

  const passwordMutation = useMutation({
    mutationFn: (data) => authApi.updatePassword(data),
    onSuccess: () => {
      setPasswordMsg("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMsg(""), 3000);
    },
    onError: (err) =>
      setPasswordMsg(err.message || "Failed to update password"),
  });

  const handleSaveProfile = () => {
    profileMutation.mutate({
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      territory,
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match");
      return;
    }
    passwordMutation.mutate({ currentPassword, newPassword });
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Webhook className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl font-bold">
                    {initials}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue={user?.role || "sales"} disabled>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="sales">Sales Rep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="territory">Territory</Label>
                    <Select value={territory} onValueChange={setTerritory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select territory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">North</SelectItem>
                        <SelectItem value="south">South</SelectItem>
                        <SelectItem value="east">East</SelectItem>
                        <SelectItem value="west">West</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {profileMsg && (
                  <p className="text-sm text-success flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> {profileMsg}
                  </p>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={profileMutation.isPending}
                  >
                    {profileMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* WhatsApp Notifications */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/20">
                      <MessageSquare className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        WhatsApp Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Receive lead alerts via WhatsApp
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Email Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Daily digest and important alerts
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/20">
                      <Smartphone className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Push Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Real-time browser notifications
                      </p>
                    </div>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">
                    Notification Types
                  </h3>
                  {[
                    {
                      label: "High Priority Leads",
                      description: "Leads with score 80+",
                      enabled: true,
                    },
                    {
                      label: "New Tender Alerts",
                      description: "Government tender publications",
                      enabled: true,
                    },
                    {
                      label: "Lead Status Changes",
                      description: "When lead status is updated",
                      enabled: false,
                    },
                    {
                      label: "Weekly Digest",
                      description: "Summary of weekly activity",
                      enabled: true,
                    },
                    {
                      label: "System Updates",
                      description: "Platform updates and maintenance",
                      enabled: false,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {item.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch defaultChecked={item.enabled} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>
                  Manage third-party integrations and API access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    name: "Twilio",
                    description: "WhatsApp and SMS notifications",
                    icon: MessageSquare,
                    connected: true,
                    color: "text-info",
                  },
                  {
                    name: "SendGrid",
                    description: "Email delivery service",
                    icon: Mail,
                    connected: true,
                    color: "text-primary",
                  },
                  {
                    name: "CRM Integration",
                    description: "Sync leads with your CRM",
                    icon: Database,
                    connected: false,
                    color: "text-warning",
                  },
                  {
                    name: "Webhook Endpoints",
                    description: "Send data to external systems",
                    icon: Link,
                    connected: false,
                    color: "text-success",
                  },
                ].map((integration) => (
                  <div
                    key={integration.name}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg bg-secondary`}
                      >
                        <integration.icon
                          className={`h-6 w-6 ${integration.color}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {integration.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    {integration.connected ? (
                      <Badge className="bg-success/20 text-success border-success/30">
                        Connected
                      </Badge>
                    ) : (
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    )}
                  </div>
                ))}

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">API Access</h3>
                  <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          API Key
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-3 w-3 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                    <code className="block p-3 rounded bg-background text-xs text-muted-foreground font-mono overflow-x-auto">
                      hpcl_live_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">
                    Change Password
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div />
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  {passwordMsg && (
                    <p className="text-sm text-success flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> {passwordMsg}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleChangePassword}
                    disabled={passwordMutation.isPending}
                  >
                    {passwordMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Update Password
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                    <div>
                      <p className="font-medium text-foreground">Enable 2FA</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">
                    Active Sessions
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        device: "Chrome on Windows",
                        location: "Mumbai, India",
                        current: true,
                      },
                      {
                        device: "Safari on iPhone",
                        location: "Delhi, India",
                        current: false,
                      },
                    ].map((session, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                      >
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {session.device}
                              {session.current && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs"
                                >
                                  Current
                                </Badge>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {session.location}
                            </p>
                          </div>
                        </div>
                        {!session.current && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
