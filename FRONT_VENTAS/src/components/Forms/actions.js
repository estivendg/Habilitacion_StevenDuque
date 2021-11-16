import { firebasegeneral } from "../../firebase";



export const SaveDataUser = (user, callback, SaveUser) => {
  var refStorage = firebasegeneral.storage().ref();
  var uploadTask = refStorage
    .child(`images/${user.file.name}`)
    .put(user.file.originFileObj);

  uploadTask.on(
    "state_changed",
    function(snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log("Upload is " + progress + "% done");
      callback(progress);
    },
    function(error) {
      // Handle unsuccessful uploads
    },
    function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        // console.log("File available at", downloadURL);
        user.file = downloadURL;
        
        SaveUser(user);
      });
    }
  );
};
