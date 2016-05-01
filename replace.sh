# grep -rl 'showLoadingMoreMask' ./ --exclude-dir=".git"  --exclude-dir="build" --exclude-dir="lib" | xargs sed -i ''  's,showLoadingMoreMask,appendLoadingMoreSpinner,g'

# https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep


function search() {
  local keyword=${1}
  local dir=${2}
  grep -rn "$keyword" "$dir"
}

function replace() {
  local keyword=${1}
  local substitution=${2}
  local dir=${3}
  grep -rl "$keyword" $dir --exclude-dir=".git"  --exclude-dir="build" --exclude-dir="lib" | xargs sed -i ''  "s,${keyword},${substitution},g"
}

function usage() {
  echo "usage: replace <keyword> <substitution> <dir>"
}

if (($# < 3)); then
  usage
  exit 1
fi

# echo "start"
replace ${1} ${2} ${3}