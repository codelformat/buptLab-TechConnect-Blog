// /client/src/components/PostCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function PostBox({posts}) {
    // 确保 posts 是一个数组，并且至少有一个元素
    if (!Array.isArray(posts) || posts.length === 0) {
        return <div>No posts available</div>;
    }
    const leftPost = posts[0];
    const rightPost = posts.slice(1,7);

    return (
        <div className='flex flex-wrap'>
            <div className='w-1/3 h-full flex-wrap  hover:border-2 overflow-hidden rounded-lg transition-all'>
                <Link to={`/post/${leftPost.slug}`} >
                    <img src={leftPost.image} 
                        alt='post cover' 
                        // className='rounded-2xl h-full w-full object-cover group-hover:h-[80%] transition-all duration-300 z-20'
                        className='rounded-3xl h-full w-full object-cover group-hover:h-4/5 transition-all duration-100 z-20'
                    /> 
                </Link>
            </div>
            <div className='w-2/3 h-full flex flex-wrap'>
                {rightPost.map((post, index) => (
                    <div key={index} className='w-1/3 px-0.5 py-1 flex-wrap  hover:border-2 overflow-hidden rounded-lg transition-all'>
                        <Link to={`/post/${post.slug}`} >
                            <img src={post.image} 
                                alt='post cover' 
                                className='rounded-3xl h-full w-full object-cover group-hover:h-4/5 transition-all duration-100 z-20'
                                // className='rounded-2xl w-full h-full object-cover'
                            /> 
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
