# npm install
git rm --cached .env
git rm --cached -r downloads/
git commit -m "Remove sensitive files from tracking"

npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all