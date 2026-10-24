
const firebaseConfig = {
  apiKey: "AIzaSyDRdY2DtGfkuAbfGOg3Imu6gEe18PsW3dI",
  authDomain: "personal-395509.firebaseapp.com",
  projectId: "personal-395509",
  storageBucket: "personal-395509.appspot.com",
  messagingSenderId: "369762369220",
  appId: "1:369762369220:web:a51071ee8b50fa6ebf1391",
  measurementId: "G-LSJVHZ48J4"
};

// Greetings are read and written through the Firestore REST API, because it
// returns each document's createTime (the web SDK does not), so even the oldest
// greetings get a date without changing any stored data.
const FIRESTORE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;
const KEY = `key=${firebaseConfig.apiKey}`;

// Visiting the page with ?admin shows a Google sign-in. Firestore rules decide
// who may actually hide a greeting; the page only offers the buttons.
const ADMIN_MODE = new URLSearchParams(location.search).has("admin");

// Define the greetings
const greetings = [
  "Made a greeting gesture 👋🙋‍♀️",
  "Rang the bicycle bell ding-ding 🛎️",
  "Tapped on the shoulder lightly 🤚",
  "Called the name 🏷️",
  "Clinked glasses 🍻🥂",
  "Manual Input...",
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

/** Turns a REST document into {id, nickname, text, hidden, createdAt}. */
function fromDoc(doc) {
  const f = doc.fields || {};
  return {
    id: doc.name.split('/').pop(),
    nickname: f.nickname ? f.nickname.stringValue : '',
    text: f.text ? f.text.stringValue : '',
    hidden: f.hidden ? f.hidden.booleanValue === true : false,
    createdAt: new Date(doc.createTime),
  };
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

class GreetingController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.sendButton.addEventListener('click', () => this.addGreeting());
    this.view.prevButton.addEventListener('click', () => this.prevPage());
    this.view.nextButton.addEventListener('click', () => this.nextPage());
    this.view.greetingSelect.addEventListener('change', () => this.selectGreeting());
    this.view.onToggleHidden = (greeting) => this.toggleHidden(greeting);

    this.model.subscribe(() => this.view.render(this.model));
    this.view.render(this.model);

    if (ADMIN_MODE) this.startAdmin();
  }

  async addGreeting() {
    const nickname = this.view.nicknameInput.value.trim();
    let text;
    if (greetingSelect.value === 'Manual Input...') {
      text = `${this.view.greetingTextInput.value} ${this.view.greetingEmojiInput.value}`.trim();
    } else {
      text = this.view.greetingSelect.value;
    }
    if (!nickname) return this.view.setStatus('Write a nickname first.');
    if (!text) return this.view.setStatus('Write a greeting first.');

    this.view.setSending(true);
    this.view.setStatus('');
    try {
      await this.model.addGreeting(nickname, text);
      this.view.clearForm();
      this.view.setStatus('✓ Sent! Your greeting is the first one on page 1.');
    } catch (error) {
      console.error("Error adding document: ", error);
      this.view.setStatus("Couldn't send — try again.");
    }
    this.view.setSending(false);
  }

  prevPage() {
    if (this.model.currentPage > 0) {
      this.model.setPage(this.model.currentPage - 1);
    }
  }

  nextPage() {
    if (this.model.currentPage + 1 < this.model.totalPages()) {
      this.model.setPage(this.model.currentPage + 1);
    }
  }

  selectGreeting() {
    if (this.view.greetingSelect.value === 'Manual Input...') {
      this.view.setCustomGreetingMode(true);
    } else {
      this.view.setCustomGreetingMode(false);
    }
  }

  async startAdmin() {
    this.view.renderAdminBar(null);
    try {
      await loadScript("https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js");
      await loadScript("https://www.gstatic.com/firebasejs/8.6.1/firebase-auth.js");
    } catch (error) {
      return this.view.setAdminStatus("Couldn't load sign-in.");
    }
    firebase.initializeApp(firebaseConfig);
    this.view.onSignIn = () => firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch(error => this.view.setAdminStatus(`Sign-in failed: ${error.message}`));
    this.view.onSignOut = () => firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(user => {
      this.model.setAdmin(user);
      this.view.renderAdminBar(user);
    });
  }

  async toggleHidden(greeting) {
    this.view.setAdminStatus('');
    try {
      await this.model.setHidden(greeting, !greeting.hidden);
    } catch (error) {
      console.error("Error hiding document: ", error);
      this.view.setAdminStatus(error.status === 403
        ? "This account can't hide greetings (check the Firestore rules)."
        : "Couldn't save — try again.");
    }
  }
}

