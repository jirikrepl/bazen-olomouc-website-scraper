FROM buildkite/puppeteer:10.0.0
ENV TZ="Europe/Prague"
# RUN apk add --no-cache python2 g++ make
WORKDIR /bazen-olomouc
COPY . .
RUN npm install --production
CMD ["node", "src/index.js"]
