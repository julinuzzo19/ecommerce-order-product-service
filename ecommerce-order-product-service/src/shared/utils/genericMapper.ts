export type MappingConfig<T, U> = {
  [K in keyof U]: (entity: T) => U[K];
};

export function genericMapToDTO<T, U>(
  entity: T,
  config: MappingConfig<T, U>
): U {
  const dto: Partial<U> = {};
  for (const key in config) {
    dto[key] = config[key](entity);
  }
  return dto as U;
}
