// src/app/(dashboard)/projects/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Plus, Loader2 } from 'lucide-react'
import { ProjectWithRelations } from '@/types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      if (data.success) {
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Your Passion Projects
            </h1>
            <p className="text-lg text-gray-600">
              Build meaningful projects that showcase your interests
            </p>
          </div>
          
          <Link href="/projects/brainstorm">
            <Button size="lg" className="gap-2">
              <Sparkles className="w-5 h-5" />
              Start New Project
            </Button>
          </Link>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Projects Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start your first passion project and build something meaningful
                that showcases your interests and skills.
              </p>
              <Link href="/projects/brainstorm">
                <Button size="lg" className="gap-2">
                  <Sparkles className="w-5 h-5" />
                  Get Started
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                      project.status === 'PLANNING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>💪 Health: {project.healthScore}/100</span>
                    <span>🎯 {project._count?.milestones || 0} milestones</span>
                    <span>✅ {project._count?.tasks || 0} tasks</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
