# Link Shortener Frontend

## Introduction

This is the frontend for the link-shortener application built as an assignment for FarMart. It is built using NextJS.

## Features

This application supports the following features:

- User authentication: Users can create their own account using their emailId and password.
- File upload: Users(both authorized and unauthorized) can upload files(only images of type jpegs,pngs and gifs of upto 5MB) and the service will upload it on an S3 storage.
- Bit.ly link generation: The service will provide a Bit.ly link to access the uploaded file.
- User dashboard: Authenticated users can see all their generated links and uploaded files.
- Delete uploaded files: Authenticated users can delete their uploaded files.

## Features I wanted to implement but couldn't because of time constraints

- Auto delete files after a set amount of time which can be fixed for unauthenticated users, and configurable for authenticated users.
- Protect against cross-site scripting (XSS) and cross-site request forgery (CSRF) attacks. I have not implemented these protections before, and would have liked to explore how it is done in a production setting.

#### This application is hosted on :

#### You can find the backend repository on: https://github.com/aaaaayushh/link-shortener-backend

#### Run locally

To run this application locally:

1. Clone this repository on your device.
2. Install the dependencies using the command `npm i`(You will require Node installed on your device to run this application)
3. Create an .env file and set the following environment variables:
   - NEXT_PUBLIC_SERVER: url of the backend service.
   - NEXT_PUBLIC_MONGODB_URI: url of your mongodb instance.(You can either host it locally or use Atlas)
   - NEXT_PUBLIC_MONGODB_DB: name of your database.
   - NEXT_AUTH_SECRET: use a random string as the secret for the next-auth package.
4. Once the dependencies are installed, run using `npm run dev`
