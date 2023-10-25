---
layout: post
custom_js: symbolic_interactions
authors: 
- eunki
---

<!-- Interaction -->
<div id="messageBox" style="border: 1px solid black; height: 500px; position: relative;"></div>
<p id="pageLabel"></p>
<button id="prevButton" type="button">Previous</button>
<button id="nextButton" type="button">Next</button>
<form>
  <input id="nicknameInput" type="text">
  이(가)
  <select id="greetingSelect"></select>
  <button id="sendButton" type="button"></button>
  을(를) 했다
</form>
<!-- 
### Background
In this post,
The visitors will greet me.

They can select their words like:
- *Jeanne*(이)가 *인사하는 손짓👋🙋*을 보냈다.
- *Hoyeon*(이)가 *자전거 벨소리 땡땡🛎️*을 보냈다.
- *Jeongmin*(이)가 *어깨 툭툭 치기(🤚)*을 보냈다. 

The italic words are their input.
The first ones are their nicknames. They will use a textbox to type these.
The second ones are their greets. They will select this from a select box.

This is the elements of the select box.
- 인사하는 손짓 👋🙋‍♀️
- 자전거 벨소리 땡땡 🛎️
- 어깨를 툭툭 치기 🤚
- 이름을 부르기 🏷️
- 건배하기 짠 🍻🥂

### Design

There is a big box (1px black straight line borders), in which the above sentences (e.g., Jeanne(이)가 인사하는 손짓👋🙋을 보냈다.) appear. 
Below this box, there is a form, consisting of a textbox, a select box, and a send button.
The send button's label is the emoji associated with the selected greets. 
When this button is clicked, the constructed greeting message will be added to the big box.

### Goal

- Code `symbolic_interactions.js` for implementing this design. -->


