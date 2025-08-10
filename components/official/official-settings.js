"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Settings, Save, CreditCard, Bell, User, Shield } from 'lucide-react'

export default function OfficialSettings() {
  const [settings, setSettings] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    autoConfirmation: false
  })

  const handleSave = () => {
    console.log('Saving settings:', settings)
  }

  return (
    <DashboardLayout userType="official" userName="Department Official">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Department Settings</h1>
            <p className="text-gray-600">Manage your department configuration and preferences</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="bank" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bank">Bank Details</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="bank">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Bank Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={settings.bankName}
                      onChange={(e) => setSettings({...settings, bankName: e.target.value})}
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={settings.accountNumber}
                      onChange={(e) => setSettings({...settings, accountNumber: e.target.value})}
                      placeholder="Enter account number"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    value={settings.accountName}
                    onChange={(e) => setSettings({...settings, accountName: e.target.value})}
                    placeholder="Enter account name"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Payment Reminders</Label>
                    <p className="text-sm text-gray-500">Send automatic payment reminders to students</p>
                  </div>
                  <Switch
                    checked={settings.paymentReminders}
                    onCheckedChange={(checked) => setSettings({...settings, paymentReminders: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Confirmation</Label>
                    <p className="text-sm text-gray-500">Automatically confirm valid payments</p>
                  </div>
                  <Switch
                    checked={settings.autoConfirmation}
                    onCheckedChange={(checked) => setSettings({...settings, autoConfirmation: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter first name" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter last name" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" placeholder="Department name" disabled />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" placeholder="Enter position/title" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="Enter current password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="Enter new password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                </div>
                <Button className="w-full md:w-auto">
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}