import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

export default (app: any) => {

    const options = {
        swaggerDefinition: {
            info: {
                title: 'appName API Documentation',
                version: '1.0.0',
            },
            basePath: `${global['gConfig'].API_PREFIX + 'v1'}`,
            securityDefinitions: {
                bearerAuth: {
                    type: 'apiKey',
                    name: 'Authorization',
                    scheme: 'bearer',
                    in: 'header',
                },
            },
        },
        apis: [path.resolve(__dirname, '../routes/v1/route.js')],
    };

    const specs = swaggerJSDoc(options);

    app.use(`${global['gConfig'].API_PREFIX}api-docs`, swaggerUi.serve, swaggerUi.setup(specs));

};
