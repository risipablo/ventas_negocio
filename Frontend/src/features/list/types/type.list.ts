import type React from "react";

export interface IList {
    _id?: string;
    marca: string;
    mascota: string;
    edad: string;
    kilo: string;
    condicion: string;
    precio: string;
    categoria: string;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ListContainerProps {
    list: IList[];
    setList: React.Dispatch<React.SetStateAction<IList[]>>;
    setFilterProducts: React.Dispatch<React.SetStateAction<IList[]>>
    loading?: boolean;
    onAdd?: (data: Omit<IList, '_id'>) => void;
    onUpdate?: (id: string, data: Partial<IList>) => void;
    onEdit?: (item: IList) => void;
    onDelete?: (id?: string) => void;
}