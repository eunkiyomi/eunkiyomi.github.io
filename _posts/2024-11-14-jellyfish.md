---
layout: post
title: jellyfish
authors: 
- eunki
---


<style>
body {
  /* background: linear-gradient(to bottom, #89cff0, #1d3557); */
  /* color: white; */
  font-family: monospace;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin-top: 100px;
}

.jellyfish1 {
  text-align: center;
  font-size: 1.2rem;
  white-space: pre;
  line-height: 1.1;
  position: absolute;
  animation: float1 4s ease-in-out infinite, sway1 2s ease-in-out infinite alternate;
}

@keyframes float1 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes sway1 {
  0% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(10px);
  }
}



.jellyfish2 {
  text-align: center;
  font-size: 1.2rem;
  white-space: pre;
  line-height: 1.1;
  position: relative;
  margin-left: 300px;
  margin-top: 200px;
  animation: float2 4s ease-in-out infinite;
}

.legs2 span {
  display: inline-block;
  animation: wave2 2s infinite ease-in-out, sideWave2 2s infinite ease-in-out;
}

/* Staggered delay for organic motion */
.legs2 span:nth-child(1) {
  animation-delay: 0s;
}
.legs2 span:nth-child(2) {
  animation-delay: 0.2s;
}
.legs2 span:nth-child(3) {
  animation-delay: 0.4s;
}

/* Floating motion for the whole jellyfish */
@keyframes float2 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Up and down waving motion for legs */
@keyframes wave2 {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
}

/* Side-to-side motion for each letter */
@keyframes sideWave2 {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
  }
}
</style>

<div class="jellyfish1">
    해해해해해해<br>
   해           해<br>
  해             해<br>
   해           해<br>
    해해해해해<br>
     해  해  해<br>
      파 파 파<br>
       리 리 리<br>
      파   파   파
</div>

<div class="jellyfish2">
    해해해해해해<br>
   해           해<br>
  해             해<br>
   해           해<br>
    해해해해해<br>
    <div class="legs2">
      <span>해</span>  <span>해</span>  <span>해</span><br>
      <span>파</span>  <span>파</span>  <span>파</span><br>
      <span>리</span>  <span>리</span>  <span>리</span><br>
      <span>파</span>   <span>파</span>   <span>파</span>
    </div>
  </div>
