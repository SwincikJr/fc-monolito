import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";

type InvoiceItemInterface = {
    id?: Id,
    name: string,
    price: number,
    createdAt?: Date,
    updatedAt?: Date
}

type InvoiceProps = {
    id?: Id,
    name: string,
    document: string,
    address: Address,
    items: InvoiceItemInterface[],
    createdAt?: Date,
    updatedAt?: Date
}

export class InvoiceItem extends BaseEntity implements AggregateRoot {
    private _name: string
    private _price: number

    constructor(props: InvoiceItemInterface) {
        super(props.id, props.createdAt, props.updatedAt)
        this._name = props.name
        this._price = props.price
    }

    get name(): string {
        return this._name
    }

    get price(): number {
        return this._price
    }
}

export class Invoice extends BaseEntity implements AggregateRoot {

    private _name: string
    private _document: string
    private _address: Address
    private _items: InvoiceItem[]

    constructor(props: InvoiceProps) {
        super(props.id, props.createdAt, props.updatedAt)
        this._name = props.name
        this._document = props.document
        this._address = props.address
        this._items = props.items.map(i => (new InvoiceItem({
            id: i.id,
            name: i.name,
            price: i.price,
            createdAt: i.createdAt,
            updatedAt: i.updatedAt
        })))
    }

    get name(): string {
        return this._name
    }

    get document(): string {
        return this._document
    }

    get address(): Address {
        return this._address
    }

    get items(): InvoiceItem[] {
        return this._items
    }
}