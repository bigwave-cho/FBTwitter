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
        // setUserObj({
        //   displayName: user.displayName,
        //   uid: user.uid,
        //   updateProfile: (args) => user.updateProfile(args),
        // });

        //방법2. 그대로 두고.
        setUserObj(user);
      } else {
      }
      setInit(true);
    });
  }, [userObj]);
  //## 이름 변경해도 Nav가 즉시 렌더링되지 않는 버그를 고쳐보자.
  // 상황 : 리액트가 스테이트의 변경을 감지하지 못하고 있음.
  const refreshUser = () => {
    const user = authService.currentUser;
    // 방법1.
    // setUserObj({
    //   displayName: user.displayName,
    //   uid: user.uid,
    //   updateProfile: (args) => user.updateProfile(args),
    // });

    // 방법2.
    // Objcet.assign(target, source) // 빈 객체에 source 사본을 할당
    // 리액트가 객체가 변경됐음을 감지하게 됨.
    setUserObj(Object.assign({}, user));
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
