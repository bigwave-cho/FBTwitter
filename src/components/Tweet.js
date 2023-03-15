import { dbService, storageService } from 'fbase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { deleteObject, ref } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
const Tweet = ({ tweetObj, isOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  //https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ko
  const toggleEditing = () => setIsEditing((prev) => !prev);
  const onSubmit = async (e) => {
    e.preventDefault();
    const tweetRef = doc(dbService, 'tweets', tweetObj.id);
    await updateDoc(tweetRef, {
      text: newTweet,
    });
    setIsEditing(false);
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewTweet(value);
  };
  //삭제 // docu + file 삭제
  //https://firebase.google.com/docs/storage/web/delete-files?hl=ko
  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this tweet?');
    if (ok) {
      try {
        const tweetRef = doc(dbService, 'tweets', tweetObj.id);
        await deleteDoc(tweetRef);
        const fileRef = ref(storageService, tweetObj.attachmentUrl);
        if (tweetObj.attachmentUrl !== '') {
          await deleteObject(fileRef);
        }
      } catch (err) {
        console.log('실패');
      }
    }
  };
  return (
    <div className="nweet">
      {isEditing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placeholder="Edit your tweet"
              value={newTweet}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="update tweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{newTweet}</h4>
          {tweetObj.attachmentUrl && (
            <img src={tweetObj.attachmentUrl} alt="img" />
          )}
          {isOwner && (
            <>
              <span onClick={onDeleteClick} className="nweet__actions">
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing} className="nweet__actions2">
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
