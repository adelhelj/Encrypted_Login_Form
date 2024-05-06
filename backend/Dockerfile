FROM golang:latest

ENV GOPROXY=direct

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]
