"use client";
import { useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Heading2, List, ListOrdered, Quote, Link as LinkIcon, ImagePlus, AlignLeft, AlignCenter, Undo2, Redo2 } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import styles from "./RichEditor.module.css";

export function RichEditor({ name, initialContent }: { name:string; initialContent:string }) {
  const [html,setHtml]=useState(initialContent); const [uploading,setUploading]=useState(false); const fileRef=useRef<HTMLInputElement>(null);
  const editor=useEditor({immediatelyRender:false,extensions:[StarterKit,Image.configure({resize:{enabled:true,minWidth:120,minHeight:80}}),Link.configure({openOnClick:false}),TextAlign.configure({types:["heading","paragraph"]}),Placeholder.configure({placeholder:"Begin Ted’s story here…"})],content:initialContent,onUpdate:({editor})=>setHtml(editor.getHTML())});
  if(!editor) return <div className={styles.loading}>Preparing editor…</div>;
  const link=()=>{const url=window.prompt("Paste the link URL"); if(url) editor.chain().focus().extendMarkRange("link").setLink({href:url}).run();};
  async function upload(file?:File){if(!file)return; const supabase=getSupabaseBrowser(); if(!supabase){window.alert("Connect Supabase before uploading images.");return;} setUploading(true); const path=`inline/${Date.now()}-${file.name.replace(/[^a-z0-9.]+/gi,"-")}`; const {error}=await supabase.storage.from("article-images").upload(path,file); if(error)window.alert(error.message); else editor!.chain().focus().setImage({src:supabase.storage.from("article-images").getPublicUrl(path).data.publicUrl,alt:file.name}).run(); setUploading(false);}
  const button=(label:string,icon:React.ReactNode,run:()=>void,active=false)=><button type="button" title={label} aria-label={label} className={active?styles.active:""} onClick={run}>{icon}</button>;
  return <div className={styles.editor}><input type="hidden" name={name} value={html}/><div className={styles.toolbar}>
    {button("Bold",<Bold size={17}/>,()=>editor.chain().focus().toggleBold().run(),editor.isActive("bold"))}{button("Italic",<Italic size={17}/>,()=>editor.chain().focus().toggleItalic().run(),editor.isActive("italic"))}{button("Section heading",<Heading2 size={17}/>,()=>editor.chain().focus().toggleHeading({level:2}).run(),editor.isActive("heading",{level:2}))}
    {button("Bulleted list",<List size={17}/>,()=>editor.chain().focus().toggleBulletList().run(),editor.isActive("bulletList"))}{button("Numbered list",<ListOrdered size={17}/>,()=>editor.chain().focus().toggleOrderedList().run(),editor.isActive("orderedList"))}{button("Quote",<Quote size={17}/>,()=>editor.chain().focus().toggleBlockquote().run(),editor.isActive("blockquote"))}
    {button("Link",<LinkIcon size={17}/>,link,editor.isActive("link"))}{button(uploading?"Uploading…":"Insert image",<ImagePlus size={17}/>,()=>fileRef.current?.click())}{button("Align left",<AlignLeft size={17}/>,()=>editor.chain().focus().setTextAlign("left").run())}{button("Align center",<AlignCenter size={17}/>,()=>editor.chain().focus().setTextAlign("center").run())}{button("Undo",<Undo2 size={17}/>,()=>editor.chain().focus().undo().run())}{button("Redo",<Redo2 size={17}/>,()=>editor.chain().focus().redo().run())}
    <input ref={fileRef} hidden type="file" accept="image/*" onChange={e=>void upload(e.target.files?.[0])}/></div><EditorContent editor={editor}/><footer><span>{editor.storage.characterCount?.characters?.() ?? editor.getText().length} characters</span><span>Changes save when you press Save article</span></footer></div>;
}
