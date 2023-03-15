import { authService, dbService } from 'fbase';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
const Profile = ({ userObj, refreshUser }) => {
  // redircet 시키는 방법 2
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
  };

  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const getMyTweet = async () => {
    const q = await query(
      collection(dbService, 'tweets'),
      where('creatorId', '==', userObj.uid),
      orderBy('createdAt', 'asc')
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
    });
  };
  useEffect(() => {
    getMyTweet();
  }, []);

  const onChange = (e) => {
    setNewDisplayName(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    //https://firebase.google.com/docs/auth/web/manage-users?hl=ko
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
    }
    refreshUser();
  };
  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <input
          className="formInput"
          autoFocus
          onChange={onChange}
          type="text"
          placeholder="Display Name"
          value={newDisplayName}
        />
        <input
          type="submit"
          value={'Update Profile'}
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
