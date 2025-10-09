'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Plus, X, DollarSign, Package, Users, Building } from 'lucide-react'
import type { ProjectWithRelations } from '@/types'

interface ResourcePlannerProps {
  project: ProjectWithRelations
  onComplete: () => void
}

interface ResourceItem {
  id: string
  name: string
  type: 'funding' | 'material' | 'space' | 'technology' | 'permission'
  description: string
  acquisitionPlan: string
  cost?: string
}

interface SupportPerson {
  id: string
  name: string
  role: string
  contactInfo: string
  howTheyHelp: string
}

export default function ResourcePlanner({ project, onComplete }: ResourcePlannerProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const existingResources = (project.resources as any) || {}

  const [resources, setResources] = useState<ResourceItem[]>(
    existingResources.items || []
  )
  const [supportTeam, setSupportTeam] = useState<SupportPerson[]>(
    existingResources.supportTeam || []
  )
  const [permissions, setPermissions] = useState(
    existingResources.permissions || ''
  )

  const addResource = () => {
    setResources([...resources, {
      id: `resource_${Date.now()}`,
      name: '',
      type: 'material',
      description: '',
      acquisitionPlan: '',
      cost: ''
    }])
  }

  const updateResource = (id: string, field: keyof ResourceItem, value: string) => {
    setResources(resources.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const removeResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id))
  }

  const addSupport = () => {
    setSupportTeam([...supportTeam, {
      id: `support_${Date.now()}`,
      name: '',
      role: '',
      contactInfo: '',
      howTheyHelp: ''
    }])
  }

  const updateSupport = (id: string, field: keyof SupportPerson, value: string) => {
    setSupportTeam(supportTeam.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const removeSupport = (id: string) => {
    setSupportTeam(supportTeam.filter(s => s.id !== id))
  }

  const handleSave = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resources: {
            items: resources,
            supportTeam,
            permissions
          }
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'Resources Saved',
        description: 'Your resource plan has been saved',
      })

      onComplete()
    } catch (error) {
      console.error('Error saving resources:', error)
      toast({
        title: 'Error',
        description: 'Failed to save resource plan. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const resourceIcons = {
    funding: DollarSign,
    material: Package,
    space: Building,
    technology: Package,
    permission: Users
  }

  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Resource Planning
          </h2>
          <p className="text-gray-600">
            Identify what you need and how you will get it
          </p>
        </div>

        {/* Resources Needed */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <Label className="text-base font-semibold">
                Resources Needed
              </Label>
              <p className="text-sm text-gray-500">
                Materials, equipment, space, technology, funding
              </p>
            </div>
            <Button onClick={addResource} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </div>

          <div className="space-y-3">
            {resources.map((resource) => {
              const Icon = resourceIcons[resource.type]
              return (
                <Card key={resource.id} className="p-4 border-2">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="grid grid-cols-2 gap-3 flex-1">
                          <div>
                            <Label className="text-sm">Resource Name</Label>
                            <Input
                              value={resource.name}
                              onChange={(e) => updateResource(resource.id, 'name', e.target.value)}
                              placeholder="Example: Figma subscription"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Type</Label>
                            <select
                              value={resource.type}
                              onChange={(e) => updateResource(resource.id, 'type', e.target.value as ResourceItem['type'])}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="funding">Funding</option>
                              <option value="material">Material/Equipment</option>
                              <option value="space">Space/Venue</option>
                              <option value="technology">Technology/Software</option>
                              <option value="permission">Permission/Access</option>
                            </select>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeResource(resource.id)}
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div>
                        <Label className="text-sm">Description</Label>
                        <Input
                          value={resource.description}
                          onChange={(e) => updateResource(resource.id, 'description', e.target.value)}
                          placeholder="What is this for?"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm">How to Get It</Label>
                          <Input
                            value={resource.acquisitionPlan}
                            onChange={(e) => updateResource(resource.id, 'acquisitionPlan', e.target.value)}
                            placeholder="Purchase, borrow, request permission"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Estimated Cost (optional)</Label>
                          <Input
                            value={resource.cost}
                            onChange={(e) => updateResource(resource.id, 'cost', e.target.value)}
                            placeholder="$0 or $50/month"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}

            {resources.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <p>No resources added yet. Click Add Resource to start planning.</p>
              </div>
            )}
          </div>
        </div>

        {/* Support Network */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <Label className="text-base font-semibold">
                Support Network
              </Label>
              <p className="text-sm text-gray-500">
                Mentors, advisors, collaborators, champions
              </p>
            </div>
            <Button onClick={addSupport} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Person
            </Button>
          </div>

          <div className="space-y-3">
            {supportTeam.map((person) => (
              <Card key={person.id} className="p-4 border-2">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="grid grid-cols-2 gap-3 flex-1">
                        <div>
                          <Label className="text-sm">Name</Label>
                          <Input
                            value={person.name}
                            onChange={(e) => updateSupport(person.id, 'name', e.target.value)}
                            placeholder="Example: Ms. Johnson"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Role</Label>
                          <Input
                            value={person.role}
                            onChange={(e) => updateSupport(person.id, 'role', e.target.value)}
                            placeholder="Teacher, Mentor, Parent"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => removeSupport(person.id)}
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Contact Info</Label>
                        <Input
                          value={person.contactInfo}
                          onChange={(e) => updateSupport(person.id, 'contactInfo', e.target.value)}
                          placeholder="Email or phone"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">How They Can Help</Label>
                        <Input
                          value={person.howTheyHelp}
                          onChange={(e) => updateSupport(person.id, 'howTheyHelp', e.target.value)}
                          placeholder="Provide feedback, connections"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {supportTeam.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <p>No support team members added. Add people who can help your project succeed.</p>
              </div>
            )}
          </div>
        </div>

        {/* Permissions Needed */}
        <div>
          <Label htmlFor="permissions" className="text-base font-semibold">
            Permissions or Approvals Needed
          </Label>
          <p className="text-sm text-gray-500 mb-2">
            Do you need approval from school, parents, or organizations?
          </p>
          <Textarea
            id="permissions"
            value={permissions}
            onChange={(e) => setPermissions(e.target.value)}
            placeholder="Example: Need parent permission to conduct student interviews, school approval to use computer lab"
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Resource Plan'
            )}
          </Button>
          <Button
            onClick={onComplete}
            variant="outline"
            className="flex-1"
          >
            Continue to Skills →
          </Button>
        </div>
      </div>
    </Card>
  )
}
