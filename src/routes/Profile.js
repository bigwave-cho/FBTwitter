import { authService, dbService } from 'fbase';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

const Profile = ({ userObj }) => {
  // redircet 시키는 방법 2
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
  };
  //https://firebase.google.com/docs/firestore/query-data/get-data?hl=ko
  const getMyTweet = async () => {
    const q = await query(
      collection(dbService, 'tweets'),
      where('creatorId', '==', userObj.uid),
      orderBy('createdAt', 'asc')
    );
    /*
   Uncaught (in promise) FirebaseError: The query requires an index. You can create it here:

  firestore는 noSQL 기반이라서 쿼리를 사용하기 위해서는
  미리 해당하는 인덱스를 생성해놓아야 한다.

  따라서 위 에러의 링크로 접속하면 해당 인덱스를 생성할 수 있다.
  firestore database의 '색인' 탭에서 확인 가능
   */

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  };
  useEffect(() => {
    getMyTweet();
  }, []);
  return (
    <>
      <button onClick={onLogOutClick}>Log out</button>
    </>
  );
};

export default Profile;
