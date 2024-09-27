

# docker buildx create --use

docker buildx build --platform linux/amd64 -t roster90/enteral-mini-app-api:0.1.0 --load .

docker buildx build --platform linux/amd64,linux/arm64 -t roster90/enteral-mini-app-api:0.1.0 --push .

docker push roster90/enteral-mini-app-api:0.1.0