export abstract class ValueObject<T> {
    protected readonly _props: T;

    constructor(props: T) {
        this.validate(props);
        this._props = props;
    }

    protected abstract validate(props: T): void;

    /**
     *  Check if two Value Objects are equal. Checks structural equality.
     */
    public equals(vo?: ValueObject<T>): boolean {
        if (vo === null || vo === undefined) {
            return false;
        }
        return JSON.stringify(this) === JSON.stringify(vo);
    }

}