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
        <input type="submit" value="tweet" />
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
