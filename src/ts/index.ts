namespace HttpGetTestId {
  // body 参数
  export interface BodyParams {}
  // query 参数
  export interface QueryParams {}
  // 响应 数据
  export interface ResponseData {
    code: number;
    message: string;
    data: ResponseDataDataProps;
  }
  export interface ResponseDataDataProps {
    list: ResponseDataDataPropsItem;
  }
  export interface ResponseDataDataPropsItem {
    a: string;
    b: number;
    c: ResponseDataDataPropsItemCProps;
  }
  export interface ResponseDataDataPropsItemCProps {
    d: number;
  }
}
// Http[method][fileName or dirName] 大驼峰

// 对象的类型命名
// 数组的类型命名
