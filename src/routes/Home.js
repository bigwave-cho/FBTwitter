import { dbService } from 'fbase';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';

const Home = () => {
  const [tweet, setTweet] = useState('');
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRec = await addDoc(collection(dbService, 'tweets'), {
        tweet,
        createdAt: Date.now(),
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
    </div>
  );
};

export default Home;
