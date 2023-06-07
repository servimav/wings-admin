/**
 * @interface PaginatedData
 */
export interface PaginatedData<T> {
    data: T[];
    links: {
        first?: string;
        last?: string;
        prev?: string;
        next?: string
    };
    meta: {
        current_page?: number;
        from?: number;
        path?: string;
        per_page?: number;
        to?: number;
    }
}


export interface GeoCoords {
    lat: number
    lng: number
}

export interface GeoLocation {
    id: number
    name: string
    coords: GeoCoords
}
