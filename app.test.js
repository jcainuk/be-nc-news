const { app } = require("./app");
const request = require("supertest");
const connection = require("./db/connection");
const seed = require("./db/seeds/seed");
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

describe("/api/articles", () => {
  describe("GET articles default", () => {
    test("200: responds with an array appropriate articles sorted in descending date order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(Array.isArray(articles)).toBe(true);
          expect(articles).toBeSortedBy("created_at", {
            descending: true
          });
        });
    });
    test("200: each article object should have the correct properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;

          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
            expect(article).not.toHaveProperty("body");
          });
        });
    });
  });
  describe("/api/articles queries", () => {
    describe("/api/articles?topic", () => {
      test("200: articles takes a topic query, which filters articles by topic", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toHaveLength(1);
            articles.forEach((article) => {
              expect(article.topic).toBe("cats");
              expect(article).toHaveProperty("author", expect.any(String));
              expect(article).toHaveProperty("title", expect.any(String));
              expect(article).toHaveProperty("article_id", expect.any(Number));
              expect(article).toHaveProperty("created_at", expect.any(String));
              expect(article).toHaveProperty("votes", expect.any(Number));
              expect(article).toHaveProperty(
                "article_img_url",
                expect.any(String)
              );
              expect(article).not.toHaveProperty("body");
              expect(article).toHaveProperty(
                "comment_count",
                expect.any(Number)
              );
            });
          });
      });
      test("200: responds with an empty array when passed an existing topic with no articles", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toEqual([]);
          });
      });
      test("404: responds with not found when passed a topic that doesn't exist", () => {
        return request(app)
          .get("/api/articles?topic=chicken")
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Not found");
          });
      });
    });
    describe("/api/articles?sort_by", () => {
      test("200: articles are returned in descending order of date by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toHaveLength(13);
            expect(articles).toBeSortedBy("created_at", {
              descending: true
            });
            articles.forEach((article) => {
              expect(article).toHaveProperty("author", expect.any(String));
              expect(article).toHaveProperty("title", expect.any(String));
              expect(article).toHaveProperty("article_id", expect.any(Number));
              expect(article).toHaveProperty("topic", expect.any(String));
              expect(article).toHaveProperty("created_at", expect.any(String));
              expect(article).toHaveProperty("votes", expect.any(Number));
              expect(article).toHaveProperty(
                "article_img_url",
                expect.any(String)
              );
              expect(article).not.toHaveProperty("body");
              expect(article).toHaveProperty(
                "comment_count",
                expect.any(Number)
              );
            });
          });
      });
      test("200: articles takes a sort_by query, which can sort by any valid column", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toHaveLength(13);
            expect(articles).toBeSortedBy("article_id", {
              descending: true
            });
            articles.forEach((article) => {
              expect(article).toHaveProperty("author", expect.any(String));
              expect(article).toHaveProperty("title", expect.any(String));
              expect(article).toHaveProperty("article_id", expect.any(Number));
              expect(article).toHaveProperty("topic", expect.any(String));
              expect(article).toHaveProperty("created_at", expect.any(String));
              expect(article).toHaveProperty("votes", expect.any(Number));
              expect(article).toHaveProperty(
                "article_img_url",
                expect.any(String)
              );
              expect(article).not.toHaveProperty("body");
              expect(article).toHaveProperty(
                "comment_count",
                expect.any(Number)
              );
            });
          });
      });
      test("400: responds with bad request when passed an invalid sort_by query", () => {
        return request(app)
          .get("/api/articles?sort_by=hello")
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Bad request");
          });
      });
    });
    describe("/api/articles?order", () => {
      test("200: articles takes an order query, which can change the order the articles are sorted by", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toHaveLength(13);
            expect(articles).toBeSortedBy("created_at", {
              ascending: true
            });
            articles.forEach((article) => {
              expect(article).toHaveProperty("author", expect.any(String));
              expect(article).toHaveProperty("title", expect.any(String));
              expect(article).toHaveProperty("article_id", expect.any(Number));
              expect(article).toHaveProperty("topic", expect.any(String));
              expect(article).toHaveProperty("created_at", expect.any(String));
              expect(article).toHaveProperty("votes", expect.any(Number));
              expect(article).toHaveProperty(
                "article_img_url",
                expect.any(String)
              );
              expect(article).not.toHaveProperty("body");
              expect(article).toHaveProperty(
                "comment_count",
                expect.any(Number)
              );
            });
          });
      });
      test("400: responds with bad request when passed an invalid order query", () => {
        return request(app)
          .get("/api/articles?order=hello")
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Bad request");
          });
      });
    });
    test("200: articles takes topic, sort_by and order queries that work when all used together", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=title&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(12);
          expect(articles).toBeSortedBy("title", { ascending: true });
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
            expect(article).not.toHaveProperty("body");
            expect(article).toHaveProperty("comment_count", expect.any(Number));
          });
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET an article", () => {
    test("200: gets an article for an ID that exists", () => {
      return request(app)
        .get("/api/articles/1")
        .then((response) => {
          const { article } = response.body;
          expect(article).toHaveProperty("article_id", 1);
          expect(typeof article.article_id).toBe("number");

          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("body", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
        });
    });
    test("400: responds with error when invalid id is input", () => {
      return request(app)
        .get("/api/articles/apple")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("404: responds with an error when valid input but dont have that article", () => {
      return request(app)
        .get("/api/articles/9000")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article does not exist");
        });
    });
  });

  describe("PATCH an article", () => {
    test("200: it should be able to increase votes on an article by ID", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then((response) => {
          const { article } = response.body;

          expect(article).toHaveProperty("article_id", 1);
          expect(typeof article.article_id).toBe("number");
          expect(article).toHaveProperty("votes", 101);
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("body", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
        });
    });
    test("200: it should be able to reduce votes on an article by ID", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -100 })
        .expect(200)
        .then((response) => {
          const { article } = response.body;

          expect(article).toHaveProperty("article_id", 1);
          expect(typeof article.article_id).toBe("number");
          expect(article).toHaveProperty("votes", 0);
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("body", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
        });
    });
    test("400: responds with error when invalid id is input", () => {
      return request(app)
        .patch("/api/articles/banana")
        .send({ inc_votes: -100 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("GET 404: sends an appropriate and error message when given a valid but non-existent id", () => {
      return request(app)
        .patch("/api/articles/9000")
        .send({ inc_votes: 100 })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article does not exist");
        });
    });
    test("400: responds with error when no votes are are included", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("POST 400: responds with correct error when request body contains wrong data type (STRING)", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "apple" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("get all comments for an article", () => {
    test("GET 200: sends an array of comments with the correct properties belonging to a single article to the client", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments.length).toBe(11);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("created_at", expect.any(String));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("article_id", expect.any(Number));
          });
        });
    });
    test("GET 200: article comments should be served in an array with the most recent comments first", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments.length).toBe(11);
          expect(comments).toBeSortedBy("created_at", {
            descending: true
          });
        });
    });

    test("GET 404: sends an appropriate and error message when given a valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/9000/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article does not exist");
        });
    });
    test("GET 400: responds with error when invalid id is input", () => {
      return request(app)
        .get("/api/articles/banana/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
  });

  describe("add a comment for an article", () => {
    test("POST 201: add a comment to an article and responds with the posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "That article was so thought-provoking!"
        })
        .expect(201)
        .then((response) => {
          const { comment } = response.body;
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty(
            "body",
            "That article was so thought-provoking!"
          );
          expect(comment).toHaveProperty("votes", 0);
          expect(comment).toHaveProperty("author", "butter_bridge");
          expect(comment).toHaveProperty("article_id", 1);
          expect(comment).toHaveProperty("created_at", expect.any(String));
        });
    });

    test("POST 400: responds with correct error when req body is missing username", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          body: "That article for so thought-provoking!"
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("POST 400: responds with correct error when req body is missing body", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge"
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("POST 400: responds with correct error when body contains wrong data type", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: 23
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("POST 400: responds with correct error when username contains wrong data type", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: 23,
          body: "That article for so thought-provoking!"
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("400: responds with error when article_id is not in correct format", () => {
      return request(app)
        .post("/api/articles/apple/comments")
        .send({
          username: "butter_bridge",
          body: "That article for so thought-provoking!"
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("404: responds with error when article_id does not exist", () => {
      return request(app)
        .post("/api/articles/9000/comments")
        .send({
          username: "butter_bridge",
          body: "That article for so thought-provoking!"
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Input value not found");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("delete the given comment by comment_id", () => {
    test("DELETE 204: it should delete a comment when given its ID", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return request(app).get("/api/comments/1").expect(404);
        });
    });
    test("400: responds with error when invalid id is input", () => {
      return request(app)
        .delete("/api/comments/apple")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("404: responds with error when id currently does not exist", () => {
      return request(app)
        .delete("/api/comments/9001")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Comment does not exist");
        });
    });
  });
});

describe("/api/users", () => {
  describe("should get an array of all users", () => {
    test("GET 200: sends an array of user objects with the correct properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const { users } = response.body;
          expect(Array.isArray(users)).toBe(true);
        });
    });
    test("200: each user object should have the correct properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const { users } = response.body;

          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
  });
});
