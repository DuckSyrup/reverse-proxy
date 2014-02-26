sudo yum -y install git
git clone --depth 1 git://github.com/joyent/node.git
cd node
git checkout v0.6.2
sudo yum -y install openssl-devel
sudo yum -y install gcc
sudo yum -y install gcc-c++
sudo yum -y install make
./configure
make -j2
make install
export PATH=$PATH:/usr/local/bin:/usr/local
curl -LO https://npmjs.org/install.sh
sudo visudo
sudo sh install.sh
