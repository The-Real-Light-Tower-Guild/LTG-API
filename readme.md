### The Real Light Tower Guild API 
The backend api for Light Tower Guild

## Secret Keys 
In the config folder create a config.env file and in this file add this
Make sure to add the mongo URI to the MONGO_URI variable
JWT_SECRET can be changed to whatever you wish

```
    NODE_ENV=development
    PORT=5000
    MONGO_URI=

    FILE_UPLOAD_PATH=./public/uploads
    MAX_FILEUPLOAD=1000000

    JWT_SECRET=ewhru3948h38vhn39o2
    JWT_EXPIRE=30d
    JWT_COOKIE_EXPIRE=30
```

## Installation 
```
    npm install 
```

## Seed Database
Load database with test data 
```
node seeder -import
```

Delete the test data
```
node seeder -delete
```


