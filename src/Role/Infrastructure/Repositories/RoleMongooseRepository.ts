import IRoleRepository from './IRoleRepository';
import { injectable } from 'inversify';
import { ICriteria, IPaginator } from '@digichanges/shared-experience';

import MongoosePaginator from '../../../App/Presentation/Shared/Orm/MongoosePaginator';
import RoleFilter from '../../Presentation/Criterias/RoleFilter';
import { Query } from 'mongoose';
import IRole from '../Schemas/IRoleDocument';
import IRoleDomain from '../../Domain/Entities/IRoleDomain';

import Roles from '../../../Config/Roles';
import BaseMongooseRepository from '../../../App/Infrastructure/Repositories/BaseMongooseRepository';
import Role from '../../Domain/Entities/Role';
import NotFoundException from '../../../Shared/Exceptions/NotFoundException';
import RoleOfSystemNotDeletedException from '../../Domain/Exceptions/RoleOfSystemNotDeletedException';

@injectable()
class RoleMongooseRepository extends BaseMongooseRepository<IRoleDomain, IRole> implements IRoleRepository
{
    constructor()
    {
        super(Role.name);
    }

    async getBySlug(slug: string): Promise<IRoleDomain>
    {
        return this.repository.findOne({ slug });
    }

    async list(criteria: ICriteria): Promise<IPaginator>
    {
        const queryBuilder: Query<IRole[], IRole> = this.repository.find();
        const filter = criteria.getFilter();

        if (filter.has(RoleFilter.ENABLE))
        {
            const _enable = filter.get(RoleFilter.ENABLE);
            const enable: boolean = _enable !== 'false';

            void queryBuilder.where(RoleFilter.ENABLE).equals(enable);
        }
        if (filter.has(RoleFilter.NAME))
        {
            const name = filter.get(RoleFilter.NAME);
            const rSearch = new RegExp(name, 'g');

            void queryBuilder.where(RoleFilter.NAME).regex(rSearch);
        }
        if (filter.has(RoleFilter.SLUG))
        {
            const slug = filter.get(RoleFilter.SLUG);
            const rSearch = new RegExp(slug, 'g');

            void queryBuilder.where(RoleFilter.SLUG).regex(rSearch);
        }

        void queryBuilder.where(RoleFilter.SLUG).ne(Roles.SUPER_ADMIN.toLowerCase());

        return new MongoosePaginator(queryBuilder, criteria);
    }

    async delete(id: string): Promise<IRoleDomain>
    {
        const isOfSystem = !!(await this.exist({ _id: id, ofSystem: true }, ['_id']));

        if (isOfSystem)
        {
            throw new RoleOfSystemNotDeletedException();
        }

        const entity = await this.repository.findByIdAndDelete({ _id: id } as any);

        if (!entity)
        {
            throw new NotFoundException(this.entityName);
        }

        return entity;
    }
}

export default RoleMongooseRepository;
