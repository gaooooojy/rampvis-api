import { NextFunction } from 'connect';
import { Response } from 'express-serve-static-core';
import { controller, httpGet } from 'inversify-express-utils';

import { CsvParseError, InvalidQueryParametersException } from '../../exceptions/exception';
import { logger } from '../../utils/logger';
import { IRequestWithUser } from '../../infrastructure/user/request-with-user.interface';
import { CSVService } from '../../services/csv.service';
import { inject } from 'inversify';
import { TYPES } from '../../services/config/types';

@controller('/scotland/raw')
export class ScotlandRawDataController {
    constructor(@inject(TYPES.CSVService) private csvService: CSVService) {}

    //
    // ?table=<>
    // ?table=<>&region=<>
    //
    @httpGet('/xl/nhs-board')
    public async getNHSBoardDataV04(request: IRequestWithUser, response: Response, next: NextFunction): Promise<void> {
        const table = request.query.table as string;
        const region = request.query.region as string;
        logger.info('RegionDataController: getXlData: table = ', table, ', region = ', region);

        if (!table && !region) {
            return next(new InvalidQueryParametersException('Empty table and region'));
        }

        try {
            const data: any[] = await this.csvService.getDataV04(table + '.csv');

            if (region) {
                response.status(200).send(
                    data.map((d: any) => {
                        return {
                            date: d.date,
                            value: parseFloat(d[region].replace(/,/g, '')),
                        };
                    }),
                );
            } else {
                response.status(200).send(data);
            }
        } catch (error) {
            next(new CsvParseError(error.message));
        }
    }

    //
    // ?table=<>&group=<>
    //
    @httpGet('/xl/covid-deaths')
    public async getCovidDeathsDataV04( request: IRequestWithUser, response: Response, next: NextFunction, ): Promise<void> {
        const table = request.query.table as string;
        const group = request.query.group as string;
        logger.info('CovidDeathsController: getCovidDeathsData: table = ', table, ', group = ', group);

        try {
            const data: any[] = await this.csvService.getDataV04(table + '_' + group + '.csv');
            response.status(200).send(data);
        } catch (error) {
            next(new CsvParseError(error.message));
        }
    }

    //
    // ?col=<>
    //
    @httpGet('/:product/:component')
    public async getXX(request: IRequestWithUser, response: Response, next: NextFunction): Promise<void> {}
}
