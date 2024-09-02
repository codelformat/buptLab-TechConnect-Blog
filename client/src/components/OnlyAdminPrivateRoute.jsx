import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function OnlyAdminPrivateRoute() {
  const tempUser = useSelector((state) => state.user);
  const error = tempUser.error;
  console.log(tempUser);
  const currentUser = tempUser.currentUser.rest? tempUser.currentUser.rest : tempUser.currentUser;
  console.log(currentUser);
  //const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to='/sign-in' />
  );
}
