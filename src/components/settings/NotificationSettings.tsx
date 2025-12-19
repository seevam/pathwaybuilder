'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Bell } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface NotificationSettingsProps {
  emailOptIn: boolean
  pushOptIn: boolean
}

export function NotificationSettings({ emailOptIn, pushOptIn }: NotificationSettingsProps) {
  const [emailEnabled, setEmailEnabled] = useState(emailOptIn)
  const [pushEnabled, setPushEnabled] = useState(pushOptIn)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async (type: 'email' | 'push', value: boolean) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [type === 'email' ? 'emailOptIn' : 'pushOptIn']: value,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      if (type === 'email') {
        setEmailEnabled(value)
      } else {
        setPushEnabled(value)
      }

      toast.success('Notification preferences updated')
      router.refresh()
    } catch (error) {
      toast.error('Failed to update preferences')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose how you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications" className="text-base">
              Email Notifications
            </Label>
            <p className="text-sm text-gray-500">
              Receive updates and reminders via email
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailEnabled}
            onCheckedChange={(checked) => handleToggle('email', checked)}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications" className="text-base">
              Push Notifications
            </Label>
            <p className="text-sm text-gray-500">
              Get push notifications for important updates
            </p>
          </div>
          <Switch
            id="push-notifications"
            checked={pushEnabled}
            onCheckedChange={(checked) => handleToggle('push', checked)}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  )
}
