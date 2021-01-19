cat ./js/lib/*.js > build/lib.js
cat ./js/editor/*.js > build/editor.js
cat ./js/tools/*.js > build/tools.js
cat ./css/*.css > build/build.css
scp -r ../client/ ericd@lucid-detroit.com:~/Domain/client/