class GreetingModel {
  constructor() {
    /**
     * Every greeting, newest first.
     * @type {Array<{id: string, nickname: string, text: string, hidden: boolean, createdAt: Date}>}
     */
    this.greetings = [];
    this.currentPage = 0;
    this.messagesPerPage = 6;
    this.subscribers = [];
    this.admin = null;     // the signed-in Firebase user in ?admin mode
    this.mineId = null;    // the greeting this visitor just left

    this.load();
  }

  async load() {
    const all = [];
    let pageToken = '';
    try {
      do {
        const response = await fetch(`${FIRESTORE}/greetings?pageSize=300&${KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        (data.documents || []).forEach(doc => all.push(fromDoc(doc)));
        pageToken = data.nextPageToken || '';
      } while (pageToken);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
    this.greetings = all.sort((a, b) => b.createdAt - a.createdAt);
    this.notifySubscribers();
  }

  subscribe(observerFunction) {
    this.subscribers.push(observerFunction);
  }

  notifySubscribers() {
    this.subscribers.forEach(observerFunction => observerFunction(this));
  }

  /** Hidden greetings are left out for visitors and kept (marked) for the admin. */
  visible() {
    return this.admin ? this.greetings : this.greetings.filter(g => !g.hidden);
  }

  totalPages() {
    return Math.max(1, Math.ceil(this.visible().length / this.messagesPerPage));
  }

  /**
   * Saves a greeting, then puts it at the top of page 1.
   * Resolves only once Firestore has accepted it.
   */
  async addGreeting(nickname, text) {
    const response = await fetch(`${FIRESTORE}/greetings?${KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { nickname: { stringValue: nickname }, text: { stringValue: text } } }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const greeting = fromDoc(await response.json());
    this.greetings.unshift(greeting);
    this.mineId = greeting.id;
    this.currentPage = 0;
    this.notifySubscribers();
  }

  async setHidden(greeting, hidden) {
    const token = await this.admin.getIdToken();
    const response = await fetch(
      `${FIRESTORE}/greetings/${greeting.id}?updateMask.fieldPaths=hidden&currentDocument.exists=true&${KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ fields: { hidden: { booleanValue: hidden } } }),
    });
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    greeting.hidden = hidden;
    this.notifySubscribers();
  }

  setAdmin(user) {
    this.admin = user;
    this.currentPage = Math.min(this.currentPage, this.totalPages() - 1);
    this.notifySubscribers();
  }

  setPage(page) {
    this.currentPage = page;
    this.notifySubscribers();
  }
}

class GreetingView {
  constructor() {
    this.messageBox = document.getElementById('messageBox');
    this.boxes = Array.from(this.messageBox.querySelectorAll('.box'));
    this.nicknameInput = document.getElementById('nicknameInput');

    this.customGreetingDiv = document.getElementById('customGreetingDiv');
    this.greetingTextInput = document.getElementById('greetingTextInput');
    this.greetingEmojiInput = document.getElementById('greetingEmojiInput');

    this.greetingSelect = document.getElementById('greetingSelect');

    this.sendButton = document.getElementById('sendButton');
    this.prevButton = document.getElementById('prevButton');
    this.nextButton = document.getElementById('nextButton');
    this.pageLabel = document.getElementById('pageLabel');
    this.sendStatus = document.getElementById('sendStatus');
    this.adminBar = document.getElementById('adminBar');

    this.highlighted = false;
    this.onToggleHidden = () => {};
    this.onSignIn = () => {};
    this.onSignOut = () => {};
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

  setSending(sending) {
    this.sendButton.disabled = sending;
    this.sendButton.textContent = sending ? 'Sending…' : 'Upload';
  }

  setStatus(message) {
    this.sendStatus.textContent = message;
  }

  clearForm() {
    this.greetingTextInput.value = '';
    this.greetingEmojiInput.value = '';
  }

  _formatDate(date) {
    const pad = n => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  // Scatters greetings over the boxes in the same order every time for a given
  // page, so the wall does not rearrange itself when a greeting is hidden.
  _boxesFor(page) {
    let seed = page + 1;
    const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const boxes = this.boxes.slice();
    for (let i = boxes.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [boxes[i], boxes[j]] = [boxes[j], boxes[i]];
    }
    return boxes;
  }

  _message(greeting, model) {
    const message = document.createElement('div');
    message.className = 'message';

    const text = document.createElement('div');
    text.className = 'greeting';
    text.textContent = `${greeting.nickname} ${greeting.text}`;
    message.appendChild(text);

    const meta = document.createElement('div');
    meta.className = 'meta';
    message.appendChild(meta);

    if (greeting.id === model.mineId) {
      message.classList.add('mine');
      meta.textContent = 'just now · yours';
    } else {
      meta.textContent = this._formatDate(greeting.createdAt);
    }

    if (model.admin) {
      if (greeting.hidden) {
        message.classList.add('hidden');
        meta.textContent += ' · hidden';
      }
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'link-button';
      toggle.textContent = greeting.hidden ? 'show' : 'hide';
      toggle.addEventListener('click', () => this.onToggleHidden(greeting));
      meta.appendChild(toggle);
    }
    return message;
  }

  render(model) {
    // Clear the boxes
    this.boxes.forEach(box => box.replaceChildren());

    // Add messages for the current page
    const start = model.currentPage * model.messagesPerPage;
    const end = start + model.messagesPerPage;
    const greetingsInPage = model.visible().slice(start, end);

    // The greeting this visitor just left always takes the first box.
    const boxes = this._boxesFor(model.currentPage);
    if (greetingsInPage.some(g => g.id === model.mineId)) {
      boxes.splice(boxes.indexOf(this.boxes[0]), 1);
      boxes.unshift(this.boxes[0]);
      greetingsInPage.sort((a, b) => (b.id === model.mineId) - (a.id === model.mineId));
    }

    greetingsInPage.forEach((greeting, i) => {
      const message = this._message(greeting, model);
      boxes[i].appendChild(message);
      if (greeting.id === model.mineId && !this.highlighted) {
        // Fill it with sunlight for a moment, then let it fade.
        this.highlighted = true;
        message.classList.add('fresh');
        setTimeout(() => {
          this.messageBox.querySelectorAll('.fresh').forEach(m => m.classList.remove('fresh'));
        }, 4000);
      }
    });

    // Update the page label
    let label = `Page ${model.currentPage + 1} of ${model.totalPages()} · newest first`;
    const hidden = model.greetings.filter(g => g.hidden).length;
    if (model.admin && hidden) label += ` · ${hidden} hidden`;
    this.pageLabel.textContent = label;
    this.prevButton.disabled = model.currentPage === 0;
    this.nextButton.disabled = model.currentPage + 1 >= model.totalPages();
  }

  renderAdminBar(user) {
    this.adminBar.hidden = false;
    this.adminBar.replaceChildren();
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'link-button';
    if (user) {
      this.adminBar.append(`admin: ${user.displayName || user.email}`);
      button.textContent = 'sign out';
      button.addEventListener('click', () => this.onSignOut());
    } else {
      this.adminBar.append('admin:');
      button.textContent = 'sign in with Google';
      button.addEventListener('click', () => this.onSignIn());
    }
    this.adminBar.appendChild(button);
    this.adminStatus = document.createElement('span');
    this.adminStatus.style.marginLeft = '12px';
    this.adminBar.appendChild(this.adminStatus);
  }

  setAdminStatus(message) {
    if (this.adminStatus) this.adminStatus.textContent = message;
  }
}

const model = new GreetingModel();
const view = new GreetingView();
const controller = new GreetingController(model, view);
