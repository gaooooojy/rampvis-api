import 'automapper-ts';
import { OntoPageDto } from '../../infrastructure/onto-page/onto-page.dto';
import { ActivityDto } from '../../infrastructure/activity/activity.dto';
import { OntoDataDto } from '../../infrastructure/onto-data/onto-data.dto';
import { OntoVisDto } from '../../infrastructure/onto-vis/onto-vis.dto';
import { UserDto } from '../../infrastructure/user/user.dto';

const MAPPING_TYPES = {
    IBookmark: 'IBookmark',
    BookmarkDto: 'BookmarkDto',

    IUser: 'IUser',
    UserDto: 'UserDto',

    IActivity: 'IActivity',
    ActivityDto: 'ActivityDto',

    MongoDbObjectId: 'MongoDbObjectId',
    TsString: 'TsString',

    IOntoVis: 'IOntoVis',
    OntoVisDto: 'OntoVisDto',
    IOntoData: 'IOntoData',
    OntoDataDto: 'OntoDataDto',
    IOntoPage: 'IOntoPage',
    OntoPageDto: 'OntoPageDto',
};

function configureAutoMapper() {
    // MongoDb ObjectId to string
    automapper
        .createMap(MAPPING_TYPES.MongoDbObjectId, MAPPING_TYPES.TsString)
        .forMember('_id', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.sourceObject._id.toString());

    automapper
        .createMap(MAPPING_TYPES.IBookmark, MAPPING_TYPES.BookmarkDto)
        .forMember('id', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.mapFrom('_id'))
        .forMember('thumbnail', (opts: AutoMapperJs.IMemberConfigurationOptions) =>
            opts.sourceObject.thumbnail === null ? '' : opts.sourceObject.thumbnail,
        );

    automapper
        .createMap(MAPPING_TYPES.IUser, MAPPING_TYPES.UserDto)
        .forMember('id', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.mapFrom('_id'))
        .forMember('password', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.ignore())
        .convertToType(UserDto);

    automapper
        .createMap(MAPPING_TYPES.IActivity, MAPPING_TYPES.ActivityDto)
        .forMember('id', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.sourceObject._id.toString())
        .convertToType(ActivityDto);

    automapper
        .createMap(MAPPING_TYPES.IOntoVis, MAPPING_TYPES.OntoVisDto)
        .forMember('id', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.mapFrom('_id'))
        .convertToType(OntoVisDto);

    automapper
        .createMap(MAPPING_TYPES.IOntoData, MAPPING_TYPES.OntoDataDto)
        .forMember('id', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.mapFrom('_id'))
        .forMember('queryParams', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.mapFrom('queryParams'))
        .convertToType(OntoDataDto);

    automapper
        .createMap(MAPPING_TYPES.IOntoPage, MAPPING_TYPES.OntoPageDto)
        .forMember('id', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.mapFrom('_id'))
        .forMember('bindVis', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.mapFrom('bindVis'))
        .convertToType(OntoPageDto);
}

export { configureAutoMapper, MAPPING_TYPES };
