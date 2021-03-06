import { NextFunction } from 'connect';
import { Request, Response } from 'express-serve-static-core';
import { controller, httpDelete, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import { inject } from 'inversify';

import { logger } from '../../utils/logger';
import { TYPES } from '../../services/config/types';
import { vmValidate } from '../../middleware/validators';
import { JwtToken } from '../../middleware/jwt.token';
import { MAPPING_TYPES } from '../../services/config/automapper.config';
import { OntoDataVm } from '../../infrastructure/onto-data/onto-data.vm';
import { OntoDataService } from '../../services/onto-data.service';
import { IOntoData } from '../../infrastructure/onto-data/onto-data.interface';
import { OntoDataDto } from '../../infrastructure/onto-data/onto-data.dto';
import { SomethingWentWrong } from '../../exceptions/exception';

@controller('/ontology/data', JwtToken.verify)
export class OntoDataController {
    constructor(
        @inject(TYPES.OntoDataService) private ontologyDataService: OntoDataService,
    ) {}

   
    @httpGet('/')
    public async getAllData(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const dataList: IOntoData[] = await this.ontologyDataService.getAll();
            const dataDtos: OntoDataDto[] = automapper.map(MAPPING_TYPES.IOntoData, MAPPING_TYPES.OntoDataDto, dataList);
            logger.info(`OntoDataController:getAllData: dataDtos = ${JSON.stringify(dataDtos)}`);
            response.status(200).send(dataDtos);
        } catch (e) {
            logger.error(`OntoDataController:getAllData: error = ${JSON.stringify(e)}`);
            next(new SomethingWentWrong(e.message));
        }
    }

    @httpGet('/:dataId')
    public async getData(request: Request, response: Response, next: NextFunction): Promise<void> {
        const dataId = request.params.dataId;
        logger.info(`OntoDataController:getData: dataId = ${JSON.stringify(dataId)}`);

        try {
            const data: IOntoData = await this.ontologyDataService.get(dataId);
            const dataDto: OntoDataDto = automapper.map(MAPPING_TYPES.IOntoData, MAPPING_TYPES.OntoDataDto, data);
            logger.info(`OntoDataController:getData: dataDto = ${JSON.stringify(dataDto)}`);
            response.status(200).send(dataDto);
        } catch (e) {
            logger.error(`OntoDataController:getData: error = ${JSON.stringify(e)}`);
            next(new SomethingWentWrong(e.message));
        }
    }

    @httpPost('/', vmValidate(OntoDataVm))
    public async createData(request: Request, response: Response, next: NextFunction): Promise<void> {
        const dataVm: OntoDataVm = request.body as any;
        logger.info(`OntoDataController:createData: dataVm = ${JSON.stringify(dataVm)}`);

        try {
            const data: IOntoData = await this.ontologyDataService.createData(dataVm);
            const dataDto: OntoDataDto = automapper.map(MAPPING_TYPES.IOntoData, MAPPING_TYPES.OntoDataDto, data);
            logger.info(`OntoDataController:createData: dataDto = ${JSON.stringify(dataDto)}`);
            response.status(200).send(dataDto);
        } catch (e) {
            logger.error(`OntoDataController:createData: error = ${JSON.stringify(e)}`);
            next(new SomethingWentWrong(e.message));
        }
    }

    @httpPut('/:dataId', vmValidate(OntoDataVm))
    public async updateData(request: Request, response: Response, next: NextFunction): Promise<void> {
        const dataId: string = request.params.dataId;
        const dataVm: OntoDataVm = request.body as any;
        logger.info(`OntoDataController:updateData: dataId = ${dataId}, dataVm = ${JSON.stringify(dataVm)}`);
        try {
            const data: IOntoData = await this.ontologyDataService.updateData(dataId, dataVm);
            const dataDto: OntoDataDto = automapper.map(MAPPING_TYPES.IOntoData, MAPPING_TYPES.OntoDataDto, data);
            logger.info(`OntoDataController:updateData: dataDto = ${JSON.stringify(dataDto)}`);
            response.status(200).send(dataDto);
        } catch (e) {
            logger.error(`OntoDataController:updateData: error = ${JSON.stringify(e)}`);
            next(new SomethingWentWrong(e.message));
        }
    }

    @httpDelete('/:dataId') 
    public async deleteData(request: Request, response: Response, next: NextFunction): Promise<void> {
        const dataId: string = request.params.dataId;
        logger.info(`OntoDataController:deleteData: dataId = ${dataId}`);

        try {
            const ontoData: IOntoData = await this.ontologyDataService.delete(dataId);
            const ontoDataDto: OntoDataDto = automapper.map(MAPPING_TYPES.IOntoData, MAPPING_TYPES.OntoDataDto, ontoData);
            logger.info(`OntoDataController:deleteData: ontoDataDto = ${JSON.stringify(ontoDataDto)}`);
            response.status(200).send(ontoDataDto);
        } catch (e) {
            logger.error(`OntoDataController:deleteData: error = ${JSON.stringify(e)}`);
            next(new SomethingWentWrong(e.message));
        }
    }
}
