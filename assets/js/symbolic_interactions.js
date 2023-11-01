
const firebaseConfig = {
  apiKey: "AIzaSyDRdY2DtGfkuAbfGOg3Imu6gEe18PsW3dI",
  authDomain: "personal-395509.firebaseapp.com",
  projectId: "personal-395509",
  storageBucket: "personal-395509.appspot.com",
  messagingSenderId: "369762369220",
  appId: "1:369762369220:web:a51071ee8b50fa6ebf1391",
  measurementId: "G-LSJVHZ48J4"
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the Firestore service
const db = firebase.firestore();

// Define the greetings
const greetings = [
  "인사하는 손짓을 했다 👋🙋‍♀️",
  "자전거 벨을 땡땡 울렸다 🛎️",
  "어깨를 툭툭 쳤다 🤚",
  "이름을 불렀다 🏷️",
  "건배를 짠 했다 🍻🥂",
  "직접 쓰기 ...", 
];

// Get the elements
const greetingSelect = document.getElementById('greetingSelect');

// Populate the select box
greetings.forEach(greeting => {
  const option = document.createElement('option');
  option.text = greeting;
  option.value = greeting;
  greetingSelect.add(option);
});

class GreetingController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.sendButton.addEventListener('click', () => this.addGreeting());
    this.view.prevButton.addEventListener('click', () => this.prevPage());
    this.view.nextButton.addEventListener('click', () => this.nextPage());
    this.view.greetingSelect.addEventListener('change', () => this.selectGreeting());

    this.model.subscribe(() => this.view.render(this.model));
    this.view.render(this.model);
  }

  addGreeting() {
    const nickname = this.view.nicknameInput.value;
    let text;
    if (greetingSelect.value === '직접 쓰기 ...') {
      text = `${this.view.greetingTextInput.value} ${this.view.greetingEmojiInput.value}`;
    } else {
      text = this.view.greetingSelect.value;
    }
    this.model.addGreeting(nickname, text);
  }

  prevPage() {
    if (this.model.currentPage > 0) {
      this.model.setPage(this.model.currentPage - 1);
    }
  }

  nextPage() {
    if ((this.model.currentPage + 1) * this.model.messagesPerPage < this.model.greetings.length) {
      this.model.setPage(this.model.currentPage + 1);
    }
  }

  selectGreeting() {
    if (this.view.greetingSelect.value === '직접 쓰기 ...') {
      this.view.setCustomGreetingMode(true);
    } else {
      this.view.setCustomGreetingMode(false);
    }
  }
}

class GreetingModel {
  constructor() {
    /**
     * The greetings array will hold objects.
     * Each object represents a greeting and has two properties:
     * - actor: the name of the social actor who made the greeting
     * - text: a string with an emoji describing the greeting
     * @type {Array<{actor: string, text: string}>}
     */
    this.greetings = [];
    this.currentPage = 0;
    this.messagesPerPage = 15;
    this.subscribers = [];

    // Load the greetings from Firestore
    db.collection("greetings").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const greeting = doc.data();
        this.greetings.push(greeting);
      });
      this.notifySubscribers();
    });
  }

  subscribe(observerFunction) {
    this.subscribers.push(observerFunction);
  }

  notifySubscribers() {
    this.subscribers.forEach(observerFunction => observerFunction(this));
  }

  /**
   * Creates a new greeting object and adds it to the greetings array.
   * The Firestore database is also updated.
   * @param {string} nickname - The name of the person who is greeting.
   * @param {string} greeting - The type of greeting.
   */
  addGreeting(nickname, text) {
    const greetingObj = { nickname, text };

    this.greetings.push(greetingObj);
    if (this.greetings.length % this.messagesPerPage === 1 && this.greetings.length > 1) {
      this.currentPage++;
    }
    this.notifySubscribers();

    // Add the greeting to Firestore
    db.collection("greetings").add(greetingObj)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  setPage(page) {
    this.currentPage = page;
    this.notifySubscribers();
  }
}

class GreetingView {
  constructor() {
    this.messageBox = document.getElementById('messageBox');
    this.nicknameInput = document.getElementById('nicknameInput');
    this.nicknameParticle = document.getElementById('nicknameParticle');
    
    this.customGreetingDiv = document.getElementById('customGreetingDiv');
    this.greetingTextInput = document.getElementById('greetingTextInput');
    this.greetingEmojiInput = document.getElementById('greetingEmojiInput');
    
    this.greetingSelect = document.getElementById('greetingSelect');

    this.sendButton = document.getElementById('sendButton');
    this.prevButton = document.getElementById('prevButton');
    this.nextButton = document.getElementById('nextButton');
    this.pageLabel = document.getElementById('pageLabel');
  }

  arrange(message) {
    const x = Math.floor(Math.random() * this.messageBox.offsetWidth);
    const y = Math.floor(Math.random() * this.messageBox.offsetHeight);
    message.style.position = 'absolute';
    message.style.left = `${x}px`;
    message.style.top = `${y}px`;
  }

  setCustomGreetingMode(mode) {
    if (mode) {
      this.customGreetingDiv.style.display = 'inline';
      this.greetingSelect.style.display = 'none';
    } else {
      this.customGreetingDiv.style.display = 'none';
      this.greetingSelect.style.display = 'inline';
    }
  }

  _chooseParticle(hangul) {
    // Get the last character of the nickname
    const lastChar = hangul[hangul.length - 1];
  
    // Get the Unicode of the last character
    const lastCharUnicode = lastChar.charCodeAt(0);
  
    // Check if the last character is Hangul
    if (lastCharUnicode >= 0xAC00 && lastCharUnicode <= 0xD7A3) {
      // Calculate the index of the last character within the Hangul block
      const index = lastCharUnicode - 0xAC00;
  
      // Calculate the final (jongseong) consonant
      const finalConsonant = index % 28;
  
      // If there is a final consonant, use "이". Otherwise, use "가".
      return finalConsonant !== 0 ? "이" : "가";
    }
  
    // If the last character is not Hangul, use "이" as a default
    return "(이)가";
  }

  render(model) {
    // Clear the message box
    this.messageBox.innerHTML = '';

    // Add messages for the current page
    const start = model.currentPage * model.messagesPerPage;
    const end = start + model.messagesPerPage;
    model.greetings.slice(start, end).forEach(greeting => {
      const message = document.createElement('p');
      message.textContent = `${greeting.nickname}${this._chooseParticle(greeting.nickname)} ${greeting.text}`;
      this.messageBox.appendChild(message);
      this.arrange(message);
    });

    // Update the page label
    const totalPages = Math.ceil(model.greetings.length / model.messagesPerPage);
    this.pageLabel.textContent = `Page ${model.currentPage + 1} of ${totalPages}`;
  }
}

const model = new GreetingModel();
const view = new GreetingView();
const controller = new GreetingController(model, view);





