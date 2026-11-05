import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference, NestJSReferenceConfiguration } from "@scalar/nestjs-api-reference";

export type ScalarTheme = NestJSReferenceConfiguration["theme"];

export interface IScalarOptions {
    version: string;
    theme: ScalarTheme;
}

export class APIContractConfiguration {
    public static setup(
        _app: INestApplication<unknown>,
        { version, theme }: IScalarOptions,
    ): void {
        const options = new DocumentBuilder()
            .setTitle("UDVStudentApp API")
            .setDescription("UDV student images management system for UDVStudentApp")
            .setVersion(`/api/${version}`)
            .addTag("Auth")
            .build();

        const document = SwaggerModule.createDocument(_app, options);
        _app.use(
            "/api/docs",
            apiReference({
                theme: theme,
                content: document,
                metaData: {
                    title: "UDVStudentApp API",
                    ogDescription: "UDV student images management system for UDVStudentApp",
                },
            }),
        );
    }
}