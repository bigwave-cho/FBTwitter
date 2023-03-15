import { authService } from 'fbase';
import {
  GithubAuthProvider,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import AuthForm from 'components/AuthForm';

const Auth = () => {
  //https://firebase.google.com/docs/auth/web/google-signin?hl=ko
  const onSocialClick = async (event) => {
    let provider;
    const {
      target: { name },
    } = event;

    if (name === 'google') {
      provider = new GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);
    console.log(data);
  };

  return (
    <div>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name="google">
          Continue with Google
        </button>
        <button onClick={onSocialClick} name="github">
          Continue with Github
        </button>
      </div>
    </div>
  );
};

export default Auth;
