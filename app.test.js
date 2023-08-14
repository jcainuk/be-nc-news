const { app } = require("./app");
const request = require("supertest");
const connection = require("./db/connection");
const { seed } = require("./db/seeds/seed");
const data = require("./db/data/test-data/index");
const jsonFile = require("./endpoints");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return connection.end();
});

describe("/api", () => {
  test("200: it should return an accurate JSON object describing all the available endpoints on this API project", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpoints = response.body;
        expect(endpoints).toEqual(jsonFile);
      });
  });
});

describe("/api/topics", () => {
  describe("GET topics default", () => {
    test("200: it responds with an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const { topics } = response.body;
          expect(Array.isArray(topics)).toBe(true);
        });
    });

    test("200: each topic object should have a slug and description property", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const { topics } = response.body;

          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
        });
    });
  });
});
