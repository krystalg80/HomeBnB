import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation/Navigation';
import LandingPage from './components/LandingPage/LandingPage';
import SpotDetails from './components/SpotDetails/SpotDetails';
import CreateSpot from './components/CreateSpot/CreateSpot';
import ManageSpots from './components/ManageSpots/ManageSpots';
import UpdateSpot from './components/UpdateSpot/UpdateSpot';


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/spots/:spotId', // Route for SpotDetails page
        element: <SpotDetails /> // Render SpotDetails component for a specific spot
      },
      {
        path: '/create-spot', // Route for CreateSpot page
        element: <CreateSpot /> // Render CreateSpot component
      },
      {
        path: '/manage-spots', // Route for ManageSpots page
        element: <ManageSpots />, 
        children: [
          {
            path: 'edit/:spotId',
            element: <UpdateSpot />
          }
        ]
      },
     
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
