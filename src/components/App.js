import { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    //https://firebase.google.com/docs/auth/web/manage-users?hl=ko
    //onAuthStateChagned : auth 상태 확인 메서드
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : 'Initializing...'}
      <footer>&copy; {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
