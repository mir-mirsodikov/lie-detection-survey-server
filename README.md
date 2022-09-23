<h1>lie-detection-survey-server</h1>

- [Overview](#overview)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Checkout code locally](#checkout-code-locally)
    - [Install dependencies](#install-dependencies)
  - [Environmental variables](#environmental-variables)
  - [Database configuration](#database-configuration)
    - [Create database](#create-database)
    - [Generate Prisma client](#generate-prisma-client)
- [Build and Run](#build-and-run)
  - [NPM Commands](#npm-commands)
- [Technologies](#technologies)

# Overview

This is the server for the lie-detection-survey project. It is meant for the [lie-detection-survey-client](https://github.com/mir-mirsodikov/lie-detection-survey-client)

Paired with the client, the server does the following:
1. Logs admin into their account
2. Allows admin to create, edit, and delete survey prompts
3. Allows admin to download survey responses as a CSV file
4. Creates a survey participant and saves their responses to each prompt

# Getting started

## Prerequisites

- [Node.js](https://nodejs.org/en/)

## Installation

### Checkout code locally

``` bash
git clone https://github.com/mir-mirsodikov/lie-detection-survey-client
```

### Install dependencies

``` bash
npm install
```

## Environmental variables

| Variable Name | Description                  |
| ------------- | ---------------------------- |
| PORT          | Port to run the server on    |
| DATABASE_URL  | URL to the Postgres database |

## Database configuration

This project utilizes `prisma` and therefore requires an initial setup. 

### Create database

``` bash
npx prisma push
```

### Generate Prisma client

``` bash
npx prisma generate
```

# Build and Run

## NPM Commands

| Command         | Description                       |
| --------------- | --------------------------------- |
| `npm run build` | Build the server for production   |
| `npm start`     | Run the server in production mode |

# Technologies

- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Passport.js](http://www.passportjs.org/)
- [JsonWebToken](https://jwt.io/)
- [Prisma](https://www.prisma.io/)
