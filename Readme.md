# Bazén Olomouc

    docker build -t bazen-olomouc .

    docker run -d --name bazen-olomouc --restart always bazen-olomouc 

    docker exec -it bazen-olomouc bash      

    docker logs -f bazen-olomouc

    docker stop bazen-olomouc && docker rm bazen-olomouc && docker run -d --name bazen-olomouc --restart always bazen-olomouc
