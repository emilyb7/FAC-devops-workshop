const test = require("tape");
const request = require("supertest");
const app = require("./app");

test("example test", (t) => {
  t.equal(1 + 1, 2, "should be 2");

  t.end();
});

test("server test", { timeout: 500 }, (t) => {
  request(app)
    .get("/")
    .expect(200)
    .end((err, res) => {
      t.error(err);
      t.equals(res.text, "Hello, world!");
      t.end();
    });
});
