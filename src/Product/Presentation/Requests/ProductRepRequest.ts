import ProductRepPayload from '../../Domain/Payloads/ProductRepPayload';
import { IsInt, IsString } from 'class-validator';
import { decorate } from 'ts-mixer';
import { isString } from 'lodash';

class ProductRepRequest implements ProductRepPayload
{
    private readonly _name: string;
    private readonly _description: string;
    private readonly _price: number;
    private readonly _quantity: number;

    constructor(data: Record<string, any>)
    {
        this._name = data.name;
        this._description = data.description;
        this._price = data.price;
        this._quantity = data.quantity;
    }

    @decorate(IsString())
    get name(): string
    {
        return this._name;
    }

    @decorate(IsString())
    get description(): string
    {
        return this._description;
    }

    @decorate(IsInt())
    get price(): number
    {
        return this._price;
    }

    @decorate(IsInt())
    get quantity(): number
    {
        return this._quantity;
    }
}

export default ProductRepRequest;
