// script.js
const clock = document.querySelector('#utility-clock');

if (!clock) {
  console.error('utility-clock element not found.');
} else {
  utilityClock(clock);
  autoResize(clock, 295 + 32); // native size, adjust as you like
}

function utilityClock(container) {
  let dynamic = container.querySelector('.dynamic');
  let hourElement = container.querySelector('.anchor.hour');
  let minuteElement = container.querySelector('.anchor.minute');
  let secondElement = container.querySelector('.anchor.second');

  // create minute tick (1..60). If n%5==0 we draw text; else a short tick line.
  const minute = (n) => (n % 5 === 0 ? minuteText(n) : minuteLine(n));

  function minuteText(n) {
    let element = document.createElement('div');
    element.className = 'minute-text';
    element.innerHTML = (n < 10 ? '0' : '') + n;
    // position around circle: phase (0..1) and radius
    position(element, n / 60, 135);
    dynamic.appendChild(element);
  }

  function minuteLine(n) {
    let anchor = document.createElement('div');
    anchor.className = 'anchor';
    let element = document.createElement('div');
    element.className = 'element minute-line';

    rotate(anchor, n / 60); // rotate anchor to correct angle (0..1)
    anchor.appendChild(element);
    dynamic.appendChild(anchor);
  }

  const hour = (n) => {
    let element = document.createElement('div');
    element.className = 'hour-text hour-' + n;
    element.innerHTML = n;
    // position hours around smaller radius
    position(element, n / 12, 105);
    dynamic.appendChild(element);
  };

  // place an element at phase (0..1) and radius r (px)
  function position(element, phase, r) {
    let theta = phase * 2 * Math.PI;
    element.style.top = (-r * Math.cos(theta)).toFixed(1) + 'px';
    element.style.left = (r * Math.sin(theta)).toFixed(1) + 'px';
  }

  // rotate an element given a "phase" in 0..1 (1 = full turn).
  // multiply by 360deg inside.
  function rotate(element, phase) {
    element.style.transform = element.style.webkitTransform = 'rotate(' + (phase * 360) + 'deg)';
  }

  // animation that computes smooth positions for hands
  const animate = () => {
    let now = new Date();
    let milliseconds = now.getMilliseconds() / 1000;
    let seconds = now.getSeconds() + milliseconds; // 0..60
    let minutes = now.getMinutes() + seconds / 60; // 0..60
    let hours = (now.getHours() % 12) + minutes / 60; // 0..12

    // convert to 0..1 phases for rotate()
    rotate(secondElement, seconds / 60);
    rotate(minuteElement, minutes / 60);
    // hour hand: hours/12, or equivalently (hours*5)/60. Using hours/12 is fine.
    rotate(hourElement, hours / 12);

    requestAnimationFrame(animate);
  };

  // create all ticks and numbers
  for (let i = 1; i <= 60; i++) {
    minute(i);
  }
  for (let i = 1; i <= 12; i++) {
    hour(i);
  }

  animate();
}

function autoResize(element, nativeSize) {
  const update = () => {
    // offsetParent may be null in some cases; fall back to body
    let parent = element.offsetParent || document.body;
    let scale = Math.min(parent.offsetWidth, parent.offsetHeight) / nativeSize;
    // keep a reasonable precision for scale
    element.style.transform = element.style.webkitTransform = 'scale(' + scale.toFixed(3) + ') translate(-50%,-50%)';
    element.style.transformOrigin = 'center center';
  };
  window.addEventListener('resize', update);
  // initial call
  update();
}
