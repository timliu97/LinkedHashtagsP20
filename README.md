# Linkedhashtags

LinkedHashtags is a Web App that allows researchers to collect and display social media
hashtags (Twitter and Instagram) in order to monitor trends and better understand social
interactions.

The Web App is built using [Meteor](https://www.meteor.com/), a Node.js framework
and [MongoDB](https://www.mongodb.com/), a document-oriented NoSQL database.

Now all the data is processed in C++ program, we use [Apache thrift](https://thrift.apache.org/) to connect them.

Finally, LinkedHashtags uses [React](https://reactjs.org/), a javascript library for
building user interfaces and [Material-UI](http://www.material-ui.com/) to implement
Google's Material design.

## Table of contents

-   [Setting up the production environment](#setting-up-the-production-environment)
-   [Setting up the development environment](#setting-up-the-development-environment)
-   [Run the application](#run-the-application)
-   [Code structure](#code-structure)
-   [Versioning](#versioning)
-   [Creators](#creators)
-   [Copyright and license](#copyright-and-licence)

## Setting up the production environment

**This will use Docker**

### Compile the meteor project to bundle and compile the thrift program in development docker environment

1.  Go to the project folder, and run the following instruction (In development docker):
    ```bash
    meteor build ../
    ```
2.  Copy the bundle file to ./docker/production/
    ```bash
    mv ../APP_NAME.tar.gz ./docker/production/Linkedhashtag_bundle.tar.gz
    ```
3.  Copy the thrift service file (Compile it in development docker):
    ```bash
    # Compile instruction (Go to the ./thrift/LinkedHashtags_thrift_RPC/)
    g++ -o ./LinkedHashtags_thrift_RPC.out -I/usr/local/include/thrift -I/usr/include/boost  -I/usr/local/include/mongocxx/v_noabi  -I/usr/local/include/bsoncxx/v_noabi  -L/usr/local/lib  main.cpp ./service_types.cpp ./service_constants.cpp ./LinkedHashtagsService.cpp ./GraphDataCalculator.cpp ./StreamManager.cpp ./EventManager.cpp -lthrift -lthriftnb -lthriftz -lmongocxx -lbsoncxx -Wl,-rpath /usr/local/lib
    # Copy it to ./docker/production/
    mv ./thrift/LinkedHashtags_thrift_RPC/LinkedHashtags_thrift_RPC.out ./docker/production/
    ```

### Build docker image

1.  Run docker build:
    ```bash
    cd ./docker/production
    docker build -f ./Dockerfile .
    ```

### Run the docker container

1.  Creat your data and log folder.
2.  Run container:
    ```bash
    # Check your docker image hash
    docker images
    # Run
    docker run -p "3000:3000" -v /DATABASE_DIR:/data -v /LOG_DIR:/log -d IMAGE_HASH
    ```

**Then you can set up your nginx server**

## Setting up the development environment

**This program must run on Linux or you want to build all the package on Windows.**

You have two ways to setup your development environment:

### Setup manually (Not recommended)

1.  Install [Node.js and npm](https://nodejs.org/en/)
2.  Install [MongoDB](https://docs.mongodb.com/manual/installation/)
3.  Install [Meteor](https://www.meteor.com/install)
4.  Install [environment for thrift](https://thrift.apache.org/docs/install/) for build the `Apache thrift`.
5.  Build and Install the [Apache thrift](https://thrift.apache.org/docs/BuildingFromSource)
6.  Build and Install the [MongoDB C Driver 1.11.0](http://mongoc.org/libmongoc/current/installing.html)
7.  Build and Install the [mongocxx driver v3](https://mongodb.github.io/mongo-cxx-driver/mongocxx-v3/installation/)
8.  Or you can contact me to get the virtual disk file for the virtual machine already installed all the environment.

### Use Docker (Recommended)

1.  Install [Docker](https://docs.docker.com/install/) on your computer.
2.  Check the docker image (Download it [here](https://drive.google.com/file/d/1O8JSEGjFwci4VNLe5qHZ7FeJEabxwvMO/view?usp=sharing) and put it into ./docker/development/Linkedhashtag_docker_development.tar) and load into your docker.
    ```bash
    # Load the image into the docker
    docker load -i ./docker/development/Linkedhashtag_docker_development.tar
    ```
3.  This docker will mount 3 [Volumes](https://docs.docker.com/storage/volumes/):

    -   /code : Store the source code.
    -   /data : For mongodb to store the data.
    -   /log : Store the log file.  
    -   /download : Store the Full tweets tar files for download use.

    After add the docker image, we can run a docker container with the image.

    ```bash
    # Run docker container
    docker run -p "3000:3000" -t -i -v /home/YOUR_CODE_DIR:/code b41a8185d6f5
    ```

4.  Then the docker will start a bash promote, you can use it to do any development things as on your host machine.

    **How to run this program in docker bash**

    ```bash
    # Set meteor Mongodb env
    export MONGO_URL=mongodb://127.0.0.1:27017/meteor
    # Set allow root user env
    export METEOR_ALLOW_SUPERUSER=true
    # Compile thrift (Go to the ./thrift/LinkedHashtags_thrift_RPC/)
    g++ -o ./LinkedHashtags_thrift_RPC.out -I/usr/local/include/thrift -I/usr/include/boost  -I/usr/local/include/mongocxx/v_noabi  -I/usr/local/include/bsoncxx/v_noabi  -L/usr/local/lib  main.cpp ./service_types.cpp ./service_constants.cpp ./LinkedHashtagsService.cpp ./GraphDataCalculator.cpp ./StreamManager.cpp ./EventManager.cpp -lthrift -lthriftnb -lthriftz -lmongocxx -lbsoncxx -Wl,-rpath /usr/local/lib
    # Run mongodb
    nohup mongod --dbpath=/data > /log/mongodb.log 2>&1 &
    # Run thrift service
    nohup ./thrift/LinkedHashtags_thrift_RPC/LinkedHashtags_thrift_RPC.out > /log/thriftlog.log 2>&1 &
    # Run meteor
    meteor run --settings settings.json --port 3000
    ```

## Run the application

-   Make sure MongoDB is running:

    ```bash
    # To start it in Ubuntu or Debian
    sudo service mongod start

    # For Windows or MacOS
    mongod
    ```

-   Before running the project the first time :

    -   go on the root of the project and run:

        ```bash
        # Install all project dependencies
        meteor npm install
        ```

    -   Compiling C++ programs:

        Go to the `./LinkedHashtags_thrift_RPC` and build it with `g++`

        ```bash
        g++ -o ./LinkedHashtags_thrift_RPC.out -I/usr/local/include/thrift -I/usr/include/boost  -I/usr/local/include/mongocxx/v_noabi  -I/usr/local/include/bsoncxx/v_noabi  -L/usr/local/lib  main.cpp ./service_types.cpp ./service_constants.cpp ./LinkedHashtagsService.cpp ./GraphDataCalculator.cpp ./StreamManager.cpp ./EventManager.cpp -lthrift -lthriftnb -lthriftz -lmongocxx -lbsoncxx -Wl,-rpath /usr/local/lib
        ```

    -   Create a `settings.json` file using `setting.json.dist` and finally run:

        `meteor --settings settings.json`

-   Run the cpp service program

    `./LinkedHashtags_thrift_RPC.out`

-   Meteor server is running on: <http://localhost:3000>.

## Code structure

    .
    ├── .meteor/          # internal Meteor files
    ├── client/
    │   └── main.jsx       # client entry point, imports all client code
    ├── server/
    │   └── main.jsx       # server entry point, imports all server code
    ├── thrift/     
    │   └── gen-cpp/  # thrift generated cpp code
    |   └── gen-nodejs/  # thrift generated nodejs code
    |   └── LinkedHashtags_thrift_RPC/  # cpp backend code
    |   └── service.thrift   # thrift service description file
    |   └── thriftClient.js  # thrift client for nodejs
    ├── .gitignore        # a control file for git
    ├── bootstrap.sh      # bash file used to install virtual environment requirements
    ├── package.json      # meta data and list of dependencies of project
    └── Vagrantfile       # config file for virtual environment

The structure of the C++ program like this.

-   Whole structure

    ![Structure program](/imgs/structure.png)

-   Simple structure for C++ class

    ![Structure program](/imgs/simple_s_cpp.png)

## Versioning

LinkedHashtags is maintained under [the Semantic Versioning guidelines](http://semver.org/).

## Creators

This is a research project for the [University of Technology of Troyes (UTT)](http://www.utt.fr/)

**Researcher:**

-   [Babiga Birregah](https://github.com/BabigaBirregah)

**Developper:**

-   [Yassine Doghri](https://github.com/yassinedoghri)
-   [XU Zhengyi](https://github.com/xuzhengyi1995)
-   [Qishu LIU](https://github.com/timliu97)

## Copyright and licence

Copyright © 2018 Babiga Birregah. All rights reserved.
