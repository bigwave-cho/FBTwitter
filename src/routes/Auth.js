import { authService } from 'fbase';
import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);

  const onChange = (event) => {
    // sign with email... 에 관한 doc
    //https://firebase.google.com/docs/reference/js/auth.auth?hl=ko

    // persistence에 대한 doc (로그인 지속)
    //https://firebase.google.com/docs/auth/web/auth-state-persistence?hl=ko
    //default는 local이며 브라우저를 꺼도 지속되므로 직접 로그아웃 절차를 거쳐야 함.

    // ## 로그인 여부는 애플리케이션 -> indexDB -> firebaseLocalStorageDb에서 확인
    const {
      target: { name, value },
    } = event;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      let data;
      if (newAccount) {
        // create new one
        data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
      } else {
        //Log in
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? 'Create Account' : 'Log in'} />
      </form>
      <div>
        <button>Continue with Google</button>
        <button>Continue with Github</button>
      </div>
    </div>
  );
};

export default Auth;
