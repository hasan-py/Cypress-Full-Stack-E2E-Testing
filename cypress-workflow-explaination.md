## Understand the Workflow in 10 Steps

This workflow automates the process of running Cypress end-to-end tests on your project, which consists of a Node.js backend (server) and a Vite-powered frontend (client). The workflow is triggered on pushes and pull requests made to the master branch.

You will find the workflow file in: `.github/workflows/cypress.yml`

### Breakdown of the Workflow:

#### 1. Workflow Triggers

The workflow will be triggered by:
A push event to the master branch.
A pull request event to the master branch.

````yaml
on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master```
````

#### 2. Job: cypress

The cypress job is defined to run on the latest Ubuntu virtual environment (ubuntu-latest).

````yaml
jobs:
  cypress:
    runs-on: ubuntu-latest```
````

#### 3. MongoDB Service Setup

A MongoDB service container (version 5.0) is started as part of the workflow. The service maps port 27018 on the host to port 27017 in the container.
The health check ensures the MongoDB service is ready before proceeding with the tests by using the MongoDB ping command. Here we replace the default port because when it run in the service it take that port. So our db start on another port.

````yaml
services:
  mongodb:
    image: mongo:5.0
    ports:
      - 27018:27017
    options: >-
      --health-cmd="mongo --eval 'db.adminCommand({ ping: 1 })' --quiet"
      --health-interval=10s
      --health-timeout=5s
      --health-retries=3```
````

#### 4. Checkout Code

This step uses the actions/checkout@v3 action to pull the latest version of the code from the repository.

```yaml
- name: Checkout code
  uses: actions/checkout@v3
```

#### 5. Set up Node.js

The actions/setup-node@v3 action sets up Node.js version 20 for the job.

```yaml
- name: Set up Node.js
  uses: actions/setup-node@v3
  with:
  node-version: "20"
```

#### 6. Install Server Dependencies

Installs the Node.js dependencies for the server (backend) by running npm install inside the server directory.

````yaml
- name: Install server dependencies
  working-directory: ./server
  run: npm install```
````

#### 7. Start the Server

The backend server is started with npm start in the background. A while loop checks whether the server is running on port 8000 before proceeding.

````yaml
- name: Start the project server
  working-directory: ./server
  run: |
    npm start &
    while ! nc -z localhost 8000; do
      sleep 5
    done
  env:
    MONGODB_URI_LOCAL: mongodb://127.0.0.1:27018/gameZonex
    JWT_SECRET: gameZonex```
````

##### Environment variables:

- MONGODB_URI_LOCAL: MongoDB connection string, mapped to port 27018 (as configured in the services).
- JWT_SECRET: Secret key used for JWT authentication in the backend.

#### 8. Install Client Dependencies

Installs the Node.js dependencies for the client (frontend) by running npm install inside the client directory.

````yaml
- name: Install client dependencies
  working-directory: ./client
  run: npm install```
````

#### 9. Start the Vite Dev Server

The Vite development server is started with npm run dev in the background.
A while loop checks whether the Vite server is running on port 5173 before proceeding.

```yaml
- name: Run the client project
  working-directory: ./client
  run: |
    npm run dev &
    while ! nc -z localhost 5173; do
      sleep 5
    done
```

#### 10. Run Cypress Tests

Runs the Cypress tests with npm run cy:test inside the client directory.
The BASE_URL environment variable is set to the backend URL (http://localhost:8000), allowing Cypress to communicate with the backend server.

```yaml
- name: Run Cypress tests
  working-directory: ./client
  run: npm run cy:test
  env:
    BASE_URL: http://localhost:8000
```

#### Full Code:

```yml
name: Run Cypress Tests

on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master

jobs:
  cypress:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:5.0
        ports:
          - 27018:27017 # Mapping port 27018 on the host to 27017 in the container
        options: >-
          --health-cmd="mongo --eval 'db.adminCommand({ ping: 1 })' --quiet"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install server dependencies
        working-directory: ./server
        run: npm install

      - name: Start the project server
        working-directory: ./server
        run: |
          echo "Starting the server from the /server folder..."
          npm start &
          echo "Waiting for the server to be ready..."
          while ! nc -z localhost 8000; do
            echo "Waiting for server..."
            sleep 5
          done
        env:
          MONGODB_URI_LOCAL: mongodb://127.0.0.1:27018/gameZonex
          JWT_SECRET: gameZonex

      - name: Install client dependencies
        working-directory: ./client
        run: npm install

      - name: Run the client project
        working-directory: ./client
        run: |
          echo "Starting Vite dev server in the background..."
          npm run dev &
          echo "Waiting for Vite server to be ready..."
          while ! nc -z localhost 5173; do
            sleep 5
          done

      - name: Run Cypress tests
        working-directory: ./client
        run: |
          echo "Running Cypress tests..."
          npm run cy:test
        env:
          BASE_URL: http://localhost:8000
```

#### Key Points:

- MongoDB is run as a service within the workflow.
- The backend server waits until it's fully up and running before moving forward.
- The Vite frontend server is also started in the background.
- Cypress tests run once both backend and frontend services are ready.

---

Build with ❤️ by Hasan
