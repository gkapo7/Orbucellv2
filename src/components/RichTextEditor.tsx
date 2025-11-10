import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEffect, useRef } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const draggingImageRef = useRef<string | null>(null)
  const draggingImagePosRef = useRef<number | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        // Disable built-in link and underline to use our configured versions
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#f97316] hover:underline',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto my-2 cursor-move border-2 border-dashed border-transparent hover:border-[#f97316] transition-all',
        },
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[200px] px-4 py-3',
      },
    },
  })

  // Handle paste images
  useEffect(() => {
    if (!editor) return

    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.indexOf('image') !== -1) {
          event.preventDefault()
          const file = item.getAsFile()
          if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
              const base64String = reader.result as string
              editor.chain().focus().setImage({ src: base64String }).run()
            }
            reader.readAsDataURL(file)
          }
          return
        }
      }
    }

    if (editor.view) {
      editor.view.dom.addEventListener('paste', handlePaste)
    }

    return () => {
      if (editor.view) {
        editor.view.dom.removeEventListener('paste', handlePaste)
      }
    }
  }, [editor])

  // Handle image upload button
  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file || !editor) return

      // Check file size
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
        editor.chain().focus().setImage({ src: base64String }).run()
      }
      reader.onerror = () => {
        alert('Failed to read image file')
      }
      reader.readAsDataURL(file)
    }
  }


  // Handle drag and drop images from file system
  useEffect(() => {
    if (!editor || !editor.view) return

    const editorElement = editor.view.dom

    const handleDragOver = (e: DragEvent) => {
      if (draggingImageRef.current) {
        return // Let image drag handler handle it
      }
      
      if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'copy'
      }
    }

    const handleDrop = (e: DragEvent) => {
      if (draggingImageRef.current) {
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
            editor.chain().focus().setImage({ src: base64String }).run()
          }
          reader.onerror = () => {
            alert(`Failed to read image file: ${file.name}`)
          }
          reader.readAsDataURL(file)
        }
      }
    }

    editorElement.addEventListener('dragover', handleDragOver)
    editorElement.addEventListener('drop', handleDrop)

    return () => {
      editorElement.removeEventListener('dragover', handleDragOver)
      editorElement.removeEventListener('drop', handleDrop)
    }
  }, [editor])

  // Make images draggable and handle repositioning
  useEffect(() => {
    if (!editor || !editor.view) return

    const editorElement = editor.view.dom

    const makeImagesDraggable = () => {
      const images = editorElement.querySelectorAll('img:not([data-draggable])') as NodeListOf<HTMLImageElement>
      images.forEach((img) => {
        img.setAttribute('data-draggable', 'true')
        img.setAttribute('draggable', 'true')
        img.style.cursor = 'move'
        img.style.userSelect = 'none'

        // Find image position in editor
        const getImagePos = (): number | null => {
          const { doc } = editor.state
          let pos = 0
          
          doc.descendants((node, position) => {
            if (node.type.name === 'image' && node.attrs.src === img.src) {
              pos = position
              return false
            }
            return true
          })
          
          return pos > 0 ? pos : null
        }

        img.addEventListener('dragstart', (e: DragEvent) => {
          if (!e.dataTransfer) return
          e.dataTransfer.effectAllowed = 'move'
          e.dataTransfer.setData('text/plain', img.src)
          
          const pos = getImagePos()
          draggingImageRef.current = img.src
          draggingImagePosRef.current = pos
          
          img.style.opacity = '0.5'
        })

        img.addEventListener('dragend', () => {
          img.style.opacity = '1'
          draggingImageRef.current = null
          draggingImagePosRef.current = null
        })
      })
    }

    // Handle drop for repositioning images
    const handleImageDrop = (e: DragEvent) => {
      if (!draggingImageRef.current || draggingImagePosRef.current === null) {
        return
      }

      e.preventDefault()
      e.stopPropagation()

      const { from } = editor.state.selection
      const oldPos = draggingImagePosRef.current
      const imageSrc = draggingImageRef.current

      // Remove old image
      editor.chain().focus().deleteRange({ from: oldPos, to: oldPos + 1 }).run()

      // Insert at new position (adjust for deletion)
      const newPos = from > oldPos ? from - 1 : from
      editor.chain().focus().setTextSelection(newPos).setImage({ src: imageSrc }).run()

      draggingImageRef.current = null
      draggingImagePosRef.current = null
    }

    // Wait for editor to be fully mounted
    let observer: MutationObserver | null = null
    const timeoutId = setTimeout(() => {
      if (!editor.view) return
      makeImagesDraggable()

      // Watch for new images
      observer = new MutationObserver(() => {
        makeImagesDraggable()
      })

      observer.observe(editorElement, {
        childList: true,
        subtree: true,
      })

      editorElement.addEventListener('drop', handleImageDrop, true)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (observer) {
        observer.disconnect()
      }
      if (editor.view) {
        editor.view.dom.removeEventListener('drop', handleImageDrop, true)
      }
    }
  }, [editor])

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="rich-text-editor border border-neutral-300 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-neutral-50 border-b border-neutral-300">
        {/* Heading */}
        <div className="flex items-center gap-1 border-r border-neutral-300 pr-2">
          <select
            value={editor.getAttributes('heading').level || ''}
            onChange={(e) => {
              const level = e.target.value ? parseInt(e.target.value) : null
              if (level) {
                editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
              } else {
                editor.chain().focus().setParagraph().run()
              }
            }}
            className="text-xs border border-neutral-300 rounded px-2 py-1 bg-white"
          >
            <option value="">Normal</option>
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
            <option value="4">H4</option>
            <option value="5">H5</option>
            <option value="6">H6</option>
          </select>
        </div>

        {/* Font formatting */}
        <div className="flex items-center gap-1 border-r border-neutral-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-neutral-200 ${editor.isActive('bold') ? 'bg-[#f97316] text-white' : ''}`}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-neutral-200 ${editor.isActive('italic') ? 'bg-[#f97316] text-white' : ''}`}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded hover:bg-neutral-200 ${editor.isActive('underline') ? 'bg-[#f97316] text-white' : ''}`}
            title="Underline"
          >
            <u>U</u>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded hover:bg-neutral-200 ${editor.isActive('strike') ? 'bg-[#f97316] text-white' : ''}`}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        {/* Color */}
        <div className="flex items-center gap-1 border-r border-neutral-300 pr-2">
          <input
            type="color"
            value={editor.getAttributes('textStyle').color || '#000000'}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="w-8 h-8 rounded border border-neutral-300 cursor-pointer"
            title="Text Color"
          />
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-neutral-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded hover:bg-neutral-200 ${editor.isActive('bulletList') ? 'bg-[#f97316] text-white' : ''}`}
            title="Bullet List"
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded hover:bg-neutral-200 ${editor.isActive('orderedList') ? 'bg-[#f97316] text-white' : ''}`}
            title="Numbered List"
          >
            1.
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r border-neutral-300 pr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1.5 rounded hover:bg-neutral-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-[#f97316] text-white' : ''}`}
            title="Align Left"
          >
            ←
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1.5 rounded hover:bg-neutral-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-[#f97316] text-white' : ''}`}
            title="Align Center"
          >
            ↔
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-1.5 rounded hover:bg-neutral-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-[#f97316] text-white' : ''}`}
            title="Align Right"
          >
            →
          </button>
        </div>

        {/* Link */}
        <button
          onClick={() => {
            const url = window.prompt('Enter URL:')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          className={`p-1.5 rounded hover:bg-neutral-200 ${editor.isActive('link') ? 'bg-[#f97316] text-white' : ''}`}
          title="Link"
        >
          🔗
        </button>

        {/* Image */}
        <button
          onClick={handleImageUpload}
          className="p-1.5 rounded hover:bg-neutral-200"
          title="Insert Image"
        >
          🖼️
        </button>

        {/* Clean */}
        <button
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="p-1.5 rounded hover:bg-neutral-200 ml-auto"
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
