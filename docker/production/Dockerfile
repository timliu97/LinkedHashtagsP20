# For Linkedhashtag

FROM ubuntu
MAINTAINER XUZhengyi zhengyi.xu@utt.fr

# Install MongoDB
# For Ubuntu 16.04
# && echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list

# Copy libs and code into the docker
COPY ./libs/* /libs/
COPY ./Linkedhashtag_bundle.tar.gz /code/
COPY ./LinkedHashtags_thrift_RPC.out /thrift/

# Install node/mongodb/supervisor
RUN chmod 777 /thrift/LinkedHashtags_thrift_RPC.out \
  && apt-get update \
  && export DEBIAN_FRONTEND=noninteractive \
  && apt-get install -y tzdata \
  && ln -fs /usr/share/zoneinfo/Europe/Paris /etc/localtime \
  && dpkg-reconfigure --frontend noninteractive tzdata \
  && apt-get install -y curl tar supervisor\
  && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
  && apt-get install -y nodejs \
  && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4 \
  && echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list \
  && apt-get update \
  && apt-get install -y mongodb-org=4.0.10 mongodb-org-server=4.0.10 mongodb-org-shell=4.0.10 mongodb-org-mongos=4.0.10 mongodb-org-tools=4.0.10 \
  && cd /code \
  && tar -xf ./Linkedhashtag_bundle.tar.gz \
  && rm Linkedhashtag_bundle.tar.gz \
  && cd ./bundle/programs/server \
  && npm install \
  && cd ../ \
  && rm -rf /var/lib/apt/lists/*

# Copy supervisor conf file
COPY ./supervisord-mongodb.conf /etc/supervisor/conf.d/supervisord-mongodb.conf
COPY ./supervisord-meteor.conf /etc/supervisor/conf.d/supervisord-meteor.conf
COPY ./supervisord-thrift.conf /etc/supervisor/conf.d/supervisord-thrift.conf

# Set env var
ENV LD_LIBRARY_PATH="/libs"
ENV MONGO_URL="mongodb://127.0.0.1:27017/meteor"
ENV METEOR_SETTINGS="{ \"twitter_api\": { \"consumer_key\": \"EXF4YGRncfKHkW4plpWqkhGtZ\", \
                     \"consumer_secret\": \"y2qwCcTwrX47ajIYEAvMZWSndKOHoL52nynbRklwfpL0YuRGzS\", \
                     \"access_token\": \"837434678445506560-2ldjgzJG5ZzQ8hT3CkSjXvOgDuqpc9t\", \
                     \"access_token_secret\": \"odaEHv9LDdiU51W99sKhSu3l1x4J5jZMvutjBgKfEr6B5\" }, \
                     \"public\": { \"stream\": { \"count_limit\": 1000, \"save_every\": 10 }, \
                     \"search\": { \"count_limit\": 2000 } } }"
ENV PORT="3000"
ENV ROOT_URL="https://linkedhashtag.bigdatahub.fr"

# Others
VOLUME ["/data", "/log", "/download"]
EXPOSE 3000
CMD ["supervisord", "-n"]
