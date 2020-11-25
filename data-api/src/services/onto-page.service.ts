import config from 'config';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { FilterQuery, ObjectId } from 'mongodb';

import { DbClient } from '../infrastructure/db/mongodb.connection';
import { TYPES } from './config/types';
import { DataService } from './data.service';
import { IdDoesNotExist, SomethingWentWrong } from '../exceptions/exception';
import { IOntoPage, PUBLISH_TYPE } from '../infrastructure/onto-page/onto-page.interface';
import { OntoPageVm } from '../infrastructure/onto-page/onto-page.vm';
import {
    OntoPageFilterVm,
    SORT_BY_FILTER_ONTOPAGE,
    SORT_ORDER_FILTER,
} from '../infrastructure/onto-page/onto-page-filter.vm';
import { PaginationVm } from '../infrastructure/pagination.vm';

@provide(TYPES.OntoPageService)
export class OntoPageService extends DataService<IOntoPage> {
    public constructor(@inject(TYPES.DbClient) dbClient: DbClient) {
        super(dbClient, config.get('mongodb.db'), config.get('mongodb.collection.onto_page'));
    }

    async getAllPages( alertFilterVm: OntoPageFilterVm, query?: FilterQuery<IOntoPage>): Promise<PaginationVm<IOntoPage>> {
        let ontoPages: IOntoPage[] = [];

        
        if (Object.values(PUBLISH_TYPE).includes(alertFilterVm.publishType)) {
            // filtered pages
            ontoPages = await this.getAll({ publishType: alertFilterVm.publishType })
        } else {
            throw new SomethingWentWrong('Wrong page publish type');
        }

        return this.getPaginatedOntoPages(ontoPages, alertFilterVm);
    }

    public async createPage(ontoPageVm: OntoPageVm): Promise<IOntoPage> {
        // TODO
        // let ontoPage: IOntoPage = check if exist based on some condition
        // if (ontoPage) return data;
        // check pageId
        // check dataId, query, & params

        /*
        let ontoPage: IOntoPage = {
            _id: new ObjectId(),
            title: ontoPageVm.title,
            bindingIds: ontoPageVm.bindingIds,
            nrows: ontoPageVm.nrows,
            publishType: ontoPageVm.publishType,
            date: new Date(),
        };
        return await this.create(ontoPage);
        */
       return Promise.resolve(null as any)
    }

    public async updatePage(pageId: string, ontoPageVm: OntoPageVm): Promise<IOntoPage> {
        let data: IOntoPage = await this.get(pageId);
        if (!data) throw new IdDoesNotExist(pageId);

        /*
        let ontoPage: IOntoPage= {
            title: ontoPageVm.title,
            bindVis: ontoPageVm.bindingIds,
            nrows: ontoPageVm.nrows,
            publishType: ontoPageVm.publishType,
            date: new Date(),
        } as any;

        return await this.updateAndGet(pageId, ontoPage);
        */
       return Promise.resolve(null as any)
    }

    // Private Functions

    private getPaginatedOntoPages(ontoPages: Array<IOntoPage>, ontoPageFilterVm: OntoPageFilterVm, ): PaginationVm<IOntoPage> {
        const page: number = ontoPageFilterVm.page ? parseInt(ontoPageFilterVm.page) : 0;
        let pageCount: number | undefined = ontoPageFilterVm.pageCount ? parseInt(ontoPageFilterVm.pageCount) : undefined; // undefined => return all to Flask UI
        const sortBy: SORT_BY_FILTER_ONTOPAGE = ontoPageFilterVm.sortBy || SORT_BY_FILTER_ONTOPAGE.TITLE;
        const sortOrder: SORT_ORDER_FILTER = ontoPageFilterVm.sortOrder || SORT_ORDER_FILTER.ASC;

        let result: Array<IOntoPage> = ontoPages;

        if (ontoPageFilterVm.filter && ontoPageFilterVm.filter.length > 0) {
            const filter = ontoPageFilterVm.filter.toLowerCase();
            result = result.filter((a) => a.title.match(new RegExp(filter, 'i')));
        }

        if (sortBy == SORT_BY_FILTER_ONTOPAGE.TITLE) {
            result = result.sort((a, b) => {
                if (a.title >= b.title) return 1;
                return -1;
            });
        } else if (sortBy == SORT_BY_FILTER_ONTOPAGE.PUBLISH_TYPE) {
            result = result.sort((a, b) => {
                if (a.publishType >= b.publishType) return 1;
                return -1;
            });
        } else if (sortBy == SORT_BY_FILTER_ONTOPAGE.DATE) {
            result = result.sort((a, b) => {
                if (a.date >= b.date) return 1;
                return -1;
            });
        }

        if (sortOrder == SORT_ORDER_FILTER.DESC) {
            result = result.reverse();
        }

        return {
            data: this.paginate(result, pageCount, page),
            page: page,
            pageCount: pageCount,
            totalCount: result.length,
        } as PaginationVm<IOntoPage>;
    }

    private paginate(array: Array<IOntoPage>, page_size: number | undefined, page_number: number): Array<IOntoPage> {
        if (!page_size) return array; // undefined => return all to Flask UI
        else return array.slice(page_number * page_size, (page_number + 1) * page_size);
    }
}