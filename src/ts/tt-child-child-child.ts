/**
 * @description
 * apiName: tt-child-child-child-api
 * apiMethod: get
 * apiURI: /tt-child-child-child
 */
export namespace GetTtChildChildChild {
    /** body 参数 */
    export interface BodyParam {
        list: BodyParamList[];
        a: BodyParamA;
        b: BodyParamB;
        d: "1" | "2" | true | false;
        array: BodyParamArray[];
        enum: "a" | "b" | "c" | "d" | 1 | 2 | 3 | "e";
    }
    export interface BodyParamList {
        id?: number;
        category?: BodyParamListCategory;
        name: string;
        photoUrls: any[];
        tags?: BodyParamListTags[];
        status?: "available" | "pending" | "sold";
    }
    export interface BodyParamListCategory {
        id?: number;
        name?: string;
    }
    export interface BodyParamListTags {
        id?: number;
        name?: string;
    }
    export interface BodyParamA {
        id?: number;
        username?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        phone?: string;
    }
    export interface BodyParamB {
        1: number;
        true: boolean;
        false: boolean;
        a: string;
    }
    export interface BodyParamArray {
        a: string;
        c: number;
        b: boolean;
    }

    /** 响应 数据 */
    export interface Response {
        code: number;
        message: string;
        a: ResponseA;
        b: ResponseB;
        d: "1" | "2" | true | false;
        list: ResponseList[];
        array: ResponseArray[];
        enum: "a" | "b" | "c" | "d" | 1 | 2 | 3 | "e";
    }
    export interface ResponseA {
        id?: number;
        username?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        phone?: string;
    }
    export interface ResponseB {
        1: number;
        true: boolean;
        false: boolean;
        a: string;
    }
    export interface ResponseList {
        id?: number;
        category?: ResponseListCategory;
        name: string;
        photoUrls: any[];
        tags?: ResponseListTags[];
        status?: "available" | "pending" | "sold";
    }
    export interface ResponseListCategory {
        id?: number;
        name?: string;
    }
    export interface ResponseListTags {
        id?: number;
        name?: string;
    }
    export interface ResponseArray {
        a: string;
        c: number;
        b: boolean;
    }
}
