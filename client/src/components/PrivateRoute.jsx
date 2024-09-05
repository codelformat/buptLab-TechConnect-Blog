// /client/src/PrivateRoute.jsx
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  // const { currentUser } = useSelector((state) => state.user);
  const tempUser = useSelector((state) => state.user);
  console.log(tempUser);
  var currentUser;
  if (tempUser.currentUser) {
    currentUser = tempUser.currentUser.rest? tempUser.currentUser.rest : tempUser.currentUser;
  } else {
    currentUser = null;
  }
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
}
