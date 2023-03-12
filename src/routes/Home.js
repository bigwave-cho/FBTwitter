import { dbService } from 'fbase';
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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(dbService, 'tweets'), {
        text: tweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
      setTweet('');
    } catch (err) {
      console.log(err.message);
    }
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setTweet(value);
  };

  //[FileReader API]
  //https://developer.mozilla.org/ko/docs/Web/API/FileReader
  //https://developer.mozilla.org/en-US/docs/Web/API/FileReader/onload
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0]; //파일을 가져와서
    const reader = new FileReader(); // 리더를 만들고
    reader.onload = (finishedEvent) =>
      setAttachment(finishedEvent.currentTarget.result); // onload되면 콜백실행
    reader.readAsDataURL(theFile); // DataURL로 파일 읽기
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
