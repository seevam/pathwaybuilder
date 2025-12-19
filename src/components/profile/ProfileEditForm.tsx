'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Briefcase, Link as LinkIcon, Plus, X, Save } from 'lucide-react'
import { toast } from 'sonner'

const AVATAR_OPTIONS = [
  '🚀', '🎯', '⚡', '🌟', '🎨', '🎭', '🎪', '🎬',
  '🎮', '🎲', '🎸', '🎹', '🎺', '🎻', '🥁', '🎧',
  '🏆', '🥇', '🏅', '💎', '👑', '🎓', '📚', '🔬',
  '🧪', '🔭', '🌈', '🦄', '🐉', '🦋', '🌺', '🌸'
]

interface ProfileEditFormProps {
  user: any
  profile: any
}

export function ProfileEditForm({ user, profile }: ProfileEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatarUrl || '🚀')
  const [bio, setBio] = useState(profile.bio || '')
  const [skills, setSkills] = useState<string[]>(profile.skills || [])
  const [newSkill, setNewSkill] = useState('')

  // Social links state
  const initialSocialLinks = profile.socialLinks || {}
  const [socialLinks, setSocialLinks] = useState({
    twitter: initialSocialLinks.twitter || '',
    linkedin: initialSocialLinks.linkedin || '',
    github: initialSocialLinks.github || '',
    instagram: initialSocialLinks.instagram || '',
    portfolio: initialSocialLinks.portfolio || '',
  })

  const userInitials = user.name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'U'

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/profile/edit', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatarUrl: selectedAvatar,
          bio,
          skills,
          socialLinks,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      toast.success('Profile updated successfully!')
      router.push('/profile')
      router.refresh()
    } catch (error) {
      toast.error('Failed to update profile')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Profile Avatar
          </CardTitle>
          <CardDescription>
            Choose an emoji that represents you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl">
                {selectedAvatar.startsWith('http') ? userInitials : selectedAvatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-700">Current Avatar</p>
              <p className="text-xs text-gray-500">Select a new one below</p>
            </div>
          </div>

          <div className="grid grid-cols-8 md:grid-cols-16 gap-2">
            {AVATAR_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedAvatar(emoji)}
                className={`
                  h-12 w-12 rounded-lg text-2xl hover:bg-blue-50 transition-all
                  ${selectedAvatar === emoji ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-50'}
                `}
              >
                {emoji}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            About You
          </CardTitle>
          <CardDescription>
            Tell others about yourself
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Share your story, interests, and what you're passionate about..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              {bio.length} / 500 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            Skills & Expertise
          </CardTitle>
          <CardDescription>
            Add your skills, interests, and areas of expertise
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Python, Design, Writing..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSkill()
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddSkill}
              variant="outline"
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {skills.length === 0 && (
              <p className="text-sm text-gray-500">
                No skills added yet. Add your first skill above!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-blue-600" />
            Social Media & Links
          </CardTitle>
          <CardDescription>
            Connect your social media profiles and portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input
                id="twitter"
                placeholder="https://twitter.com/yourusername"
                value={socialLinks.twitter}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, twitter: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/in/yourusername"
                value={socialLinks.linkedin}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                placeholder="https://github.com/yourusername"
                value={socialLinks.github}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, github: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/yourusername"
                value={socialLinks.instagram}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, instagram: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="portfolio">Portfolio Website</Label>
              <Input
                id="portfolio"
                placeholder="https://yourportfolio.com"
                value={socialLinks.portfolio}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, portfolio: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Profile'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/profile')}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
