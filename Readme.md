# Bazén Olomouc
![bazen olomour](website.png)

Periodically scrape occupied places from Olomouc swimming pool website. Send data to Google Analytics.

## Docker dev

    docker build -t bazen-olomouc .

    docker run -d --name bazen-olomouc --restart always bazen-olomouc 

    docker exec -it bazen-olomouc bash      

    docker logs -f bazen-olomouc

    docker stop bazen-olomouc && docker rm bazen-olomouc && docker run -d --name bazen-olomouc --restart always bazen-olomouc

## Docker prod

    docker push jirikrepl/bazen-olomouc:0.1

    docker pull jirikrepl/bazen-olomouc:0.1

    docker stop bazen-olomouc && docker rm bazen-olomouc && docker run -d --name bazen-olomouc --restart always jirikrepl/bazen-olomouc:0.1
