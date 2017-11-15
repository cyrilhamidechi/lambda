echo 'Name of the new lambda to create: '
read lambda

[ -d $lambda ] &&  echo Project already exists

mkdir $lambda
cd $lambda
cp -r ../template/* ./

mkdir logs

cd src
yarn init

cd ../
./run.sh
