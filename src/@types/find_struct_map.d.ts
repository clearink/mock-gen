interface MapValue {
  type: string
  struct: StructDataSchema[]
}
type StructMap = Map<string | number, MapValue>
