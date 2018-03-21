export interface Product {
    //[key: string]: number | string | string[];
    id: number;
    parentId: number;
    previousParentId?: number;
    title?: string;
    isActive?: boolean;
}
