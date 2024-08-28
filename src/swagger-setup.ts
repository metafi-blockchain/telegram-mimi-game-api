import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


export const swaggerSetup= (app: any)=>{

    const config = new DocumentBuilder()
    .setTitle('Gize Dao API Docs')
    .setDescription('The Gize Dao API description')
    .setVersion('1.0.1')
    .addTag('Gize Dao')
    .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/docs', app, document);
}