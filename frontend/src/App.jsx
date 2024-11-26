import LoginFormPage from "./components/LoginFormPage/LoginFormPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import * as sessionActions from "./store/session";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SignUpFormPage from "./components/SignUpFormPage/SignUpFormPage";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
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
        element: <h1>Welcome</h1>
      },
      {
        path: '/login',
        element: <LoginFormPage />
      },
      {
        path: '/signup',
        element: <SignUpFormPage />
      }
    ]
      
  }
  
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;