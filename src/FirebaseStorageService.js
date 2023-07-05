import firebase from "./FirebaseConfig";

const storageRef = firebase.storage().ref();
const uploadFile = (file, fullFilePath, progressCallback) => {
  const uploadTask = storageRef.child(fullFilePath).put(file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      progressCallback(progress);
    },
    (error) => {
      throw error;
    }
  );

  return uploadTask.then(async () => {
    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
    return downloadURL;
  });
};

const deleteFile = (fileDownloadURL) => {
  const decodedURL = decodeURIComponent(fileDownloadURL);
  const startIndex = decodedURL.indexOf("/o/" + 3);
  const endIndex = decodedURL.indexOf("?");
  const filePath = decodedURL.substring(startIndex, endIndex);
  return storageRef.child(filePath).delete();
};

const FirebaseStorageService = {
  uploadFile,
  deleteFile,
};

export default FirebaseStorageService;
