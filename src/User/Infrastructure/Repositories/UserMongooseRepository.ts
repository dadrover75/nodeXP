import IUserRepository from './IUserRepository';
import { injectable } from 'inversify';
import { ICriteria, IPaginator } from '@digichanges/shared-experience';

import MongoosePaginator from '../../../App/Presentation/Shared/Orm/MongoosePaginator';
import UserFilter from '../../Presentation/Criterias/UserFilter';
import IUser from '../Schemas/IUserDocument';
import { Query } from 'mongoose';
import IUserDomain from '../../Domain/Entities/IUserDomain';

import NotFoundException from '../../../Shared/Exceptions/NotFoundException';
import BaseMongooseRepository from '../../../App/Infrastructure/Repositories/BaseMongooseRepository';
import User from '../../Domain/Entities/User';

@injectable()
class UserMongooseRepository extends BaseMongooseRepository<IUserDomain, IUser> implements IUserRepository
{
    constructor()
    {
        super(User.name, ['roles']);
    }

    async getOneByEmail(email: string): Promise<IUserDomain>
    {
        const user = await this.repository.findOne({ email }).populate(this.populate);

        if (!user)
        {
            throw new NotFoundException('User');
        }

        return user;
    }

    async getOneByConfirmationToken(confirmationToken: string): Promise<IUserDomain>
    {
        const user = await this.repository.findOne({ confirmationToken }).populate(this.populate);

        if (!user)
        {
            throw new NotFoundException('User');
        }

        return user;
    }

    async list(criteria: ICriteria): Promise<IPaginator>
    {
        const queryBuilder: Query<IUser[], IUser> = this.repository.find({});
        const filter = criteria.getFilter();

        if (filter.has(UserFilter.ENABLE))
        {
            const _enable = filter.get(UserFilter.ENABLE);
            const enable: boolean = _enable !== 'false';

            void queryBuilder.where(UserFilter.ENABLE).equals(enable);
        }

        if (filter.has(UserFilter.EMAIL))
        {
            const email = filter.get(UserFilter.EMAIL);
            const rsearch = new RegExp(email, 'g');

            void queryBuilder.where(UserFilter.EMAIL).regex(rsearch);
        }

        if (filter.has(UserFilter.IS_SUPER_ADMIN))
        {
            const isSuperAdmin: boolean = filter.get(UserFilter.IS_SUPER_ADMIN);

            void queryBuilder.where(UserFilter.IS_SUPER_ADMIN).equals(isSuperAdmin);
        }

        void queryBuilder.populate('roles');

        return new MongoosePaginator(queryBuilder, criteria);
    }
}

export default UserMongooseRepository;
