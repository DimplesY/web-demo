export type L2T<L, LAlias = L, LAlias2 = L> = [L] extends [never] ? [] : L extends infer LItem ? [LItem?, ...L2T<Exclude<L, LItem>, LAlias, LAlias2>] : never
