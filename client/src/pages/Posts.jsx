// /client/src/pages/Posts.jsx
import React from 'react'
import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PostCard from '../components/PostCard';
import PostBox from '../components/PostBox';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.min.css';




export default function Posts() {

  // const tempUser = useSelector((state) => state.user);
  // const currentUser = tempUser.currentUser.rest? tempUser.currentUser.rest : tempUser.currentUser;
  const [uncategorizedPosts, setUncategorizedPosts] = useState([]);
  const [javascriptPosts, setJavascriptPosts] = useState([]);
  const [reactjsPosts, setReactjsPosts] = useState([]);
  const [nextjsPosts, setNextjsPosts] = useState([]);
  // const [showMore, setShowMore] = useState(true);
  // const [showModal, setShowModal] = useState(false);
  // console.log(currentUser);

  useEffect(() => {
    const fetchUncategorizedPosts = async () => {
      try {
        const res = await fetch("/api/post/getpostsByCategory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: 'uncategorized' }),
        });
        const data = await res.json();
        if (res.ok) {
          setUncategorizedPosts(data);
          console.log(uncategorizedPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchJavaScriptPosts = async () => {
      try {
        const res = await fetch("/api/post/getpostsByCategory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: 'javascript' }),
        });
        const data = await res.json();
        if (res.ok) {
          setJavascriptPosts(data);
          console.log(uncategorizedPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchReactjsPosts = async () => {
      try {
        const res = await fetch("/api/post/getpostsByCategory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: 'reactjs' }),
        });
        const data = await res.json();
        if (res.ok) {
          setReactjsPosts(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchNextjsdPosts = async () => {
      try {
        const res = await fetch("/api/post/getpostsByCategory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: 'nextjs' }),
        });
        const data = await res.json();
        if (res.ok) {
          setNextjsPosts(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUncategorizedPosts();
    fetchJavaScriptPosts();
    fetchReactjsPosts();
    fetchNextjsdPosts();
  }, [1]);

  return (
    <div>

      {/*NextJS */}
      <div className='text-left'>
        {/* <i className='fas fa-solid fa-heart text-red-500 text-3xl'></i> */}
        <h1 className='text-xl mt-5 font-bold pl-36'>Next.js</h1>
      </div>
      <br/>
      <div className='flex justify-center'>
        <div className='flex justify-center w-4/5'>
          {
            <PostBox posts={nextjsPosts}/>
          }
        </div>
      </div>

      {/*ReactJS */}
      <div className='text-left'>
        {/* <i className='fas fa-solid fa-heart text-red-500 text-3xl'></i> */}
        <h1 className='text-xl mt-5 font-bold pl-36'>React.js</h1>
      </div>
      <br/>
      <div className='flex justify-center'>
        <div className='flex justify-center w-4/5'>
          {
            <PostBox posts={reactjsPosts}/>
          }
        </div>
      </div>

      {/*JS */}
      <div className='text-left'>
        {/* <i className='fas fa-solid fa-heart text-red-500 text-3xl'></i> */}
        <h1 className='text-xl mt-5 font-bold pl-36'>JavaScript</h1>
      </div>
      <br/>
      <div className='flex justify-center'>
        <div className='flex justify-center w-4/5'>
          {
            <PostBox posts={javascriptPosts}/>
          }
        </div>
      </div>

      {/*其他 */}
      <div className='text-left'>
        {/* <i className='fas fa-solid fa-heart text-red-500 text-3xl'></i> */}
        <h1 className='text-xl mt-5 font-bold pl-36'>Others</h1>
      </div>
      <br/>
      <div className='flex justify-center'>
        <div className='flex justify-center w-4/5'>
          {
            <PostBox posts={uncategorizedPosts}/>
          }
        </div>
      </div>

    </div>
  );
}