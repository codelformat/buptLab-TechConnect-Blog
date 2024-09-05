import React from 'react'
//import Markdown from '../components/Markdown'
import { useState } from 'react';
import VditorEditor from '../components/VditorEditor';
export default function TestMarkDown() {
    const [content, setContent] = useState("");

    const handleInput = (e) => {
      setContent(e.target.value);
    };
  
  return (
    // <div className="mx-auto max-w-2xl space-y-4 py-4">
    //   <textarea
    //     value={content}
    //     onInput={handleInput}
    //     rows={auto}
    //     className="block w-full rounded-md border-0 bg-zinc-100 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-inset dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700 sm:text-sm sm:leading-6"
    //   />
    //   <Markdown content={content} />
      // </div>
      <div>
          <VditorEditor id="viiii"/>
      </div>
  )
}
