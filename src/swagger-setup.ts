import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


export const swaggerSetup= (app: any)=>{

    const config = new DocumentBuilder()
    .setTitle('Mini game  API Docs')
    .setDescription('The mini game Kingdoms API description')
    .setVersion('1.0.1')
    .addTag('Mini game Kingdoms API')
    .addBearerAuth()
    .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/docs', app, document);
}