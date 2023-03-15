import { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    onAuthStateChanged(authService, async (user) => {
      if (user) {
        if (user.displayName === null) {
          await updateProfile(authService.currentUser, {
            displayName: 'NoName',
          });
        }
        // 방법 1.
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });

        //방법2. 그대로 두고.
        // setUserObj(user);
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []); // userObj 의존성 배열 때문에 무한렌더링 발생 고침.

  const refreshUser = () => {
    const user = authService.currentUser;
    // 방법1.
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });

    // 방법2.
    // Objcet.assign(target, source) // 빈 객체에 source 사본을 할당
    // 리액트가 객체가 변경됐음을 감지하게 됨.
    // setUserObj(Object.assign({}, user));
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
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
