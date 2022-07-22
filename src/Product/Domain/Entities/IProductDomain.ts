import IBaseDomain from '../../../App/InterfaceAdapters/IBaseDomain';
import IUserDomain from '../../../User/Domain/Entities/IUserDomain';
import ProductRepPayload from '../Payloads/ProductRepPayload';

interface IProductDomain extends IBaseDomain
{
    name: string;
    description: string;
    price: number;
    quantity: number;
    createdBy: IUserDomain;
    lastModifiedBy: IUserDomain;

    getCreatedBy(): IUserDomain;
    getLastModifiedBy(): IUserDomain;
    updateBuild(payload: ProductRepPayload): void;
}

export default IProductDomain;
