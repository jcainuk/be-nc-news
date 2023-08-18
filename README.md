# Northcoders News API

An API for managing articles, comments, users, and topics. Built with Express, Node.js, and PostgreSQL as my coursework assessment for the back-end module of the [Northcoders Software Engineering bootcamp](https://www.northcoders.com). This API allows users to interact with various endpoints to perform operations related to articles, comments, and users.

You can also interact with a live demo of the API by making requests to the following base URL:

https://nc-news-ry7t.onrender.com/api/articles

## Table of Contents

- [General Info](#general-info)
- [Available Endpoints](#available-endpoints)
- [Concepts](#concepts)
- [Technologies](#technologies)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Clone the Repository](#clone-the-repository)
- [Install Dependencies](#install-dependencies)
- [Create .env Files](#create-env-files)
- [Set Up Databases](#set-up-databases)
- [Seed Local Database](#seed-local-database)
- [Run Tests](#run-tests)
- [Start the Server](#start-the-server)
- [Status](#status)
- [Contact](#contact)

## General Info

This API provides a way to manage articles, comments, and users. It allows users to retrieve information about articles, comments, and users, as well as perform operations such as adding comments, updating votes on articles, and deleting comments.

The API is built using Express and Node.js, with data stored in a PostgreSQL database. The project emphasizes RESTful API design principles.

## Available Endpoints

- `GET /api`

  - Description: Serves up a JSON representation of all the available endpoints of the API

- `GET /api/topics`

  - Description: Serves an array of all topics
  - Example Response:
    ```json
    {
      "topics": [{ "slug": "football", "description": "Footie!" }]
    }
    ```

- `GET /api/articles`

  - Description: Serves an array of all articles
  - Example Response:
    ```json
    {
      "articles": [
        {
          "article_id": 1,
          "title": "Seafood substitutions are increasing",
          "topic": "cooking",
          "author": "weegembump",
          "created_at": "2018-05-30T15:59:13.341Z",
          "votes": 0,
          "comment_count": 6
        }
      ]
    }
    ```

- `GET /api/articles/:article_id/comments`

  - Description: Get all comments for an article
  - Example Response:
    ```json
    {
      "comments": [
        {
          "comment_id": 1,
          "votes": 10,
          "created_at": "2023-08-17T12:00:00.000Z",
          "author": "butter_bridge",
          "body": "This is a comment.",
          "article_id": 1
        }
      ]
    }
    ```

- `POST /api/articles/:article_id/comments`

  - Description: Add a comment to an article
  - Request Body:
    ```json
    {
      "username": "butter_bridge",
      "body": "Massive intercranial brain haemorrhage"
    }
    ```
  - Example Response:
    ```json
    {
      "comment": {
        "username": "butter_bridge",
        "body": "Massive intercranial brain haemorrhage",
        "votes": 0,
        "author": "icellusedkars",
        "article_id": 1,
        "created_at": 1583133000000
      }
    }
    ```

- `PATCH /api/articles/:article_id`

  - Description: Increase or decrease votes for an article
  - Request Body:
    Increase votes
    ```json
    {
      "inc_votes": 5
    }
    ```
    Decrease votes

  ```json
  {
    "inc_votes": -5
  }
  ```

  - Example Response:
    ```json
    {
      "updatedArticle": {
        "title": "Seafood substitutions are increasing",
        "topic": "cooking",
        "author": "weegembump",
        "created_at": "2018-05-30T15:59:13.341Z",
        "votes": 5,
        "comment_count": 6
      }
    }
    ```

- `DELETE /api/comments/:comment_id`

  - Description: Delete a comment by comment_id
  - Status Codes:
    - `204`: No content (successful deletion)
    - `404`: Not Found (comment not found)

- `GET /api/users`
  - Description: Get all users
  - Example Response:
    ```json
    {
      "users": [
        {
          "username": "butter_bridge",
          "name": "Maurice Moss",
          "avatar_url": "https://example.com/avatar/butter_bridge.jpg"
        }
      ]
    }
    ```

## Concepts

The API encompasses several concepts, including:

- RESTful API design
- Database schema design
- SQL querying and manipulation
- CRUD operations (Create, Read, Update, Delete)
- Data modeling, controllers and relationships (based on MVC pattern)
- Error handling, middleware and status codes (200, 201, 204, 400, 404, 500)

## Technologies

The API is built using the following technologies:

- Express
- Node.js
- PostgreSQL
- Git & GitHub

## Features

The API offers the following features:

- Retrieve a list of available endpoints
- Get topics and articles with various filtering options
- Retrieve comments for a specific article
- Add comments to articles
- Update votes on articles
- Delete comments
- Retrieve user information

## Prerequisites

Before you begin, make sure you have the following software installed on your machine:

- Node.js (minimum version: 14.x)
- PostgreSQL (minimum version: 13.x)

## Clone the Repository

```sh
git clone https://github.com/jcainuk/be-nc-news
cd be-nc-news

```

## Install dependencies

```
npm install

```

## Create .env Files

Create two `.env` files for development and testing environments:

1. Create a .env.development file in the project root and add the following database name exactly how it appears in the setup.sql file:

```env
PGDATABASE=nc_news


```

2. Create a .env.test file in the project root and add the following database name exactly how it appears in the setup.sql file:

```env
PGDATABASE=nc_news_test

```

For reference, the contents of the the setup.sql file are:

```
DROP DATABASE IF EXISTS nc_news_test;
DROP DATABASE IF EXISTS nc_news;

CREATE DATABASE nc_news_test;
CREATE DATABASE nc_news;
```

## Set Up Databases

To set up the databases, run:

```
npm run setup-dbs

```

## Seed Local Database

To seed the local database, run:

```
npm run seed

```

## Run tests

Run the tests using Jest:

```
npm test
npm test app

```

## Start the server

Start the server using:

```
npm start

```

## Status

Project is: In Progress

## Contact

Created by [@jcainuk](https://twitter.com/JCainuk) - feel free to reach out for inquiries and feedback.
