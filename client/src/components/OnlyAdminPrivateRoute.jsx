import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function OnlyAdminPrivateRoute() {
  // const { currentUser } = useSelector((state) => state.user);
  let currentUser = null;
  const tempUser = useSelector((state) => state.user);
  if (tempUser.currentUser){
    currentUser = tempUser.currentUser.rest? tempUser.currentUser.rest : tempUser.currentUser;
  } else{
    currentUser = null
  }
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to='/sign-in' />
  );
}
