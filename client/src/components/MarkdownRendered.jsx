import { useEffect, useRef,useState } from "react";
import Vditor from 'vditor';
import VditorPreview from 'vditor/dist/method.min';
import 'vditor/dist/index.css';
const InnerMarkdown = () => {
  return;
}
const MarkdownRenderer = ({ markdown }) => {
    const vditorRef = useRef(null);
  const [innerHtml,setInnerHtml] = useState();
//Vditor.md2html(markdown)
    // useEffect(() => {
    //   const vditor = new Vditor(vditorRef.current, {
    //     mode: 'sv',  
    //     height: 'auto', 
    //     after: () => {
    //       vditor.setValue(markdown);
    //     },
    //   });
  
    //   return () => {
    //     vditor.destroy(); // 清理 Vditor 实例
    //   };
    // }, [markdown]);
  
    // return <div ref={vditorRef}></div>;
  useEffect(() => {
    console.log(markdown);
      Vditor.preview(vditorRef.current, markdown, {
        
        markdown: {
          sanitize: true, 
        },
        theme: 'classic', // Options: 'classic', 'dark', etc.
        after: () => {
          console.log('Markdown rendered successfully');
        },
      });
    }, []);
  // useEffect(() => {
  //   Vditor.md2html(markdown, {}).then(res => setInnerHtml(res))
  // },[])
  // return <div dangerouslySetInnerHTML={{__html:innerHtml}}></div> className="vditor-preview"
    return <div ref={vditorRef} className='p-3 max-w-2xl mx-auto w-full post-content' />;
  };
  
  export default MarkdownRenderer;
  