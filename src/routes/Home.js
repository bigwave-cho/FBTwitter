import { dbService, storageService } from 'fbase';
import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import Tweet from 'components/Tweet';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
// npm install uuid 식별자 랜던 생성

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState();

  const getTweets = async () => {
    const dbTweets = await getDocs(collection(dbService, 'tweets'));
    dbTweets.forEach((doc) => {
      const tweetObj = { ...doc.data(), id: doc.id };
      setTweets((prev) => [tweetObj, ...prev]);
    });
  };

  useEffect(() => {
    getTweets();
    const q = query(collection(dbService, 'tweets'), orderBy('createdAt'));
    onSnapshot(q, (snapshot) => {
      // forEach 보다 효율적.
      const tweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArray);
    });
  }, []);

  //https://firebase.google.com/docs/storage/web/upload-files?hl=ko
  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = '';
    if (attachment !== '') {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      //ref(db, child)  child로 폴더 & ID 설정

      await uploadString(attachmentRef, attachment, 'data_url');

      attachmentUrl = await getDownloadURL(attachmentRef); // fileURL 반환
    }
    const newTweet = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, 'tweets'), newTweet);
    setTweet('');
    setAttachment('');
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setTweet(value);
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onload = (finishedEvent) =>
      setAttachment(finishedEvent.currentTarget.result);
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment(null);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="What' on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="tweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height={50} alt="img" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
