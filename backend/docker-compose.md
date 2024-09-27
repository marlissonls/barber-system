## MongoDB Reutilização de dados salvos em volumes

- docker-compose.yml
```
version: '3.8'

services:
  mongodb:
    image: mongo:4.4
    container_name: ecommerce_mongodb_second
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  mongodb_consumer:
    image: mongo:4.4
    container_name: ecommerce_mongodb_consumer
    volumes:
      - mongodb_data:/data/db
    command: ["tail", "-f", "/dev/null"]

volumes:
  mongodb_data:
```

- terminal
```
docker compose up -d
docker exec -it ecommerce_mongodb_second mongo
```

- mongo
```
use mydatabase
db.mycollection.find()
```

- mongo
```
use mydatabase
db.mycollection.insertOne({ name: "John", age: 30 })
exit
```

- terminal
```
// Deletar apenas o container
docker stop ecommerce_mongodb
docker rm ecommerce_mongodb ou ID

// Deleta container e imagem
docker stop ecommerce_mongodb
docker-compose down
```