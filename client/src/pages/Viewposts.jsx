/*
// import React from 'react'
// import { Modal, Table, Button } from 'flowbite-react';
// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import PostCard from '../components/PostCard';
// import PostBox from '../components/PostBox';
// import '../../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

// export default function Viewposts() {

//     const tempUser = useSelector((state) => state.user);
//     const currentUser = tempUser.currentUser.rest? tempUser.currentUser.rest : tempUser.currentUser;
// //   const [uncategorizedPosts, setUncategorizedPosts] = useState([]);
// //   const [javascriptPosts, setJavascriptPosts] = useState([]);
// //   const [reactjsPosts, setReactjsPosts] = useState([]);
// //   const [nextjsPosts, setNextjsPosts] = useState([]);
//     const [allPosts, setAllPosts] = useState([]);
//     const [currentPosts, setCurrentPosts] = useState([]);
//     const [postNum, setPostNum] = useState(0);
//     const [indexStart, setIndexStart] = useState(0);
//   // const [showMore, setShowMore] = useState(true);
//   // const [showModal, setShowModal] = useState(false);
//   // console.log(currentUser);

//     useEffect(() => {
//         const fetchAllPosts = async () => {
//             try {
//                 const res = await fetch('/api/post/getposts', {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({ category: 'uncategorized' }),
//                 });
//                 const data = await res.json();
//                 if (res.ok) 
//                 {
//                     console.log(data);
//                     setAllPosts(data.posts);
//                     console.log('allPosts:', allPosts);
//                     setPostNum(allPosts.length);
//                     console.log('postNum:', postNum);
//                     setCurrentPosts((prevPosts) => [
//                         ...prevPosts, 
//                         ...allPosts.slice(indexStart, indexStart + 3 < postNum?(indexStart + 3):postNum)
//                     ]);
//                     setIndexStart(indexStart + 3 < postNum?(indexStart + 3):postNum);
//                     console.log('IS:', indexStart);
//                     console.log('currentPosts', currentPosts);
//                 }
//             }
//             catch (error) {
//                 console.log(error.message);
//             }
//         };
//         fetchAllPosts();
//     }, [currentUser]);

//     return (
//         <div>
//             <div>
//                 <h1 className='text-7xl text-center font-bold' style={{ letterSpacing: '0.1em' }}>Posts</h1>
//                 <hr style={{ margin: '20px 0', border: 'none', borderTop: '2px solid #000' }} />
//                 <h2 className='text-opacity-25 text-sm text-center'>
//                     Here you'l find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages
//                 </h2>
//             </div>
//             <br></br>
//             <div className='flex justify-center'>
//                 <Button className='text-white bg-black'>
//                     View all posts
//                 </Button>
//             </div>
//             <br></br>
//             <div className='flex justify-center'>
//                 <div className='w-4/5 flex rounded-3xl '>
//                     {currentPosts.map((post, index) => (
//                         <div key={index} className="w-1/3 p-4">
//                             <img
//                                 src={post.image}
//                                 alt={post.title}
//                                 className="w-full h-auto object-cover"
//                             />
//                             <h2>{post.title}</h2>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
//     }
*/

import { Button, HR } from 'flowbite-react';
import React from 'react'
import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';

export default function ViewPosts() {
    const onceCount = 3;
    const [showMore, setShowMore] = useState(false);
    const [posts, setPosts] = useState(null);
    const [number, setNumber] = useState({});


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
            <div>
                <h1 className='text-7xl text-center font-bold' style={{ letterSpacing: '0.1em' }}>Posts</h1>
                <hr style={{ margin: '20px 0', border: 'none', borderTop: '2px solid #000' }} />
                <h2 className='text-opacity-25 text-sm text-center'>
                    Here you'l find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages
                </h2>
            </div>
            <br></br>
            {/* <div className='flex justify-center'>
                <Button className='text-white bg-black'>
                    View all posts
                </Button>
            </div> */}
            <div className='flex justify-center'>
                <div className='w-4/5 flex flex-wrap rounded-3xl border-2 shadow-lg'>
                    {posts && posts.map((post, index) => (
                        <div key={index} className="w-1/3 p-4">
                            <Link
                                to={`/post/${post.slug}`}>
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full object-cover h-40 rounded-lg"
                                />
                                <h2 className='text-center font-semibold'>{post.title}</h2>
                            </Link>
                        </div>
                    ))}
                    {showMore ? (
                        <div className='w-full flex justify-center'>
                            <button
                                onClick={handleShowMore}
                                className='w-3/12 text-white self-center text-base bg-green-400 rounded-xl'>
                                    更多<br/>
                                    {/* {`(${number.restCount} remaining article${number.restCount>1?'s':''})`} */}
                            </button>
                        </div>
                        ):
                        (
                        <div className='w-full text-teal-500 text-center text-sm py-7'>Oops! You've reached the end of the universe! :)</div>
                        )
                    }
                </div>
            </div>
            <br></br>
        </>
    )
}
