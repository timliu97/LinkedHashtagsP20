# For Linkedhashtag

FROM ubuntu
MAINTAINER XUZhengyi zhengyi.xu@utt.fr

# Install MongoDB
# For Ubuntu 16.04
# && echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list

RUN apt-get update \
  && export DEBIAN_FRONTEND=noninteractive \
  && apt-get install -y tzdata \
  && ln -fs /usr/share/zoneinfo/Europe/Paris /etc/localtime \
  && dpkg-reconfigure --frontend noninteractive tzdata \
  && apt-get install -y build-essential curl wget tar\
  && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
  && apt-get install -y nodejs \
  && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4 \
  && echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list \
  && apt-get update \
  && apt-get install -y mongodb-org=4.0.10 mongodb-org-server=4.0.10 mongodb-org-shell=4.0.10 mongodb-org-mongos=4.0.10 mongodb-org-tools=4.0.10 \
  && curl https://install.meteor.com/ | sed s/--progress-bar/-sL/g | sh \
  && apt-get install -y automake bison flex g++ git libboost-all-dev libevent-dev libssl-dev libtool make pkg-config \
  && wget -q http://miroir.univ-lorraine.fr/apache/thrift/0.12.0/thrift-0.12.0.tar.gz \
  && tar -xzf ./thrift-0.12.0.tar.gz \
  && cd ./thrift-0.12.0 \
  && ./bootstrap.sh \
  && ./configure --without-python --without-py3 --without-c_glib \
  && make \
  && make install \
  && cd ../ \
  && apt-get install -y libmongoc-1.0-0 \
  && apt-get install -y libbson-1.0 \
  && apt-get install -y cmake libssl-dev libsasl2-dev \
  && wget -q https://github.com/mongodb/mongo-c-driver/releases/download/1.14.0/mongo-c-driver-1.14.0.tar.gz \
  && tar xzf mongo-c-driver-1.14.0.tar.gz \
  && cd mongo-c-driver-1.14.0 \
  && mkdir cmake-build \
  && cd cmake-build \
  && cmake -DENABLE_AUTOMATIC_INIT_AND_CLEANUP=OFF .. \
  && make \
  && make install \
  && cd ../../ \
  && git clone -q https://github.com/mongodb/mongo-cxx-driver.git --branch releases/stable --depth 1 \
  && cd mongo-cxx-driver/build \
  && cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/usr/local .. \
  && make EP_mnmlstc_core \
  && make \
  && make install \
  && cd ../

VOLUME ["/data", "/code", "/log", "/download"]
EXPOSE 3000
CMD ["/bin/bash"]
