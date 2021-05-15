process.stdin.setRawMode(true);
let typing = "";
let promptStr = "";
function prompt(str) {
  process.stdout.write(str);
  promptStr = str;
  return new Promise((resolve) => {
    function handler(hook) {
      function handle(d) {
        if (d.toString("hex") !== "7f") process.stdout.write(d.toString());
        if (d.toString() !== "\r") typing += d.toString();
        else if (typing) {
          hook(typing);
          process.stdin.off("data", handle);
          lastCmd = typing;
          typing = "";
        }
      }

      process.stdin.on("data", handle);
    }
    handler(resolve);
  });
}
function printf(...args) {
  process.stdout.write(require("util").format(...args));
}
printf("Welcome to the Splatulator,", "the offline calculator\n");
(async function () {
  while (true) {
    const data = await prompt("> What would you like to do? $ ");
    if (data == "calc") {
      printf("Fair enough.\n");
      const oper = await prompt("> What is your sum? $ ");
      eval(`console.log(${oper})`);
    } else if (data == "help") {
      printf("all I got is 'calc' and 'exit'\n");
    } else if (data == "exit") {
      process.exit();
    } else {
      printf("unknown command: use help for details\n");
    }
  }
})();
process.stdin.on("data", (d) => {
  const hex = d.toString("hex");
  if (hex === "03") process.exit(130);
  if (hex === "04") process.exit(137);
  if (hex === "0d") process.stdout.write("\n");
  else if (hex === "7f") {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdin.write(promptStr + typing.slice(0, -1));
  }
});
