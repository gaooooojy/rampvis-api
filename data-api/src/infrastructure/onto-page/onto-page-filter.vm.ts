import { IsOptional, IsEnum, IsString } from 'class-validator';
import { PUBLISH_TYPE } from './onto-page.interface';

export enum ONTOPAGE_SORT_BY {
    PUBLISH_TYPE = 'publishType',
    DATE = 'date',
}

export enum SORT_ORDER {
    ASC = 'asc',
    DESC = 'desc',
}

export class OntoPageFilterVm {
    @IsEnum(PUBLISH_TYPE)
    publishType!: PUBLISH_TYPE;

    @IsOptional()
    @IsString()
    page!: string;

    @IsOptional()
    @IsString()
    pageCount!: string;

    @IsOptional()
    @IsEnum(ONTOPAGE_SORT_BY)
    sortBy!: ONTOPAGE_SORT_BY;

    @IsOptional()
    @IsEnum(SORT_ORDER)
    sortOrder!: SORT_ORDER;

    @IsOptional()
    @IsString()
    filter!: string;
}
