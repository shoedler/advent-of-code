let buttonPart1;
let buttonPart2;
let activePart = 'Part 1';
let run = false;
const xOfs = minX - 1;

const drawCave = () => {
  caveWallsArray.forEach(([y, x]) => set(x-xOfs, y, color(112,128,144)));
}

const drawGrainsOfSand = () => {
  grainsOfSand.forEach(grain => {
    const [y, x] = grain.split(',').map(Number);

    if (x < maxX && x > minX - 2)
      set(x-xOfs, y, color(244,164,96));
  });
}

function setup() {
  document.body.style.zoom = "180%";
  
  createCanvas(maxX-xOfs, maxY+1);
  
  const startRun = (part) => {
    activePart = part;
    run = true;
    grainsOfSand.clear();
    buttonPart1.attribute('disabled', '')
    buttonPart2.attribute('disabled', '')
  }

  buttonPart1 = createButton('Part 1');
  buttonPart2 = createButton('Part 2');

  buttonPart1.position(maxX-xOfs + 10, 7);
  buttonPart2.position(maxX-xOfs + 10, 30);

  buttonPart1.mousePressed(() => startRun('Part 1'));
  buttonPart2.mousePressed(() => startRun('Part 2'));
}

function draw() {
  background(32);
  loadPixels();

  drawCave();
  drawGrainsOfSand();   

  if (run) {
    // Skip simulations that are not in the visible area
    let [response, [y, x]] = dropOnce(activePart);
    while (!(x < maxX && x > minX - 2)) {
      [response, [y, x]] = dropOnce(activePart);
    }

    if (!response) { 
      run = false;
      console.log(activePart, grainsOfSand.size)
      buttonPart1.removeAttribute('disabled');
      buttonPart2.removeAttribute('disabled');
    }

    set(x-xOfs, y, color(255));
  }

  updatePixels();
}