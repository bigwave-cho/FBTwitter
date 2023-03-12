import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const authService = getAuth(app);

/*
firebase Sign-in method 설정
Authentification -> 로그인제공업체 -> 이메일비밀번호

## 구글 걍 지원이메일 넣고 추가하면 됨.(웹SDK 자동 추가 됨)

## Github 
깃헙 세팅 -> 디벨로퍼 세팅 ->  OAuth Apps 
앱 이름 입력 -> URl은 파이어베이스에 있는 .com 까지 입력
콜백 url은 /__/auth/handler 까지 입력.

클라이언트 ID와 클라이언트 시크릿을 파이어베이스에 설정
*/
