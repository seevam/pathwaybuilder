// src/app/(dashboard)/projects/new/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  { value: 'CREATIVE', label: 'Creative', icon: '🎨' },
  { value: 'SOCIAL_IMPACT', label: 'Social Impact', icon: '🤝' },
  { value: 'ENTREPRENEURIAL', label: 'Entrepreneurial', icon: '💼' },
  { value: 'RESEARCH', label: 'Research', icon: '🔬' },
  { value: 'TECHNICAL', label: 'Technical', icon: '💻' },
  { value: 'LEADERSHIP', label: 'Leadership', icon: '👥' },
]

export default function NewProjectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'CREATIVE',
  })

  // Pre-fill from brainstorming if coming from idea selection
  useEffect(() => {
    const title = searchParams.get('title')
    const description = searchParams.get('description')
    const category = searchParams.get('category')
    const ideaDataStr = searchParams.get('ideaData')

    if (title && description && category) {
      setFormData({
        title,
        description,
        category,
      })
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'IDEATION',
          // Store the original AI idea if available
          ideaSource: searchParams.get('ideaData') 
            ? JSON.parse(searchParams.get('ideaData')!) 
            : null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      const data = await response.json()
      
      // Redirect to project planning page
      router.push(`/projects/${data.project.id}/plan`)
    } catch (err) {
      console.error('Error creating project:', err)
      setError('Failed to create project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Button */}
        <Link href="/projects/brainstorm">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Brainstorming
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Create Your Project
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Give Your Project a Name
          </h1>
          <p className="text-lg text-gray-600">
            You can refine these details later as you develop your plan
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div>
              <Label htmlFor="title" className="text-base font-semibold">
                Project Title *
              </Label>
              <p className="text-sm text-gray-500 mb-2">
                Make it catchy and descriptive
              </p>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Student Mental Health Awareness Campaign"
                className="text-lg"
                required
              />
            </div>

            {/* Project Description */}
            <div>
              <Label htmlFor="description" className="text-base font-semibold">
                Project Description *
              </Label>
              <p className="text-sm text-gray-500 mb-2">
                Explain what you&apos;ll do and why it matters
              </p>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your project vision..."
                rows={6}
                required
              />
            </div>

            {/* Category */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Project Category *
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.category === cat.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-sm font-medium">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Continue to Planning
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
