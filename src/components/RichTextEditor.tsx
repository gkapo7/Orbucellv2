import { useMemo, useRef, useEffect } from 'react'
import ReactQuill from 'react-quill'
import type { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder = 'Start typing...' }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null)

  const imageHandler = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      // Check file size (warn if too large)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        const proceed = confirm(
          `Image is ${(file.size / 1024 / 1024).toFixed(2)}MB. Large images may cause issues.\n\n` +
          `Would you like to continue? (Consider compressing or using a URL instead)`
        )
        if (!proceed) return
      }

      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        const quill = quillRef.current?.getEditor()
        if (quill) {
          const range = quill.getSelection(true)
          quill.insertEmbed(range.index, 'image', base64String, 'user')
          quill.setSelection(range.index + 1, 0)
        }
      }
      reader.onerror = () => {
        alert('Failed to read image file')
      }
      reader.readAsDataURL(file)
    }
  }

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ['12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px', '36px', '48px'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  )

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'list',
    'bullet',
    'indent',
    'align',
    'link',
    'image',
  ]

  // Enable drag and drop for images
  useEffect(() => {
    const quill = quillRef.current?.getEditor()
    if (!quill) return

    const editor = quill.root

    const makeImagesDraggable = () => {
      const images = editor.querySelectorAll('img:not([data-draggable])')
      images.forEach((img) => {
        img.setAttribute('data-draggable', 'true')
        img.setAttribute('draggable', 'true')
        img.style.cursor = 'move'
        
        // Store original image data
        const imageSrc = img.src

        // Find the image's index in Quill
        const getImageIndex = (imageElement: HTMLImageElement): number | null => {
          const delta = quill.getContents()
          for (let i = 0; i < delta.ops.length; i++) {
            const op = delta.ops[i]
            if (op.insert && typeof op.insert === 'object' && op.insert.image === imageSrc) {
              let index = 0
              for (let j = 0; j < i; j++) {
                const prevOp = delta.ops[j]
                if (typeof prevOp.insert === 'string') {
                  index += prevOp.insert.length
                } else if (prevOp.insert && typeof prevOp.insert === 'object') {
                  index += 1
                }
              }
              return index
            }
          }
          return null
        }

        // Add drag handlers
        img.addEventListener('dragstart', (e) => {
          e.dataTransfer.effectAllowed = 'move'
          e.dataTransfer.setData('text/plain', imageSrc)
          const imageIndex = getImageIndex(img)
          ;(quill as any).draggingImageSrc = imageSrc
          ;(quill as any).draggingImageIndex = imageIndex
          img.style.opacity = '0.5'
        })

        img.addEventListener('dragend', () => {
          img.style.opacity = '1'
          ;(quill as any).draggingImageSrc = null
          ;(quill as any).draggingImageIndex = null
        })
      })
    }

    // Handle drop for repositioning images within editor
    const handleImageDrop = (e: DragEvent) => {
      const draggedSrc = (quill as any).draggingImageSrc
      const draggedIndex = (quill as any).draggingImageIndex
      
      // Only handle if we're dragging an image from within the editor
      if (!draggedSrc || draggedIndex === null || draggedIndex === undefined) {
        return // Let file drop handler handle it
      }

      e.preventDefault()
      e.stopPropagation()

      // Get the drop position
      const selection = quill.getSelection(true)
      if (!selection) {
        // If no selection, insert at end
        const length = quill.getLength()
        quill.setSelection(length - 1, 0)
      }

      const newRange = quill.getSelection(true)
      if (!newRange) return

      const dropIndex = newRange.index

      // Remove the original image if it exists
      try {
        quill.deleteText(draggedIndex, 1)
        // Adjust drop index if dropping after the removed image
        const adjustedIndex = dropIndex > draggedIndex ? dropIndex - 1 : dropIndex
        quill.insertEmbed(adjustedIndex, 'image', draggedSrc, 'user')
        quill.setSelection(adjustedIndex + 1, 0)
      } catch (error) {
        // If deletion fails, just insert at new position (duplicate will occur)
        quill.insertEmbed(dropIndex, 'image', draggedSrc, 'user')
        quill.setSelection(dropIndex + 1, 0)
      }

      ;(quill as any).draggingImageSrc = null
      ;(quill as any).draggingImageIndex = null
    }

    // Make existing images draggable
    makeImagesDraggable()

    // Watch for new images added
    const observer = new MutationObserver(() => {
      makeImagesDraggable()
    })

    observer.observe(editor, {
      childList: true,
      subtree: true,
    })

    // Add drop handler to editor for image repositioning
    editor.addEventListener('drop', handleImageDrop, true) // Use capture phase
    editor.addEventListener('dragover', (e) => {
      // Only set move effect if dragging an image from within editor
      if ((quill as any).draggingImageSrc) {
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'move'
      }
    }, true) // Use capture phase

    return () => {
      observer.disconnect()
      editor.removeEventListener('drop', handleImageDrop, true)
    }
  }, [value, onChange])

  // Handle paste events for images
  useEffect(() => {
    const quill = quillRef.current?.getEditor()
    if (!quill) return

    const editor = quill.root

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
              const base64String = reader.result as string
              const range = quill.getSelection(true)
              quill.insertEmbed(range.index, 'image', base64String, 'user')
              quill.setSelection(range.index + 1, 0)
            }
            reader.readAsDataURL(file)
          }
        }
      }
    }

    editor.addEventListener('paste', handlePaste)
    return () => {
      editor.removeEventListener('paste', handlePaste)
    }
  }, [])

  // Handle drag and drop from file system
  useEffect(() => {
    const quill = quillRef.current?.getEditor()
    if (!quill) return

    const editor = quill.root

    const handleFileDragOver = (e: DragEvent) => {
      // Only handle if not dragging an image from within editor
      if ((quill as any).draggingImageSrc) {
        return // Let image drag handler handle it
      }
      
      // Check if dragging files
      if (e.dataTransfer?.types.includes('Files')) {
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'copy'
      }
    }

    const handleFileDrop = (e: DragEvent) => {
      // Only handle if not dragging an image from within editor
      if ((quill as any).draggingImageSrc) {
        return // Let image drag handler handle it
      }

      e.preventDefault()
      e.stopPropagation()

      const files = e.dataTransfer?.files
      if (!files || files.length === 0) return

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.type.startsWith('image/')) {
          // Check file size
          const maxSize = 5 * 1024 * 1024 // 5MB
          if (file.size > maxSize) {
            const proceed = confirm(
              `Image "${file.name}" is ${(file.size / 1024 / 1024).toFixed(2)}MB. Large images may cause issues.\n\n` +
              `Would you like to continue?`
            )
            if (!proceed) continue
          }

          const reader = new FileReader()
          reader.onloadend = () => {
            const base64String = reader.result as string
            const range = quill.getSelection(true)
            const insertIndex = range ? range.index : quill.getLength() - 1
            quill.insertEmbed(insertIndex, 'image', base64String, 'user')
            quill.setSelection(insertIndex + 1, 0)
          }
          reader.onerror = () => {
            alert(`Failed to read image file: ${file.name}`)
          }
          reader.readAsDataURL(file)
        }
      }
    }

    editor.addEventListener('dragover', handleFileDragOver)
    editor.addEventListener('drop', handleFileDrop)

    return () => {
      editor.removeEventListener('dragover', handleFileDragOver)
      editor.removeEventListener('drop', handleFileDrop)
    }
  }, [])

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: 'white',
        }}
      />
      <style>{`
        .rich-text-editor .ql-container {
          font-size: 14px;
          min-height: 200px;
        }
        .rich-text-editor .ql-editor {
          min-height: 200px;
          font-family: inherit;
        }
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-bottom: none;
          border-radius: 0.5rem 0.5rem 0 0;
          background: #f9fafb;
          padding: 8px;
        }
        .rich-text-editor .ql-container {
          border-bottom: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 0.5rem 0.5rem;
        }
        .rich-text-editor .ql-stroke {
          stroke: #374151;
        }
        .rich-text-editor .ql-fill {
          fill: #374151;
        }
        .rich-text-editor .ql-picker-label {
          color: #374151;
        }
        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button.ql-active {
          color: #f97316;
        }
        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #f97316;
        }
        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #f97316;
        }
        .rich-text-editor .ql-editor img {
          cursor: move;
          max-width: 100%;
          height: auto;
          margin: 8px 0;
          border: 2px dashed transparent;
          transition: border-color 0.2s;
        }
        .rich-text-editor .ql-editor img:hover {
          border-color: #f97316;
          opacity: 0.9;
        }
        .rich-text-editor .ql-editor img[draggable="true"] {
          user-select: none;
        }
      `}</style>
    </div>
  )
}

