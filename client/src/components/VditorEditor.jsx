import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { Alert } from 'flowbite-react';
const VditorEditor = ({ id, handleClickButton, value }) => {
  const vditorRef = useRef(null);
  const [toBeControlled, setToBeControlled] = useState(false);
  useEffect(() => {
    vditorRef.current = new Vditor(id, {
      //height: 500,
      minHeight: 500,
      placeholder: 'Write something....',
      mode: 'ir', // Options: 'ir' (instant rendering), 'wysiwyg', 'sv' (split-view)
      toolbarConfig: {
        pin: true,
      },
      cache: {
        enable: false, // Disable cache if you don't want to save content automatically
      },
      // toolbar: [
      //   'emoji',
      //   'headings',
      //   'bold',
      //   'italic',
      //   'strike',
      //   'link',
      //   'list',
      //   'ordered-list',
      //   'check',
      //   'quote',
      //   'code',
      //   'inline-code',
      //   'insert-after',
      //   'insert-before',
      //   'line',
      //   'table',
      //   'undo',
      //   'redo',
      //   'preview',
      // ],
      // upload: {
      //   url: '/api/upload/editor', // Example upload URL
      // },
      upload: {
        url: '/api/upload/mdfile',  // 上传图片的后端 API 地址
        //accept: '*/*',
        fieldName: 'file',
        // handler(files) {
        //   const file = files[0];
        //   const postFile = async () => {
        //     const formData = new FormData();
        //     formData.append('file', file); // 或者 append('file', blob);
        //     console.log(formData)
        //     fetch('/api/upload/mdfile', {
        //       method: 'POST',
        //       body: formData,
        //     })
        //       .then(response => response.json())
        //       .then(data => {
        //         console.log('Upload successful:', data);
        //       })
        //       .catch(error => {
        //         console.error('Upload error:', error);
        //       });
            
        //   }
        //   postFile();
        // },
        format(files, responseText) {
          const response = JSON.parse(responseText);
          console.log(response);
          if (response.fileUrl) {
            return response.fileUrl;  // 返回图片的下载链接
          }
          else {
            alert('Upload failed');
            return '';
          }
        },
      },
      preview: {
        markdown: {
          sanitize: true, // Sanitize HTML in markdown to prevent XSS attacks
        },
      },
      after: () => {
        console.log('value', value)
        if (value) {
          setToBeControlled(true);
          vditorRef.current.setValue(value)
        }

      }
    });
    console.log('vditorRef.current', vditorRef.current);
  }, []);
  const handlePublish = () => {
    handleClickButton(vditorRef.current.getValue());
  }
  return (
    <>
      <div id={id} className="vditor" />
      <Button onClick={handlePublish} gradientDuoTone='purpleToPink'>
        Submit
      </Button>

    </>);
};

export default VditorEditor;