const EventEmitter = require("events");
const { request, Client, Agent } = require("./index");

class FakeSocket extends EventEmitter {
  write(...args) {
    console.log("write", ...args);
    process.nextTick(() => {
      this.emit("readable");
    });
  }

  read() {
    this.read = () => { return null; };
    process.nextTick(() => { this.emit("end"); })
    return Buffer.from("HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: 5\r\n\r\n[1,2]");
  }
}

const dispatcher = new Agent({
  connect(options, callback) {
    console.log("connect", options);
    callback(null, new FakeSocket());
  }
})

request("http://www.google.com", { dispatcher }).then(async result => {
  console.log(result);
  console.log(await result.body.json());
});
