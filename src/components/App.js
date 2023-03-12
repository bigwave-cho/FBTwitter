import { useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
//https://create-react-app.dev/docs/importing-a-component/#absolute-imports
//jsconfig.json에 컴파일러 옵션의 baseUrl을 src로 설정하면
//import시 src부터 찾기 때문에 ../  <- 요거 없애기 가능. (절대경로)

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  // user || null
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
