import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {
  createHashRouter, RouterProvider
} from 'react-router-dom'
import Register from './childs/register/register'
import Login from './childs/login/login'
import UserProfile from './childs/profile/profile'

const route = createHashRouter([
  {path: '/', element: <App />, children: [
    {path: '/register', element: <Register />},
    {path: '/login', element: <Login />},
    {path: '/profile', element: <UserProfile />},
  ]}
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={route} />
)
