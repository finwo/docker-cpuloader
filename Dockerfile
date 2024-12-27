FROM node
COPY index.js /app/index.js
ENTRYPOINT [ "node", "/app/index.js" ]
