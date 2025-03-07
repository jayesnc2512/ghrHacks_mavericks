import React, { useState } from 'react';
import MainPage from './MainPage';
import Login from './Login';


const App = () => {
    const [login, setLogin] = useState(false);
    const [user, setUser] = useState({});


  return (
      <div>
          {login ?
              <MainPage setLogin={setLogin} user={user} setUser={setUser} />
              :
              <Login setLogin={setLogin} setUser={setUser} user={user} />
          }
      </div>
  )
}

export default App
