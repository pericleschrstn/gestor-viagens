import { z } from "zod"

const num = z.union([z.string(), z.number()])

export const apiBalanceSchema = z.object({
  memberId: z.string().uuid(),
  memberName: z.string(),
  initials: z.string(),
  paid: num,
  owed: num,
  balance: num,
})

export const apiBalancesSchema = z.array(apiBalanceSchema)

export const apiSettlementSchema = z.object({
  fromMemberId: z.string().uuid(),
  fromMemberName: z.string(),
  toMemberId: z.string().uuid(),
  toMemberName: z.string(),
  amount: num,
})

export const apiSettlementsSchema = z.array(apiSettlementSchema)

export function mapBalance(dto: z.infer<typeof apiBalanceSchema>) {
  return {
    memberId: dto.memberId,
    memberName: dto.memberName,
    initials: dto.initials,
    paid: Number(dto.paid),
    owed: Number(dto.owed),
    balance: Number(dto.balance),
  }
}

export function mapSettlement(dto: z.infer<typeof apiSettlementSchema>) {
  return {
    fromMemberId: dto.fromMemberId,
    fromMemberName: dto.fromMemberName,
    toMemberId: dto.toMemberId,
    toMemberName: dto.toMemberName,
    amount: Number(dto.amount),
  }
}

export const settleCommandSchema = z.object({
  settlements: z
    .array(
      z.object({
        fromMemberId: z.string().uuid(),
        toMemberId: z.string().uuid(),
        amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Valor inválido."),
      }),
    )
    .min(1),
})
