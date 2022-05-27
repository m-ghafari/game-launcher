const inquirer = require("inquirer");
const { exec } = require("child_process");
const fs = require("fs/promises");
const args = process.argv.slice(2);

function runbash(x) {
  return new Promise((resolve) => {
    exec(x, (error, stdout, stderr) => resolve(stdout));
  });
}

(async () => {
  let currentfile = JSON.parse(
    await fs.readFile("/home/exhq/randomshitineed/data.json", "utf-8")
  );
  if (args[0] == "-n") {
    let newgame = await inquirer.prompt([
      { name: "gamename", message: "what is the name of the game?" },
      { name: "dir", message: "put the literal directory of the game" },
      { name: "iswin", message: "does it have to be ran with wine? (y/n)" },
    ]);
    if (newgame.iswin == "y") {
      newgame.iswin = true;
    }
    let game = {
      name: newgame.gamename,
      dir: newgame.dir,
      iswin: newgame.iswin,
    };
    currentfile.array.push(game);
    await fs.writeFile(
      "/home/exhq/randomshitineed/data.json",
      JSON.stringify(currentfile),
      "utf-8"
    );
  }
  if (args[0] == "-l") {
    for (let i = 0; i < currentfile.array.length; i++) {
      console.log(
        currentfile.array[i].name,
        currentfile.array[i].dir,
        currentfile.array[i].iswin
      );
    }
  }
  if (args[0] == "-f") {
    for (let i = 0; i < currentfile.array.length; i++) {
      if (currentfile.array[i].name == args[1]) {
        console.log(
          currentfile.array[i].name,
          currentfile.array[i].dir,
          currentfile.array[i].iswin
        );
        break;
      }
    }
  }
  if (args[0] == "-r") {
    for (let i = 0; i < currentfile.array.length; i++) {
      if (currentfile.array[i].name == args[1]) {
        if (currentfile.array[i].iswin == true) {
          await runbash(`wine  $(currentfile.array[i].dir)`);
        } else {
          await runbash(currentfile.array[i].dir);
        }

        break;
      }
    }
  }
  if (args[0] == "-h") {
    console.log(
      "-n to add a new game\n-l to list all games\n-f to find a game\n-r to run a game"
    );
  }
})();
