// /client/src/pages/PostPage.jsx
import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect,useState } from 'react';
import { Spinner,Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';


export default function PostPage()
{
  const { postslug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const recentPostsCount = 3;
  const fetchPost = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/post/getpostBySlug', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: postslug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUserProperties(true);
        setLoading(false);
        return;
      }
      else {
        setPost(data);
        //console.log("post:",post);
        setLoading(false);
        setError(false);
      }
    } catch (eror) {
      setError(true);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPost();
  }, [postslug]);

  //console.log("Post slug is", postslug);
  useEffect(() => {
    console.log('Post Page useEffect');
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch('/api/post/getposts',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },  
          body: JSON.stringify({ limit: recentPostsCount+1 }),
        });
        //const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        console.log('recent posts', data.posts);
        if (res.ok) {
          console.log('data:')
          console.log(data)
          let samePost = data.posts.find(post => post.slug === postslug);
          if (samePost) {
            //如果有相同的文章，则去除此文章
            setRecentPosts(data.posts.filter(post => post.slug !== postslug));
          }
          else {
            setRecentPosts(data.posts.slice(0,recentPostsCount));
          }
          
        }
        else{
          console.log('res is not ok! ',data.message);
        }
      }
      
      fetchRecentPosts();
    }
    catch (error) {
      console.log(error.message);
    }
  },[])
  if (loading) return (<div className='flex justify-center items-center min-h-screen'>
    <Spinner size='xl'/>
  </div>);
  if(!post) return <h1 className='text-3xl text-center p-10 font-serif m-5  '>Post Not Found.</h1>
  
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      

      <img src={post&& post.image} alt={post && post.title} className='mt=18 p-3 max-h-[600px] w-full  object-cover'/>
      
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>Created at: {post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>{post && (post.content.length / 1000).toFixed(0)} mins to read</span>
      </div>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post && post.title}
      </h1>
      <Link className='self-center mt-5' to={`/search?category=${post &&post.category}`}>
        <Button color='gray' pill size='xs'>
          {post&& post.category}
        </Button>
      </Link>
      <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html:post&& post.content}}>
      </div>
      <CommentSection postId={post._id} />
      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center w-auto'>
          {
            recentPosts && recentPosts.map((post) => 
              <PostCard key={post._id} post={post}/> 
            )
          }
        </div>
      </div>
    </main>
    
  )
}
