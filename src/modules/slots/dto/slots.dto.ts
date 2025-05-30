import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, IsDateString } from "class-validator";

export class SlotsDto {
    @ApiProperty({
        description: 'ID del slot',
        example: '60c72b2f9b1d8c001c8e4f3a'
    })
    @IsOptional()
    @IsString()
    _id?: string;

    @ApiProperty({
        description: 'Estado',
        example: 'active'
    })
    @IsString()
    state?: string;

    @ApiProperty({
        description: 'Valida si el juego pertenece a Sisplay',
        example: 'true'
    })
    @IsOptional()
    @IsBoolean()
    isSisplay?: boolean;

    @ApiProperty({
        description: 'gameCode',
        example: 'game123'
    })
    @IsOptional()
    @IsString()
    gameCode?: string;

    @ApiProperty({
        description: 'Titulo del juego',
        example: 'Juego de Slots'
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        description: 'Código del canal de integración',
        example: 'BETSOFT'
    })
    @IsOptional()
    @IsString()
    integrationChannelCode?: string;

    @ApiProperty({
        description: 'Indica si el cliente es Flash',
        example: true
    })
    @IsOptional()
    @IsBoolean()
    flashClient?: boolean;

    @ApiProperty({
        description: 'Texto del botón',
        example: 'kasjdla'
    })
    @IsOptional()
    @IsString()
    buttonText?: string;

    @ApiProperty({
        description: 'URL de la imagen destacada',
        example: 'http://localhost:9002/slots/66f3224cbe54fc4ef8f10ed3.png'
    })
    @IsOptional()
    @IsString()
    feature?: string;

    @ApiProperty({
        description: 'Parámetro adicional',
        example: ''
    })
    @IsOptional()
    @IsString()
    additionalParam?: string;

    @ApiProperty({
        description: 'URL de la demo del juego',
        example: ''
    })
    @IsOptional()
    @IsString()
    urlDemo?: string;

    @ApiProperty({
        description: 'Tipo de URL de la demo del juego',
        example: 'serviceUrl'
    })
    @IsOptional()
    @IsString()
    typeDemoGameUrl?: string;

    @ApiProperty({
        description: 'ID de la categoría',
        example: '6193a9954678e01a434a1f97'
    })
    @IsOptional()
    category?: any;

    @ApiProperty({
        description: 'Título alternativo',
        example: 'kljdsakljsdal'
    })
    @IsOptional()
    @IsString()
    titulo?: string;

    @ApiProperty({
        description: 'ID del juego',
        example: 'asdasgfasda'
    })
    @IsOptional()
    @IsString()
    gameId?: string;

    @ApiProperty({
        description: 'Indica si es un micrositio',
        example: true
    })
    @IsOptional()
    @IsBoolean()
    microSite?: boolean;

    @ApiProperty({
        description: 'Fecha de creación/actualización',
        example: '2024-09-24T20:34:20.000Z'
    })
    @IsOptional()
    @IsDateString()
    date?: any;

    @ApiProperty({
        description: 'Orden de clasificación',
        example: -961
    })
    @IsOptional()
    @IsNumber()
    sort?: number;

    @ApiProperty({
        description: 'Nombre del archivo de reglas',
        example: '1727210060521-Formato pruebas Unitarias - PD-4006 - Lojas Fisicas.pdf'
    })
    @IsOptional()
    @IsString()
    roules?: string;

    @ApiProperty({
        description: 'Versión del documento (MongoDB)',
        example: 0
    })
    @IsOptional()
    @IsNumber()
    __v?: number;

    @ApiProperty({
        description: 'Descripción del banner del juego',
        example: '1 Juego de la Seleccion'
    })
    @IsOptional()
    @IsString()
    bannerDescription?: string;

    @ApiProperty({
        description: 'Texto alternativo para imágenes',
        example: 'alt'
    })
    @IsOptional()
    @IsString()
    alt?: string;

    @ApiProperty({
        description: 'Etiquetas asociadas al slot',
        example: ['Prueba tag', 'Ver todos', 'promociones'],
        type: [String]
    })
    @IsOptional()
    tags?: any;

    @ApiProperty({
        description: 'Subtítulo de la descripción del juego',
        example: '3 Juego de la Seleccion'
    })
    @IsOptional()
    @IsString()
    gDescSubtitle?: string;

    @ApiProperty({
        description: 'Texto de la descripción del juego',
        example: '4 el mejor juego de todos llega a BetPlay'
    })
    @IsOptional()
    @IsString()
    gDescText?: string;

    @ApiProperty({
        description: 'Título de la descripción del juego',
        example: '2 Participa en el juego de la sele'
    })
    @IsOptional()
    @IsString()
    gDescTitle?: string;

    @ApiProperty({
        description: 'Banner del micrositio',
        example: '/api/slots/msBanner_test.jpeg'
    })
    @IsOptional()
    @IsString()
    msBanner?: string;

    @ApiProperty({
        description: 'Banner modificado del micrositio',
        example: '/api/slots/msBannerMod_test.jpeg'
    })
    @IsOptional()
    @IsString()
    msBannerMod?: string;

    @ApiProperty({
        description: 'Descripción del juego en web',
        example: '6 el mejor juego de todos llega a BetPlay'
    })
    @IsOptional()
    @IsString()
    wGameDesc?: string;

    @ApiProperty({
        description: 'Título del juego en web',
        example: '5 Juego de la Seleccion'
    })
    @IsOptional()
    @IsString()
    wGameTitle?: string;

    @ApiProperty({
        description: 'Imágenes ilustrativas del micrositio',
        example: ['/api/slots/msIllustrative_0_test.jpeg', '/api/slots/msIllustrative_1_test.jpeg'],
        type: [String]
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    msIllustrative?: string[];
}