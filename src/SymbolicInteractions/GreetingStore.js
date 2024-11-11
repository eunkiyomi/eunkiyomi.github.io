export default class Store {
  // Initialize Firebase
  _firebaseConfig = {
    apiKey: "AIzaSyDRdY2DtGfkuAbfGOg3Imu6gEe18PsW3dI",
    authDomain: "personal-395509.firebaseapp.com",
    projectId: "personal-395509",
    storageBucket: "personal-395509.appspot.com",
    messagingSenderId: "369762369220",
    appId: "1:369762369220:web:a51071ee8b50fa6ebf1391",
    measurementId: "G-LSJVHZ48J4"
  };

  constructor() {
    firebase.initializeApp(this._firebaseConfig);
    this._db = firebase.firestore(); 
  }

  async addGreeting(greetingObj) {
    // Add the greeting to Firestore
    return this._db.collection("greetings").add(greetingObj)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  /**
   * Gets the greetings from Firestore.
   * @returns {Array} An array of greeting objects.
   */
  async getGreetings() {
    // Get the greetings from Firestore
    const greetings = [];
    try {
      const querySnapshot = await this._db.collection("greetings").get();
      querySnapshot.forEach((doc) => {
        greetings.push(doc.data());
      });
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
    return greetings;
  }
}