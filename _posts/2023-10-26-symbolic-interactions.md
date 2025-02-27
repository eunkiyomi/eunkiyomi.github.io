---
layout: post
title: Guest Book (Symbolic Interactions)
custom_js: symbolic_interactions
authors: 
- guests
---

<script src="https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.6.1/firebase-firestore.js"></script>

<!-- Interaction -->

<!-- # Style -->
<style>

#messageBox {
  border: 1px solid black; 
  height: 500px; 
  position: relative;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

#messageBox .box {
  width: 50%;
  height: 20%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

#customGreetingDiv {
  display: none;
}
</style>

<!-- # Body -->
<div id="messageBox">
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
</div>
<p id="pageLabel"></p>
<button id="prevButton" type="button">Previous</button>
<button id="nextButton" type="button">Next</button>
<form>
  <input id="nicknameInput" placeholder="Nickname" type="text" size="15">
  <div id="customGreetingDiv">
    <input id="greetingTextInput" type="text" name="greetingTextInput" 
          placeholder="Greeting">
    <input id="greetingEmojiInput" type="text" name="greetingEmojiInput" 
          placeholder="Emoji" size="5" >
  </div>
  <select id="greetingSelect"></select>
  <button id="sendButton" type="button">Upload</button>
</form>

