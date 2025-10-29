export interface Site {
  readonly id: string
  name: string
  description?: string
  options?: {
    location: { lat: number, lon: number }
    zoom?: number
    overlay?: {
      url: string
      bounds: Array<Array<number>>
    }
  }
}

export interface POI {
  readonly id: string
  name: string
  description: string
  unit: string|Array<string>
  options: {
    location: { lat: number, lon: number }
    mqtt? : {
      prefix: string
      queryType: string
      topics: Array<string>
      variables: Array<Array<string>>|null
    }
    [propName: string]: any;  // such as timestamp or quite much anything
  }
}

export interface DataPoint<Type> {
  readonly id: string
  value: Type
  [propName: string]: any;  // such as timestamp or quite much anything
}

export enum QueryType {
  LAST = "LAST",
  ORDERS = "ORDERS",
}
