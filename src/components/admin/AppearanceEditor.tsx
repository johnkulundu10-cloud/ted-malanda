"use client";

import Select, { type StylesConfig } from "react-select";
import { useState } from "react";
import { saveAppearance } from "@/app/admin/actions";
import styles from "@/app/admin/admin.module.css";

type Option={value:string;label:string};
const headingOptions:Option[]=[{value:"Figtree",label:"Figtree"},{value:"Arial",label:"Arial"},{value:"Georgia",label:"Georgia"}];
const readingOptions:Option[]=[{value:"Source Serif 4",label:"Source Serif 4"},{value:"Georgia",label:"Georgia"},{value:"Arial",label:"Arial"}];
const fontStack:Record<string,string>={Figtree:"Figtree, Arial, sans-serif",Arial:"Arial, sans-serif",Georgia:"Georgia, serif","Source Serif 4":"'Source Serif 4', Georgia, serif"};
const selectStyles:StylesConfig<Option,false>={
  control:(base)=>({...base,minHeight:44,borderRadius:3,borderColor:"var(--color-border)",background:"var(--color-surface)",boxShadow:"none",cursor:"pointer","&:hover":{borderColor:"var(--color-border)"}}),
  menu:(base)=>({...base,zIndex:30,background:"var(--color-surface)",border:"1px solid var(--color-border)",borderRadius:3,boxShadow:"0 12px 30px rgba(0,0,0,.1)"}),
  option:(base,state)=>({...base,background:state.isSelected?"var(--color-text)":state.isFocused?"var(--color-chrome)":"transparent",color:state.isSelected?"var(--color-canvas)":"var(--color-text)",cursor:"pointer"}),
  singleValue:(base)=>({...base,color:"var(--color-text)"}),input:(base)=>({...base,color:"var(--color-text)"}),
};

export function AppearanceEditor({headingDefault,readingDefault}:{headingDefault:string;readingDefault:string}) {
  const [heading,setHeading]=useState(headingDefault);
  const [reading,setReading]=useState(readingDefault);
  return <>
    <form className={`${styles.form} ${styles.appearanceForm}`} action={saveAppearance}>
      <div><h2>Typography</h2><p>Choose how navigation, titles and long-form reading text appear throughout the website.</p></div>
      <input type="hidden" name="heading_font" value={heading}/><input type="hidden" name="reading_font" value={reading}/>
      <div className={styles.columns}><div className={styles.field}><label>Titles and menus</label><Select<Option,false> instanceId="heading-font" value={headingOptions.find((item)=>item.value===heading)} options={headingOptions} onChange={(item)=>setHeading(item?.value??"Figtree")} styles={selectStyles}/></div><div className={styles.field}><label>Article text</label><Select<Option,false> instanceId="reading-font" value={readingOptions.find((item)=>item.value===reading)} options={readingOptions} onChange={(item)=>setReading(item?.value??"Source Serif 4")} styles={selectStyles}/></div></div>
      <div className={styles.actions}><button className={styles.primary}>Save appearance</button></div>
    </form>
    <section className={styles.fontPreview}><div className={styles.previewLabel}><span>Live preview</span><small>{heading} + {reading}</small></div><div className={styles.previewNav} style={{fontFamily:fontStack[heading]}}>TED MALANDA <nav>Articles &nbsp;&nbsp; Archive &nbsp;&nbsp; About</nav></div><article><p style={{fontFamily:fontStack[heading]}}>KENYAN LIFE</p><h2 style={{fontFamily:fontStack[heading]}}>Stories from the curious business of being Kenyan</h2><div style={{fontFamily:fontStack[reading]}}>The city wakes slowly, gathering its noise and ambition one street at a time. This preview shows how an article introduction and longer paragraphs will feel to readers.</div></article></section>
  </>;
}
