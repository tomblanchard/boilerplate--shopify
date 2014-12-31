cd "$(dirname "$0")"
\rm -rf README.md
find . -name "*.emptydir" -delete
if [ ! -d node_modules ];then
  sudo npm install
fi
grunt