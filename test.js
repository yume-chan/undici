import { request, Agent, Duplex, Buffer } from "./dist/main.mjs";

class FakeSocket extends Duplex {
  write(...args) {
    console.log("write", ...args);
    Promise.resolve().then(() => {
      this.emit("readable");
    });
  }

  read() {
    this.read = () => { return null; };
    Promise.resolve().then(() => { this.emit("end"); })
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
