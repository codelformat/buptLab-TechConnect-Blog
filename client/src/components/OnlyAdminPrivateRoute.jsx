import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function OnlyAdminPrivateRoute() {
  // const { currentUser } = useSelector((state) => state.user);
  const tempUser = useSelector((state) => state.user);
  const currentUser = tempUser.currentUser.rest? tempUser.currentUser.rest : tempUser.currentUser;
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to='/sign-in' />
  );
}
