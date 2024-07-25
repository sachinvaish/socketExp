import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {socket }from './socket.js';

function App() {
  // const socket = useMemo(()=>io('http://localhost:3000'));
  const [user,setUser]=useState('');
  const [room,setRoom]=useState('');
  const [socketID, setSocketID]= useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  console.log(chat);

  const handleMessage=(e)=>{
    e.preventDefault();
    if(message!=''){
      socket.emit('receive-message',{message, room, user});
    }
    setMessage('')
  }

  if(!user){
    setUser(prompt('Please Enter your Name'));
  }

  useEffect(()=>{
    socket.on('connect',()=>{
      setSocketID(socket.id);
      console.log('Socket connected , ID : ', socket.id)
    })
    socket.on('server-message',(data)=>{
      console.log(data);
    })
    socket.on('chat',(m)=>{
      setChat((chat)=>[...chat,m]);
    })

    return (()=>socket.disconnect())
  },[]);

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        SOCKET IO experiments
      </h1>
      <h3>Username : {socketID}</h3>
      <form className=' mt-10' onSubmit={handleMessage}>
        <label htmlFor="message">Message : </label>
        <input type="text" name='message' onChange={(e)=>setMessage(e.target.value)} value={message} className=' border-2' /> 
        <br/>
        <label htmlFor="message">Send TO : </label>
        <input type="text" name='room' onChange={(e)=>setRoom(e.target.value)} value={room} className=' border-2' />
        
        <br/>
        <button type='submit' className=' border-solid px-5 bg-red-400 box-border'>Send Message</button>
      </form>
       <div className=' w-[70vw] min-h-[50vh] text-left p-10 bg-gray-300 ml-auto mr-auto'>
          {chat.map((m,i)=>{
            // console.log(chat);
            // console.log(m);
            return(
              <div key={i}>{m.user} sent : {m.message}</div>
            )
          })}
       </div>
    </>
  )
}

export default App
