# json-faker
A simple smart json-faker, nothing more <br/>
Just put your json files in the mocks folder of the project and they will automatically be hosted on: <br/>
http://localhost:8099/file-name
You can also create subfolders and create json inside of them.
For example create under mocks/ a folder named api/, inside of it create a folder named v1/ and put json in it:
http://localhost:8099/api/v1/file-name

## Run it from the source
```sh
node app.js
```

## Docker

You can simply run it with the following command:
```sh
docker-compose -f docker/docker-compose/docker-compose.yml up
```

For local development run this commands:
```sh
docker build -t json-faker .
docker run -p 8099:8099 -v ~/mocks:/usr/src/app/mocks -d json-faker
```

## License

MPL-2.0

## GitHub
You can find it on the [public repository](https://github.com/valenz97/json-faker) on GitHub
