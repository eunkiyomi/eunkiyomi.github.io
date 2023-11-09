---
layout: post
title: Random Box
custom_js: random_box
authors: 
- eunki
---

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

#messageBox .box .highlight {
  background-color: rgb(121, 230, 121);
}

</style>

<!-- # Body -->

Let's make a box that randomly distribute texts

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


