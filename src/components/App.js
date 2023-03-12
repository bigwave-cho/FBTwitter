import { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setUserObj(user);
      } else {
      }
      setInit(true);
    });
  }, [userObj]);

  return (
    <>
      {init ? (
        <AppRouter
          //userObj === obj || null 이니까
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        'Initializing...'
      )}
      <footer>&copy; {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
