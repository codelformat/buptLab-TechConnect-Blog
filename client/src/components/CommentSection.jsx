import { Button, HR, Modal, Textarea } from 'flowbite-react';
import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Alert } from 'flowbite-react';
export default function CommentSection({postId}) {
  const maxCommentLength = 500;
  const tempUser = useSelector((state) => state.user);
  //console.log(tempUser);
  const currentUser = tempUser.currentUser?(tempUser.currentUser.rest? tempUser.currentUser.rest : tempUser.currentUser):null;

  
  //console.log(currentUser);
  const [writingComment, setWritingComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      useNavigate()('/sign-in');
      return;
    }
    if (writingComment === '') {
      return;
    }
    if (writingComment.length > maxCommentLength) {
      return;
    }
    //console.log('handle submit')
    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: writingComment, postId, userId: currentUser._id, }),
      });
      const data = await res.json();
      //console.log('fetch create comment res',res)
      if (res.ok) {
        setWritingComment('');
        setCommentError(null);
        setComments([data, ...comments]);
      }
    }
    catch (error) {
      setCommentError(error.message);
    }
    
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      }
      catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId])
  const handleLike = async (commentId) => {
    //console.log(commentId);
    try {
      if (!currentUser) {
        useNavigate()('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser._id,
        })
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.map((comment) => {
          if (comment._id === commentId) {
            return ({ ...comment, likes: data.likes, numberOfLikes: data.likes.length });
          }
          else {
            return comment;
          }
        }))
      }
      else {
        
      }
    }
    catch (error) {
      console.log(error.message)
    }
  }
  const handleEdit = async (comment, editedContent) => {
    setComments(comments.map((c) => {
      if (c._id === comment.id) {
        return ({ ...c, content: editedContent });
      }
      else {
        return c;
      }
    }))
  }
  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        useNavigate()('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, { method: 'DELETE', });
      if (res.ok) {
        //const data = await res.json();
        setComments(comments.filter((comment) => { comment._id !== commentId }));
      }
    }
    catch (error) {
      consolo.log(error.message);
    }
  };

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      <HR></HR>
      {currentUser ? (
        <div className="flex item-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img className='h-5 w-5 object-cover rounded-full' src={`${currentUser.profilePicture}`} alt="avatar" />
          <Link className ='text-xs text-cyan-600 hover:underline' to={'/dashboard?tab=profile'}>
            @{currentUser.username}
          </Link>
        </div>
      ) :
      (<div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
         <Link className='text-blue-500 hover:underline' to ={'/sign-in'}>Sign In</Link> 
        </div>)}
      {currentUser && (
        <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
          <Textarea placeholder='Write your comment...'
            rows='4'
            maxLength={`${maxCommentLength}`}
            onChange={e=>setWritingComment(e.target.value) } value={writingComment}
          />
          <div className='flex justify-between items-center mt-5'>
            <p className='text-gray-500 text-sm'>
              {maxCommentLength-writingComment.length} characters reamaining
            </p>
            <Button outline gradientDuoTone='purpleToBlue'
            type='submit'>
              Submit
            </Button>
          </div>
          {commentError &&
            <Alert color='failure' className='mt-5'>{commentError}</Alert>
          }
        </form>
        
      )}
      <HR></HR>
      {comments.length === 0 ?
        (<p className='text-sm my-5'>No comments yet.</p>) :
        (<>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>
              Comments
            </p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
              <p>{comments.length}</p>
            </div>
          </div>
          {
            comments.map((comment) => 
              <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={(commentId) => { setShowModal(true); setCommentToDelete(commentId)}} />
            )
          }
          </>
        )
      }
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure to delete the comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={() => handleDelete(commentToDelete)}>
                Yes
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>

      </Modal>
    </div>
  )
}
