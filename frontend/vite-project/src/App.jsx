import React from 'react';
import Dashboard from './components/Dashboard'
import SendMoney from './components/SendMoney'
import Signin from './components/Signin'
import Signup from './components/Signup'


import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
function App() {
  
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='/send' element={<SendMoney/>}></Route>
        <Route path='/signin' element={<Signin/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

function Main(){
  const nav = useNavigate();
  return (
    <>
      <div>
      <h1 className='font-extrabold text-5xl font-mono ml-28 mt-80'>My Paytm App</h1>
      <div className='flex text-center align-text-bottom mt-28'>
        <button className='border-2 p-3 rounded bg-green-500 text-2xl font-bold ml-28' onClick={()=>{nav('/signin')}}>Sign-in</button>
        <button className='border-2 p-3 rounded bg-green-500 text-2xl font-bold ml-28' onClick={()=>{nav('/signup')}}>Sign-up</button>
      </div>
    </div>
    </>
  )
}
export default App;
