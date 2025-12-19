'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Shield } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface PrivacySettingsProps {
  publicProfile: boolean
}

export function PrivacySettings({ publicProfile }: PrivacySettingsProps) {
  const [isPublic, setIsPublic] = useState(publicProfile)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async (value: boolean) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/settings/privacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicProfile: value }),
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      setIsPublic(value)
      toast.success('Privacy settings updated')
      router.refresh()
    } catch (error) {
      toast.error('Failed to update privacy settings')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Privacy Settings
        </CardTitle>
        <CardDescription>
          Control who can see your profile and activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="public-profile" className="text-base">
              Public Profile
            </Label>
            <p className="text-sm text-gray-500">
              Make your profile visible to other users
            </p>
          </div>
          <Switch
            id="public-profile"
            checked={isPublic}
            onCheckedChange={handleToggle}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  )
}
