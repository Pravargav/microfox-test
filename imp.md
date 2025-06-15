1) pnpx turbo gen workspace --name @repo/my-sdkk --type package ( creates new package folder and package.json for that specific folder)

2) pnpm install ( create node_modules inside created package) 

3) npm init -y

4) Production dependencies
npm install zod

 Development dependencies  
npm install -D @types/node tsup typescript@5.6.3


5) Open Git Bash and run:
mkdir -p src/{types,schemas}
touch src/index.ts src/types/index.ts src/schemas/index.ts


