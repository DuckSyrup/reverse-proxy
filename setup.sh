sudo yum install git
git clone --depth 1 git://github.com/joyent/node.git
cd node
git checkout v0.6.2
sudo yum install openssl-devel
sudo yum install gcc
sudo yum install gcc-c++
./configure
make -j2
make install
export PATH=$PATH:/usr/local/bin:/usr/local
curl -LO  https://npmjs.org/install.sh | sudo sh
