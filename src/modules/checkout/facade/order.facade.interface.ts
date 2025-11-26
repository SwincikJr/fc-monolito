export interface PlaceOrderFacadeInputDto {
    clientId: string;
    products: {
        productId: string
    }[];
}

export interface PlaceOrderFacadeOutputDto {
    id: string;
    invoiceId: string;
    status: string;
    total: number;
    products: {
        productId: string;
    }[]
}

export interface FindOrderFacadeInputDto {
    id: string;
}

export interface FindOrderFacadeOutputDto {
    id: string;
    client: {
        id: string;
        name: string;
        email: string;
        address: string;
    };
    status: string;
    products: {
        name: string;
        description: string;
        salesPrice: number;
    }[],
    total: number;
}

export interface OrderFacadeInterface {
    placeOrder(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto>;
    findOrder(input: FindOrderFacadeInputDto): Promise<FindOrderFacadeOutputDto>;
}