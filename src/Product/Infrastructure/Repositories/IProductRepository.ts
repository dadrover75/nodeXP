import IBaseRepository from '../../../App/InterfaceAdapters/IBaseRepository';
import { ICriteria, IPaginator } from '@digichanges/shared-experience';
import IProductDomain from '../../Domain/Entities/IProductDomain';

interface IProductRepository extends IBaseRepository<IProductDomain>
{
    list(criteria: ICriteria): Promise<IPaginator>
}

export default IProductRepository;
