import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom"

import NotFound from './page/notFound';

// Layouts
import RootLayout from './layout/rootLayout';
import ServerLayout from './layout/serverLayout';


// Pages
import Channel from './page/channel';
import Login from './page/login';
import Signup from './page/signup';
import FormServer from './page/formServer';
import Home from './page/home';
import Profil from './page/profil';

import {ProtectedRoute} from './hooks/useProtectedRoute'; // hooks pour protéger les routes


// Contexte 
import { AuthContextProvider } from './context/AuthContext';
import { ServerContextProvider } from './context/ServerContext';


const router = createBrowserRouter(
  createRoutesFromElements(
  <Route path='/' element={<RootLayout/>}>
    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Signup/>}/>
    <Route path="/form-server" element={<ProtectedRoute><FormServer/></ProtectedRoute>} />
    <Route path='/server' element={<ProtectedRoute><Home/></ProtectedRoute>} />
    <Route path='/profil/:username' element={<ProtectedRoute><Profil/></ProtectedRoute>} />

    <Route path='/server/:serverName' element={<ProtectedRoute><ServerLayout/></ProtectedRoute>} > {/* C'est l'intérieur du server (Les channels) */}
      <Route path='channel/:channelName' element={<ProtectedRoute><Channel/></ProtectedRoute>} /> {/* C'est l'intérieur du channel (Le chat)  */}
    </Route>

    <Route path="*" element={<NotFound/>}/>
  </Route>
))


function App() {
  return (
    <AuthContextProvider>
      <ServerContextProvider>
      <RouterProvider router={router} />
      </ServerContextProvider>
    </AuthContextProvider>
  )
}

export default App
