export interface Product {
    id: number;
    parentId: number;
    previousParentId?: number;
    title?: string;
    isActive?: boolean;
    clearCache?: boolean,
    translations?: {[fieldName: string]: {[lang: string]: string}};
}
