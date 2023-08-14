const container = document.querySelector('.container');
const containerHeight = _.round(container.getBoundingClientRect().height);

function addSVGTicks() {
  const strokeWidth = 10;
  const stroke = 'black';
  const xmlns = 'http://www.w3.org/2000/svg';
  const svgElem = document.createElementNS(xmlns, "svg");
  svgElem.setAttributeNS(null, "height", containerHeight);

  const g = document.createElementNS(xmlns,"g");
  const svgFrag = new DocumentFragment();

  _.times(12, i => {
    const tick = document.createElementNS(xmlns, "path");
    tick.setAttributeNS(null, "width", '5');
    tick.classList = `.tick .tick--${i}`;
    tick.setAttributeNS(null, "height", containerHeight/2);
    // tick.setAttributeNS(null, "viewBox", 'm 0 0 l 0 100');
    tick.setAttributeNS(null, "d", 'm 0 0 l 0 50');
    tick.setAttributeNS(null, "stroke-width", strokeWidth);
    tick.setAttributeNS(null, "stroke", stroke);
    // tick.setAttributeNS(null, "transform", `rotate(30deg)`);
    svgFrag.appendChild(tick);
  });

  g.appendChild(svgFrag);
  svgElem.appendChild(g);
  container.appendChild(svgElem);
}

const now = new Date();
let secs = now.getSeconds();
let mins = now.getMinutes();
let hours = now.getHours();

console.log(secs, mins, hours)


let secRotate = _.round(secs / 60 * 360);
let bigRotate = _.round(mins / 60 * 360  + 6 * secs / 60);
let smallRotate = _.round(hours % 12 * 30 + 30 * mins / 60);

console.log(bigRotate)


// let secRotate = 6;
// let smallRotate = 30 + 6 * _.random(50);
// let bigRotate = 30 + 6 * _.random(50);

////////ANIME JS

function handleSec() {
  anime({
    targets: '.sec-hand',
    duration: 300,
    delay: 700,
    translateX: -0.75,
    rotate: () => secRotate += 6,
    easeing: 'spring(0, 90, 10, 10)',
    complete: handleSec
  })
}

function handleBig(start = 0) {
  anime({
    targets: '.big-hand',
    duration: ((60-mins) * 60 - secs) * 1000,
    translateX: -1.5,
    easing: 'linear',
    rotate: [start, 360],
    complete: (target) => { 
      mins = 0;
      secs = 0;
    handleBig(0)}
  })
}

function handleSmall(start = 0) {
  anime({
    targets: '.small-hand',
    duration: (60-mins) * 60 * 1000,
    rotate: [start,  start + start % 30],
    translateX: -2,
    easing: 'linear',
    complete: (target) => { console.log(document.querySelector('.sec-hand').style.translateX)
    handleSmall(start + 30)}
  })
}


/////GSAP


function handleSecGSAP() {
  
  return gsap.to('.sec-hand', {
    duration: .35,
    delay: .65,
    // delay: 700,
    // translateX: -0.75,
    rotation: () => secRotate += 6,
    ease: "elastic.out(1, 0.4)",// "back.out(2.4)",
    onComplete: handleSecGSAP
  });
}

function handleBigGSAP(start = 0) {
  console.log('startttt', start)
  gsap.fromTo('.big-hand', {
    rotation: start
  }, {
    duration: ((60 - mins) * 60 - secs),
    ease: "linear",
    rotation: 360,
    onComplete: () => {
      mins = 0;
      secs = 0;
      handleBigGSAP();
    }
  });
}

function handleSmallGSAP(start = 0) {
  return gsap.fromTo('.big-hand', {
    rotation: start
  }, {
    duration: ((60 - mins) * 60 - secs),
    ease: "linear",
    rotation: 360,
    onComplete: () => {
      hours = ( hours + 1 ) % 12;
      smallRotate = hours * 30;
      handleSmallGSAP(smallRotate);
    }
  });
}

function tiktok() {
  const timeline = gsap.timeline({timeScale: 2});
  gsap.set('.sec-hand', {
    rotation: secRotate
  });
  gsap.set('.small-hand', {
    rotation: smallRotate
  });
  gsap.set('.big-hand', {
    rotation: bigRotate
  });
  
  timeline.add(handleSecGSAP());
  timeline.add(handleBigGSAP(bigRotate), '<');
  timeline.add(handleSmallGSAP(smallRotate), '<');
  
  
  timeline.timeScale(2);
  // handleSmallGSAP(smallRotate);
}

const tickingTimeline = tiktok();


Resources