export interface FindOrderInputDto {
    id: string;
}

export interface FindOrderOutputDto {
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