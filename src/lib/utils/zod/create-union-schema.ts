import { type Primitive, type RawCreateParams, z, type ZodLiteral } from "zod";

type MappedZodLiterals<T extends readonly Primitive[]> = {
  -readonly [K in keyof T]: ZodLiteral<T[K]>;
};

function createManyUnion<
  A extends Readonly<[Primitive, Primitive, ...Primitive[]]>
>(literals: A, params?: RawCreateParams) {
  return z.union(
    literals.map((value) => z.literal(value)) as MappedZodLiterals<A>,
    params
  );
}

export { createManyUnion };
