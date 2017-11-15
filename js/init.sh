echo 'Name of the project: '
read project

[ -d $project ] &&  echo Project already exists

mkdir $project
cd $project
mkdir src
cd src
yarn init
