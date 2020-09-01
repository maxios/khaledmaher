const stdin = () => {
  console.log("What is your name?");
  process.stdin.once('data', (chunk) => {
    let name = chunk.toString();
    console.log("Hello, " + name + "!");
    stdin();
  });
}

stdin()
