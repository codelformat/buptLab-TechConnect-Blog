// /client/src/pages/PostIndex.jsx
import { Button, HR } from 'flowbite-react';
import React from 'react'
import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
export default function PostIndex() {
  const onceCount = 3;
  const [showMore, setShowMore] = useState(false);
  const [posts, setPosts] = useState(null);
  const [number, setNumber] = useState({});/*() => {
    let totalCount = 0;
    let restCount = 0;
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getPostsCount');
        console.log('getPostCount', res);
        if (res.ok) {
          const data = await res.json();
          
          totalCount = (parseInt(data.count));
          console.log('totalCount', totalCount);
          //restCount=(totalCount - onceCount);
          restCount = totalCount;
          console.log('useState restCount', restCount);
          
        }
      }
      catch (error) {
        console.log(error.message);
      }
    }
    fetchPosts();
    return { totalCount, restCount };
  })*/
  //const [totalCount,setTotalCount] = useState(0);
  //const [restCount,setRestCount] = useState(0);
  //let totalCount=0;
  //let restCount=0;
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getPostsCount');
        console.log('getPostCount', res);
        if (res.ok) {
          
          const data = await res.json();/*
          console.log('totalCount', totalCount);
          setTotalCount(parseInt(data.count));
          console.log('totalCount', totalCount);
          console.log('useEffect restCount', restCount);
          setRestCount(totalCount - onceCount);
          console.log('restCount', restCount);*/
          const response = await fetch(
            `/api/post/getposts`, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ limit: onceCount  }),
            }
          );         
          if (response.ok) {
            const postData = await response.json();
            setPosts(postData.posts);
            console.log('useEffect restCount', number.restCount);
            if (data.count>onceCount) {
              setShowMore(true);
            }
            else {
              setShowMore(false);
            }
            setNumber({ totalCount:parseInt(data.count), restCount: parseInt(data.count) - onceCount });
            console.log(number);
          }          
        }
      }
      catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
  }, []);
  
  const handleShowMore = async () => {
    if (!showMore) return;
    const startIndex = posts.length;
    console.log(number);
    try {
      const res = await fetch(
        `/api/post/getposts?startIndex=${startIndex}`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ limit: onceCount  }),
        }
      );
      if (res.ok) {
        const data = await res.json();/*
        console.log('restCount..', restCount);
        setRestCount(restCount- onceCount);
        console.log('restCount', restCount);*/
        //先减后判断
        if (number.restCount-onceCount <= 0) {
          setShowMore(false);
          console.log(showMore)
        }
        else {
          setNumber({ ...number, restCount: number.restCount - onceCount });
        }
        setPosts((prev) => [...prev, ...data.posts]);
        
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <>
      <h1 className='text-4xl mt-6 font-bold text-center'>Articles</h1>
      <HR></HR>
      
      <div className='flex flex-col justify-center items-center mb-5'>
        <div className='flex flex-wrap gap-5 mt-5 justify-center w-auto'>
          {
            posts && posts.map((post) => 
              <PostCard key={post._id} post={post}/> 
            )
          }
        </div>
      </div>
      {showMore ? (
        <button
          onClick={handleShowMore}
          className='w-full text-teal-500 self-center text-sm py-7'>
              Show more {`(${number.restCount} remaining article${number.restCount>1?'s':''})`}
        </button>
      ) :
        (
          <div className='w-full text-teal-500 text-center text-sm py-7'>Oops! You've reached the end of the universe! :)</div>
        )
         }
    </>
  )
}
