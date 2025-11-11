// src/components/modules/ModuleDeliverable.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, Upload, CheckCircle2, FileText, Loader2, Eye } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { getModuleDeliverableByModuleId } from '@/lib/config/module-deliverables'

interface ModuleDeliverableProps {
  moduleId: string
  orderIndex: number
  unlocked: boolean
  progress: number
}

export function ModuleDeliverable({ moduleId, orderIndex, unlocked, progress }: ModuleDeliverableProps) {
  const [uploading, setUploading] = useState(false)
  const [existingDeliverable, setExistingDeliverable] = useState<any>(null)
  const [loadingDeliverable, setLoadingDeliverable] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const deliverableConfig = getModuleDeliverableByModuleId(moduleId)

  useEffect(() => {
    if (unlocked) {
      fetchExistingDeliverable()
    } else {
      setLoadingDeliverable(false)
    }
  }, [moduleId, unlocked])

  const fetchExistingDeliverable = async () => {
    try {
      const response = await fetch(`/api/deliverables/upload?moduleId=${moduleId}`)
      if (response.ok) {
        const data = await response.json()
        setExistingDeliverable(data.deliverable)
      }
    } catch (error) {
      console.error('Error fetching deliverable:', error)
    } finally {
      setLoadingDeliverable(false)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 10MB',
        variant: 'destructive',
      })
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('moduleId', moduleId)

      const response = await fetch('/api/deliverables/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setExistingDeliverable(data.deliverable)

      toast({
        title: '✅ Deliverable Uploaded!',
        description: `Your ${deliverableConfig?.title} has been submitted successfully.`,
      })
    } catch (error) {
      console.error('Error uploading deliverable:', error)
      toast({
        title: 'Upload failed',
        description: 'Failed to upload your deliverable. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (!deliverableConfig) {
    return null
  }

  return (
    <Card className={`p-6 ${unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {unlocked ? (
            existingDeliverable ? (
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            ) : (
              <FileText className="h-8 w-8 text-blue-500" />
            )
          ) : (
            <Lock className="h-8 w-8 text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Module Deliverable: {deliverableConfig.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {deliverableConfig.description}
          </p>

          {unlocked ? (
            <>
              <div className="bg-white rounded-lg p-4 mb-4 border">
                <h4 className="font-medium text-gray-900 mb-2">What to Include:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {deliverableConfig.requirements.map((requirement, index) => (
                    <li key={index}>✓ {requirement}</li>
                  ))}
                </ul>
              </div>

              {loadingDeliverable ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Checking for existing submission...</span>
                </div>
              ) : existingDeliverable ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Deliverable Submitted</p>
                      <p className="text-sm text-gray-600 mt-1">
                        File: {existingDeliverable.fileName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted on {new Date(existingDeliverable.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={deliverableConfig.acceptedFileTypes.join(',')}
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <Button
                  onClick={handleFileSelect}
                  disabled={uploading}
                  className="gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      {existingDeliverable ? 'Replace Deliverable' : 'Upload Deliverable'}
                    </>
                  )}
                </Button>
                <Link href={`/templates/${deliverableConfig.templateSlug}`}>
                  <Button variant="outline" className="gap-2">
                    <Eye className="h-4 w-4" />
                    View Template
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Lock className="h-5 w-5" />
                <span className="font-medium">Locked</span>
              </div>
              <p className="text-sm text-gray-600">
                Complete all {Math.round(100 - progress)}% of activities to unlock the module deliverable.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
