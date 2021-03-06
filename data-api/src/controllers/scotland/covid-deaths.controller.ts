/**
 * Deprecate
 */

import { NextFunction } from 'connect';
import { Response } from 'express-serve-static-core';
import { controller, httpGet } from 'inversify-express-utils';

import { IRequestWithUser } from '../../infrastructure/user/request-with-user.interface';
import { CsvParseError } from '../../exceptions/exception';
import { logger } from '../../utils/logger';
import { CSVService } from '../../services/csv.service';
import { inject } from 'inversify';
import { TYPES } from '../../services/config/types';

@controller('/scotland/covid-deaths')
export class CovidDeathsController {
    constructor(@inject(TYPES.CSVService) private csvService: CSVService) {}

    //
    // /api/v1/scotland/covid-deaths?table=<>&group=<>,
    //
    @httpGet('/')
    public async getCovidDeathsData(request: IRequestWithUser, response: Response, next: NextFunction): Promise<void> {
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
}
