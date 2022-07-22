import faker from 'faker';
import IProductRepository from '../Repositories/IProductRepository';
import Product from '../../Domain/Entities/Product';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import ISeed from '../../../Shared/InterfaceAdapters/ISeed';
import IUserDomain from '../../../User/Domain/Entities/IUserDomain';
import User from '../../../User/Domain/Entities/User';
import IUserRepository from '../../../User/Infrastructure/Repositories/IUserRepository';
import Password from '../../../App/Domain/ValueObjects/Password';
import MainConfig from '../../../Config/mainConfig';
import IRoleDomain from '../../../Role/Domain/Entities/IRoleDomain';

class ProductSeed implements ISeed
{
    @containerFactory(REPOSITORIES.IProductRepository)
    private repository: IProductRepository;

    @containerFactory(REPOSITORIES.IUserRepository)
    private userRepository: IUserRepository;

    public async init()
    {
        const indexes = Array.from({ length: 10 }, (v, i) => i + 1);

        const user = await this.createUser();

        for await (const index of indexes)
        {
            const name = faker.name.title();
            const description = faker.lorem.paragraph();
            const price = faker.datatype.number();
            const quantity = faker.datatype.number();

            const product = new Product({ name, description, price, quantity });

            product.createdBy = user;
            product.lastModifiedBy = user;

            await this.repository.save(product);
        }
    }

    private async createUser(): Promise<IUserDomain>
    {
        const { minLength, maxLength } = MainConfig.getInstance().getConfig().validationSettings.password;

        const roles: IRoleDomain[] = [];
        const permissions: string[] = [];

        const payloadUser = {
            firstName: 'test',
            lastName: 'product',
            email: 'testproduct@node.com',
            birthday: '05/07/1992',
            documentType: 'dni',
            documentNumber: '3531915736',
            gender: 'male',
            phone: '2234456999',
            country: 'Argentina',
            address: 'New America 123',
            enable: true,
            permissions,
            roles,
            isSuperAdmin: false
        };

        const user: IUserDomain = new User(payloadUser);
        user.password = await (new Password('123456789', minLength, maxLength)).ready();

        return await this.userRepository.save(user);
    }
}

export default ProductSeed;
