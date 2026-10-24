---
layout: post
title: Guest Book (Symbolic Interactions)
custom_js: symbolic_interactions
authors: 
- guests
---

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

#messageBox .message {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 8px;
  border: 1px solid transparent;
  transition: background-color 1.2s;
}

#messageBox .meta {
  font-size: 13px;
  color: #6b6b6b;
}

#messageBox .mine {
  border-color: black;
}

#messageBox .mine.fresh {
  background-color: rgba(255, 212, 59, 0.35);
}

#messageBox .mine .meta {
  color: black;
  font-weight: 700;
}

#messageBox .hidden {
  border: 1px dashed #6b6b6b;
}

#messageBox .hidden .greeting {
  color: #6b6b6b;
  text-decoration: line-through;
}

.link-button {
  font: inherit;
  color: #0000ee;
  background: none;
  border: none;
  padding: 0;
  margin-left: 12px;
  text-decoration: underline;
  cursor: pointer;
}

#adminBar {
  font-size: 13px;
  color: #6b6b6b;
}

#adminBar .link-button {
  font-size: 13px;
}

#customGreetingDiv {
  display: none;
}
</style>

([Eunki as a Researcher](/research/))

<!-- # Body -->
<p id="adminBar" hidden></p>
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
<button id="prevButton" type="button">← Newer</button>
<button id="nextButton" type="button">Older →</button>
<form>
  <input id="nicknameInput" placeholder="Nickname" type="text" size="15" maxlength="50">
  <div id="customGreetingDiv">
    <input id="greetingTextInput" type="text" name="greetingTextInput" 
          placeholder="Greeting">
    <input id="greetingEmojiInput" type="text" name="greetingEmojiInput" 
          placeholder="Emoji" size="5" >
  </div>
  <select id="greetingSelect"></select>
  <button id="sendButton" type="button">Upload</button>
</form>
<p id="sendStatus" role="status"></p>
