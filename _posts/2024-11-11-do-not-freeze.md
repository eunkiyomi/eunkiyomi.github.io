---
layout: post
title: Do not freeze
authors: 
- eunki
---

<!-- # Style -->

<style>
body { height: 2000px; }  
</style>

<!-- # Body -->

<div>
<pre>
얼  ❄️        ❄️

 ..   지    .. 

      <a id="shakeLink" href="#">말</a> .  ..

   아        ❄️

       ❄️..  요
</pre>
</div>

<script>
document.getElementById('shakeLink').addEventListener('click', function(event) {
  event.preventDefault();

  console.log("Hi");
  
  const intensity = 30; // Pixels to scroll in each direction
  const duration = 5000; // Total duration in milliseconds
  const frequency = 50; // Frequency of shakes (ms)

  let elapsed = 0;

  const shake = setInterval(() => {
    const randomX = (Math.random() - 0.5) * intensity * 2;
    const randomY = (Math.random() - 0.5) * intensity * 2;

    window.scrollBy(randomX, randomY);

    elapsed += frequency;

    if (elapsed >= duration) {
      clearInterval(shake);
      window.scrollTo(0, 0); // Reset scroll position after shaking
    }
  }, frequency);
});
</script>