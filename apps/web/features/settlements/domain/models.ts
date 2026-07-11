export type MemberBalance = {
  memberId: string
  memberName: string
  initials: string
  paid: number
  owed: number
  balance: number
}

export type SuggestedSettlement = {
  fromMemberId: string
  fromMemberName: string
  toMemberId: string
  toMemberName: string
  amount: number
}

export type SettleCommand = {
  settlements: {
    fromMemberId: string
    toMemberId: string
    amount: string
  }[]
}
