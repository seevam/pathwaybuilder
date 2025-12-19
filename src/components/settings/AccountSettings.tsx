'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, ExternalLink } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

interface AccountSettingsProps {
  name: string
  email: string
  avatar: string | null
}

export function AccountSettings({ name, email, avatar }: AccountSettingsProps) {
  const { user } = useUser()

  const userInitials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Account Information
        </CardTitle>
        <CardDescription>
          Manage your account details and profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatar || user?.imageUrl} alt={name} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="outline" className="justify-start" asChild>
            <a
              href="https://accounts.clerk.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Manage Account with Clerk
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
