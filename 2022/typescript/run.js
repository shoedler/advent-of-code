const { execSync } = require('child_process');
const { existsSync } = require('fs');

const selectSolution = (i) => { 
  const cwd = `${__dirname}\\${i}`;
  const file = `${cwd}\\solution.ts`;
  return { cwd, file }; 
}

const dev = (day) => {
  const { cwd, file } = selectSolution(day);
  const command = "nodemon -x \"cls && ts-node\" " + file;

  if (!existsSync(file))
    throw new Error(`🔍 Day ${day} file does not exist.\nRunning '${command}' would fail.`)

  execSync(command, { stdio: "inherit", cwd });
}

const runAll = () => {
  let day = 1;
  while (existsSync(selectSolution(day).file)) {
    const { cwd, file } = selectSolution(day);
    console.log(`Running day ${day}:`)
    execSync("ts-node " + file, { stdio: "inherit", cwd });
    day++;
  }
}

const dayArg = process.argv.filter(arg => /^\d+$/.test(arg))[0];

if (dayArg)
  dev(dayArg)
else
  runAll()
