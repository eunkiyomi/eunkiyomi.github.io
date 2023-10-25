
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
  { text: '인사하는 손짓', emoji: '👋🙋‍♀️' },
  { text: '자전거 벨소리 땡땡', emoji: '🛎️' },
  { text: '어깨를 툭툭 치기', emoji: '🤚' },
  { text: '이름을 부르기', emoji: '🏷️' },
  { text: '건배하기 짠', emoji: '🍻🥂' }
];

// Get the elements
const messageBox = document.getElementById('messageBox');
const nicknameInput = document.getElementById('nicknameInput');
const greetingSelect = document.getElementById('greetingSelect');
const sendButton = document.getElementById('sendButton');

// Populate the select box
greetings.forEach(greeting => {
  const option = document.createElement('option');
  option.text = greeting.text;
  option.value = greeting.text + ' ' + greeting.emoji;
  greetingSelect.add(option);
});

// Set initial button label
sendButton.textContent = greetings[0].emoji; // Set the button label to the emoji of the first greeting

// Update the send button label when the selected greeting changes
greetingSelect.addEventListener('change', () => {
  sendButton.textContent = greetingSelect.options[greetingSelect.selectedIndex].value.split(' ').pop();
});


class GreetingController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.sendButton.addEventListener('click', () => this.addGreeting());
    this.view.prevButton.addEventListener('click', () => this.prevPage());
    this.view.nextButton.addEventListener('click', () => this.nextPage());

    this.model.subscribe(() => this.view.render(this.model));
    this.view.render(this.model);
  }

  addGreeting() {
    const nickname = this.view.nicknameInput.value;
    const greeting = this.view.greetingSelect.value;
    this.model.addGreeting(`${nickname}(이)가 ${greeting}을 했다.`);
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
}

class GreetingModel {
  constructor() {
    this.greetings = [];
    this.currentPage = 0;
    this.messagesPerPage = 15;
    this.subscribers = [];

    // Load the greetings from Firestore
    db.collection("greetings").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const greeting = doc.data();
        this.greetings.push(greeting.text);
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

  addGreeting(greeting) {
    this.greetings.push(greeting);
    if (this.greetings.length % this.messagesPerPage === 1 && this.greetings.length > 1) {
      this.currentPage++;
    }
    this.notifySubscribers();

    // Add the greeting to Firestore
    db.collection("greetings").add({
      text: greeting
    })
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

  render(model) {
    // Clear the message box
    this.messageBox.innerHTML = '';

    // Add messages for the current page
    const start = model.currentPage * model.messagesPerPage;
    const end = start + model.messagesPerPage;
    model.greetings.slice(start, end).forEach(greetingText => {
      const message = document.createElement('p');
      message.textContent = greetingText;
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





