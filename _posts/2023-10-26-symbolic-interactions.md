---
layout: post
title: Guest Book
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
}

#customGreetingDiv {
  display: none;
}
</style>

<!-- # Body -->
<div id="messageBox"></div>
<p id="pageLabel"></p>
<button id="prevButton" type="button">Previous</button>
<button id="nextButton" type="button">Next</button>
<form>
  <input id="nicknameInput" placeholder="닉네임" type="text" size="15">
  이(가)
  <div id="customGreetingDiv">
    <input id="greetingTextInput" type="text" name="greetingTextInput" 
          placeholder="인사">
    <input id="greetingEmojiInput" type="text" name="greetingEmojiInput" 
          placeholder="이모지" size="5" >
  </div>
  <select id="greetingSelect"></select>
  <button id="sendButton" type="button">올리기</button>
</form>

