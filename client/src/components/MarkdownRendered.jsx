import { useEffect, useRef,useState } from "react";
import Vditor from 'vditor';
import 'vditor/dist/index.css';
const MarkdownRenderer = ({ markdown,theme,style}) => {
  const vditorRef = useRef(null);
  //const [innerHtml,setInnerHtml] = useState();

  useEffect(() => {
    console.log(markdown);
      Vditor.preview(vditorRef.current, markdown, {
        
        markdown: {
          sanitize: true, 
        },
        theme: theme?theme:'classic', // Options: 'classic', 'dark', etc.
        after: () => {
          console.log('Markdown rendered successfully');
        },
      });
    }, []);
  // useEffect(() => {
  //   Vditor.md2html(markdown, {}).then(res => setInnerHtml(res))
  // },[])
  // return <div dangerouslySetInnerHTML={{__html:innerHtml}}></div> className="vditor-preview"
  if (style) {
    return <div ref={vditorRef} className={'p-3 max-w-2xl mx-auto w-full post-content '+ `${style}`} />;
  }
  return <div ref={vditorRef} className='p-3 max-w-2xl mx-auto w-full post-content' />;
};
  
export default MarkdownRenderer;
  