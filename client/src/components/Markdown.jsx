
import React, { useState } from 'react';
import { marked } from 'marked';
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github.css';

import { useEffect } from 'react';
export default function Markdown({ content }) {
  useEffect(() => {
    hljs.highlightAll();
  }, []);
  return (
    <>
    {/* {<ReactMarkdown
      rehypePlugins={[rehypeHighlight]}
      className="prose prose-zinc max-w-none dark:prose-invert"
    >
      {content}
    </ReactMarkdown>} */}
    <div 
      
      dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
      className="m-5 prose prose-zinc max-w-none dark:prose-invert"
    />
    </>
  );
};


// export default function Markdown({content}) {

//   return (
    
//     <div 
//     rehypePlugins={[rehypeHighlight]}
//         dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
//         className="prose prose-zinc max-w-none dark:prose-invert"
//       />
    
//    );
// }
