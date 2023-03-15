import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { dbService, storageService } from 'fbase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TweetFactory = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [attachment, setAttachment] = useState();
  //https://firebase.google.com/docs/storage/web/upload-files?hl=ko
  const onSubmit = async (e) => {
    if (tweet === '') return;
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
  const onClearAttachment = () => setAttachment('');
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="What' on your mind?"
          maxLength={120}
        />
        <input type="submit" value="tweet" className="factoryInput__arrow" />
      </div>
      <label for="attach-file" className="factoryInput__label">
        Add Photos
        <FontAwesomeIcon style={{ marginLeft: '10' }} icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />

      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
            width="50px"
            height={50}
            alt="img"
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default TweetFactory;
