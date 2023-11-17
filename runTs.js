const { execSync } = require('child_process');
const { existsSync } = require('fs');

const selectSolution = (year, day) => { 
  const cwd = `${__dirname}\\${year}\\typescript\\${day}`;
  const file = `${cwd}\\solution.ts`;
  return { cwd, file }; 
}

const dev = (year, day) => {
  const { cwd, file } = selectSolution(year, day);
  const command = "nodemon -x \"cls && ts-node\" " + file;

  if (!existsSync(file))
    throw new Error(`🔍 Year ${year} Day ${day} file does not exist.\nRunning '${command}' would fail.`)

  execSync(command, { stdio: "inherit", cwd });
}

const runAllOfYear = (year) => {
  let day = 1;

  while (existsSync(selectSolution(year, day).file)) {
    const { cwd, file } = selectSolution(year, day);
    console.log(`Running year ${year}, day ${day} (${file}):`)
    execSync("ts-node " + file, { stdio: "inherit", cwd });
    day++;
  }
}

const runAllYears = () => {
  let year = 2015;
  while (existsSync(`${__dirname}\\${year}`)) {
    console.log(`Running year ${year}:`)
    runAllOfYear(year);
    year++;
  }
}

const numericalArgs = process.argv.filter(arg => /^\d+$/.test(arg));
const arg0 = numericalArgs[0];
const arg1 = numericalArgs[1];

if (numericalArgs.length === 2)
  dev(arg0, arg1)
else if (numericalArgs.length === 1) {
  if (arg0 >= 2015)
    runAllOfYear(arg0)
  else
    throw new Error("☝️ Providing a single argument will run all days of that year. Must be 2015 or later.")
}
else
  runAllYears()
