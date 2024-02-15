# Coin Tab Assignment

Welcome to Coin Tab Assignment! This project serves as a web tool for managing and maintaining user data and their posts.

## Table of Contents

- [Backend](#backend)
  - Node.js
  - MySQL
  - Express.js
- [Frontend](#frontend)
  - React + Vite
  - Bootstrap

## Installation

```bash
npm i 
node index.js
```

## Usage

In this project, users can view user data in tabular form, add specific user data to a MySQL database using Node.js, and download user posts in an Excel worksheet.

## Backend

### Routes

| Route   | Method | Description                          |
|---------|--------|--------------------------------------|
| /users/       | GET    | Retrieve users from the database     |
| /users/       | POST   | Add a user to the database           |
| /posts/add    | POST   | Add posts of the user to the database|
| /posts/download | GET  | Download user's posts in Excel format|

## Screenshots
### Home Page
![Home Page 1](https://github.com/THEPRANAYMISHRA/cointab_assignment/assets/115460435/0ea9be92-4651-46ae-90ca-cdb7d2361dac)
![Home PAGE 2](https://github.com/THEPRANAYMISHRA/cointab_assignment/assets/115460435/7792d3a9-5a31-42b8-b3d8-f01420ea65dc)
### Post Page
![Post Page](https://github.com/THEPRANAYMISHRA/cointab_assignment/assets/115460435/ea723f94-cc10-4634-b153-8bbdc77b8066)
### Download Section
![Download In Excel](https://github.com/THEPRANAYMISHRA/cointab_assignment/assets/115460435/baf0ef5c-01c1-4426-b4a2-ba9fb583a62d)

