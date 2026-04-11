const { generateService } = require('@umijs/openapi');

generateService({
  schemaPath: 'http://localhost:8080/v3/api-docs', // 后端提供的 Swagger/OpenAPI 地址
  serversPath: './src/services',
  projectName: 'mallchat',
  requestLibPath: "import request from '@/services/request'", // 指定自定义请求导出路径
});
