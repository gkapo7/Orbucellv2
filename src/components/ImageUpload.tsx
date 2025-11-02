import { useState, useRef } from 'react'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  placeholder?: string
  label?: string
}

export default function ImageUpload({ value, onChange, placeholder = '/images/upload.jpg', label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      // Check file size (warn if too large for base64 - can cause 413 errors)
      const maxSize = 2 * 1024 * 1024 // 2MB
      if (file.size > maxSize) {
        const useBase64 = confirm(
          `Image is ${(file.size / 1024 / 1024).toFixed(2)}MB. Large images may cause "Payload Too Large" errors.\n\n` +
          `Would you like to continue? (Consider using a URL instead for large images)`
        )
        if (!useBase64) {
          setUploading(false)
          return
        }
      }
      
      // Convert to base64 data URL for immediate use (no API call needed)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        // Warn if base64 string is very large
        if (base64String.length > 1_000_000) { // ~1MB base64 = ~750KB image
          console.warn('Large base64 image - may cause 413 Payload Too Large errors. Consider using image URLs instead.')
        }
        onChange(base64String)
        setUploading(false)
      }
      reader.onerror = () => {
        console.error('Failed to read file')
        setUploading(false)
        // Allow fallback to URL input - don't show alert
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Upload error:', error)
      setUploading(false)
      // Don't show alert - allow URL input fallback
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleUpload(file)
    } else {
      alert('Please drop an image file')
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-neutral-700">{label}</label>}
      <div
        className={`relative rounded-lg border-2 border-dashed p-4 transition ${
          dragActive ? 'border-[#f97316] bg-orange-50' : 'border-neutral-300 hover:border-neutral-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
      >
        {value ? (
          <div className="space-y-2">
            <img src={value} alt="Preview" className="h-32 w-full rounded object-cover" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="admin-input text-sm"
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Clear image
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-neutral-600 mb-2">
              Drag & drop an image here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#f97316] hover:underline font-medium"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-neutral-500">Or paste a URL below</p>
            <input
              type="text"
              value=""
              onChange={(e) => {
                if (e.target.value.trim()) {
                  onChange(e.target.value.trim())
                }
              }}
              className="admin-input text-sm mt-2"
              placeholder={placeholder}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData('text')
                if (pasted.trim()) {
                  setTimeout(() => onChange(pasted.trim()), 0)
                }
              }}
            />
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg z-10">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#f97316] mb-2"></div>
              <p className="text-sm text-neutral-600">Uploading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

