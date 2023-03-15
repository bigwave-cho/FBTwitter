import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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

export const dbService = getFirestore(app);

export const storageService = getStorage();

/*
## deploy 후 구글이나 깃헙 Auth가 작동하지 않을 때.
해결 : 파이어베이스 허용 도메인에 해당 디플로이 도메인을 추가해주면 됨.

## firestorage rules 설정

공식문서 참고. 

https://firebase.google.com/docs/firestore/security/get-started?hl=ko
https://firebase.google.com/docs/rules/rules-language?hl=ko

- 기존 테스트 규칙
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if
          request.time < timestamp.date(2023, 4, 11); // 해당 날짜까지만 유효
    }
  }
}

- 수정
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if
          request.time < timestamp.date(2023, 4, 11);
    }
  }
}

## API Key 설정
https://console.cloud.google.com/apis/credentials

해당 API key에 들어가서 애플리케이션 제한사항 설정

허용할 앱 (웹사이트) 선택

ADD 
디플로이한 도메인 && localhost &&  해당하는 firebase 도메인 추가.


## Firebase Functions
execute serverless backend code
커스텀한 백엔드 코드를 실행시키는 기능
*/
