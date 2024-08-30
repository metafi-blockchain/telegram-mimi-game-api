import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


export const swaggerSetup= (app: any)=>{

    const config = new DocumentBuilder()
    .setTitle('Marketplace  API Docs')
    .setDescription('The Marketplace  API description')
    .setVersion('1.0.1')
    .addTag('Marketplace')
    .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/docs', app, document);
}