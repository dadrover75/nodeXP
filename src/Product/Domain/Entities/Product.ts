import IProductDomain from './IProductDomain';
import Base from '../../../App/Domain/Entities/Base';
import IUserDomain from '../../../User/Domain/Entities/IUserDomain';
import ProductRepPayload from '../Payloads/ProductRepPayload';

class Product extends Base implements IProductDomain
{
    name: string;
    description: string;
    price: number;
    quantity: number;
    createdBy: IUserDomain;
    lastModifiedBy: IUserDomain;

    constructor(payload: ProductRepPayload)
    {
        super();
        this.updateBuild(payload);
    }

    updateBuild(payload: ProductRepPayload): void
    {
        this.name = payload.name;
        this.description = payload.description;
        this.price = payload.price;
        this.quantity = payload.quantity;
    }

    getCreatedBy(): IUserDomain
    {
        return this.createdBy;
    }

    getLastModifiedBy(): IUserDomain
    {
        return this.lastModifiedBy;
    }
}

export default Product;
