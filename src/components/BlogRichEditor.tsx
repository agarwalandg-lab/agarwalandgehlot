import { useCallback, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import YouTube from '@tiptap/extension-youtube';
import { FiAlignCenter, FiAlignLeft, FiAlignRight, FiBold, FiCode, FiImage, FiItalic, FiLink, FiList, FiMinus, FiPlus, FiTable, FiTrash2, FiType, FiYoutube } from 'react-icons/fi';

const buttonClass = 'flex h-9 min-w-9 items-center justify-center border border-stroke px-2 text-sm text-muted transition-colors hover:bg-surface hover:text-text-primary disabled:opacity-40';

function ToolbarButton({ label, active, disabled, onClick, children }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" title={label} aria-label={label} aria-pressed={active} disabled={disabled} onClick={onClick} className={`${buttonClass} ${active ? 'bg-surface text-text-primary' : ''}`}>{children}</button>;
}

function addLink(editor: Editor) {
  const previous = editor.getAttributes('link').href as string | undefined;
  const value = window.prompt('Enter a page path or secure URL', previous || '');
  if (value === null) return;
  const href = value.trim();
  if (!href) return editor.chain().focus().unsetLink().run();
  const safeHref = href.startsWith('/') || href.startsWith('#') ? href : /^https:\/\//i.test(href) ? href : `https://${href}`;
  editor.chain().focus().extendMarkRange('link').setLink({ href: safeHref, target: safeHref.startsWith('/') || safeHref.startsWith('#') ? null : '_blank', rel: 'noopener noreferrer' }).run();
}

export default function BlogRichEditor({ value, onChange, onUploadImage }: { value: string; onChange: (html: string) => void; onUploadImage: (file: File) => Promise<{ src: string; srcset: string; width: number; height: number }> }) {
  const handleImage = useCallback(async (event: React.ChangeEvent<HTMLInputElement>, editor: Editor) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    try {
      const alt = window.prompt('Describe this image for screen readers and search', editor.getAttributes('image').alt || file.name.replace(/\.[^.]+$/, '')) || '';
      if (!alt.trim()) throw new Error('Alt text is required for article images.');
      const image = await onUploadImage(file);
      editor.chain().focus().command(({ state, tr, dispatch }) => {
        const imageNode = state.schema.nodes.image;
        if (!imageNode) return false;
        const selectedImage = state.doc.nodeAt(state.selection.from);
        if (selectedImage?.type === imageNode) {
          if (dispatch) dispatch(tr.setNodeMarkup(state.selection.from, undefined, { ...selectedImage.attrs, src: image.src, srcset: image.srcset, sizes: '100vw', width: image.width, height: image.height, alt, title: alt }).scrollIntoView());
          return true;
        }
        if (dispatch) dispatch(tr.replaceSelectionWith(imageNode.create({ src: image.src, srcset: image.srcset, sizes: '100vw', width: image.width, height: image.height, alt, title: alt })).scrollIntoView());
        return true;
      }).run();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Image upload failed.');
    }
  }, [onUploadImage]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: false,
        underline: false,
      }),
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https', HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            srcset: { default: null, parseHTML: (element) => element.getAttribute('srcset'), renderHTML: (attributes) => attributes.srcset ? { srcset: attributes.srcset } : {} },
            sizes: { default: '100vw', parseHTML: (element) => element.getAttribute('sizes'), renderHTML: (attributes) => attributes.sizes ? { sizes: attributes.sizes } : {} },
            width: { default: null, parseHTML: (element) => element.getAttribute('width'), renderHTML: (attributes) => attributes.width ? { width: attributes.width } : {} },
            height: { default: null, parseHTML: (element) => element.getAttribute('height'), renderHTML: (attributes) => attributes.height ? { height: attributes.height } : {} },
            alignment: {
              default: 'center',
              parseHTML: (element) => element.getAttribute('data-alignment') || 'center',
              renderHTML: (attributes) => ({ 'data-alignment': attributes.alignment, style: attributes.alignment === 'left' ? 'float:left;max-width:50%;margin:0 1rem 1rem 0' : attributes.alignment === 'right' ? 'float:right;max-width:50%;margin:0 0 1rem 1rem' : 'display:block;max-width:100%;margin:1rem auto' }),
            },
            loading: { default: 'lazy', renderHTML: () => ({ loading: 'lazy', decoding: 'async' }) },
          };
        },
      }).configure({ inline: false, allowBase64: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      YouTube.configure({ controls: true, nocookie: true, modestBranding: true, width: 720, height: 405 }),
    ],
    content: value,
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
    editorProps: {
      attributes: {
        class: 'blog-prose min-h-[380px] max-w-none px-5 py-4 text-text-primary focus:outline-none',
        'aria-label': 'Blog article content',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value || '', { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return <div className="min-h-[420px] animate-pulse border border-stroke bg-surface" aria-label="Loading editor" />;

  return <section className="border border-stroke" aria-label="Blog content editor">
    <div className="flex flex-wrap items-center gap-1 border-b border-stroke p-2">
      <ToolbarButton label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><span>H2</span></ToolbarButton>
      <ToolbarButton label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><span>H3</span></ToolbarButton>
      <ToolbarButton label="Heading 4" active={editor.isActive('heading', { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}><span>H4</span></ToolbarButton>
      <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><FiBold /></ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><FiItalic /></ToolbarButton>
      <ToolbarButton label="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><FiList /></ToolbarButton>
      <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><span>1.</span></ToolbarButton>
      <ToolbarButton label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><FiCode /></ToolbarButton>
      <ToolbarButton label="Insert link" active={editor.isActive('link')} onClick={() => addLink(editor)}><FiLink /></ToolbarButton>
      <ToolbarButton label={editor.isActive('image') ? 'Position image left' : 'Align left'} active={editor.isActive('image') ? editor.getAttributes('image').alignment === 'left' : editor.isActive({ textAlign: 'left' })} onClick={() => editor.isActive('image') ? editor.chain().focus().updateAttributes('image', { alignment: 'left' }).run() : editor.chain().focus().setTextAlign('left').run()}><FiAlignLeft /></ToolbarButton>
      <ToolbarButton label={editor.isActive('image') ? 'Center image' : 'Align center'} active={editor.isActive('image') ? editor.getAttributes('image').alignment === 'center' : editor.isActive({ textAlign: 'center' })} onClick={() => editor.isActive('image') ? editor.chain().focus().updateAttributes('image', { alignment: 'center' }).run() : editor.chain().focus().setTextAlign('center').run()}><FiAlignCenter /></ToolbarButton>
      <ToolbarButton label={editor.isActive('image') ? 'Position image right' : 'Align right'} active={editor.isActive('image') ? editor.getAttributes('image').alignment === 'right' : editor.isActive({ textAlign: 'right' })} onClick={() => editor.isActive('image') ? editor.chain().focus().updateAttributes('image', { alignment: 'right' }).run() : editor.chain().focus().setTextAlign('right').run()}><FiAlignRight /></ToolbarButton>
      <ToolbarButton label="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><FiTable /></ToolbarButton>
      <ToolbarButton label="Add table row" disabled={!editor.isActive('table')} onClick={() => editor.chain().focus().addRowAfter().run()}><FiPlus /></ToolbarButton>
      <ToolbarButton label="Delete table row" disabled={!editor.isActive('table')} onClick={() => editor.chain().focus().deleteRow().run()}><FiMinus /></ToolbarButton>
      <label className={`${buttonClass} cursor-pointer`} title="Upload article image">
        <FiImage />
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(event) => void handleImage(event, editor)} />
      </label>
      <ToolbarButton label="Delete selected image" disabled={!editor.isActive('image')} onClick={() => editor.chain().focus().deleteNode('image').run()}><FiTrash2 /></ToolbarButton>
      <ToolbarButton label="Add image caption" disabled={!editor.isActive('image')} onClick={() => { const caption = window.prompt('Enter a short image caption'); if (caption?.trim()) editor.commands.insertContentAt(editor.state.selection.to, { type: 'paragraph', content: [{ type: 'text', text: caption.trim() }] }); }}><FiType /></ToolbarButton>
      <ToolbarButton label="Embed YouTube video" onClick={() => { const url = window.prompt('Enter a YouTube video URL'); if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run(); }}><FiYoutube /></ToolbarButton>
      <ToolbarButton label="Insert divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><FiMinus /></ToolbarButton>
    </div>
    <EditorContent editor={editor} />
    <div className="border-t border-stroke px-5 py-2 text-xs text-muted">Use H2–H4 for article sections. The page title is the article&apos;s only H1.</div>
  </section>;
}
