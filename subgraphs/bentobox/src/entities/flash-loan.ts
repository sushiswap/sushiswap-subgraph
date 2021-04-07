import { FlashLoan } from '../../generated/schema'
import { LogFlashLoan } from '../../generated/BentoBox/BentoBox'

export function createFlashLoan(event: LogFlashLoan): FlashLoan {
  const flashLoan = new FlashLoan(event.transaction.hash.toHex().concat('-').concat(event.logIndex.toString()))

  flashLoan.bentoBox = event.address.toHex()
  flashLoan.borrower = event.params.borrower
  flashLoan.receiver = event.params.receiver
  flashLoan.token = event.params.token.toHex()
  flashLoan.amount = event.params.amount
  flashLoan.feeAmount = event.params.feeAmount
  flashLoan.block = event.block.number
  flashLoan.timestamp = event.block.timestamp

  flashLoan.save()

  return flashLoan as FlashLoan
}
