import { AuctionTemplateAdded } from '../../generated/MISOMarket/MISOMarket'
import { Template } from '../../generated/schema'

export function createTemplate(event: AuctionTemplateAdded): Template {
  const template = new Template(event.params.newAuction.toHex())

  template.factory = event.address.toHex()
  template.removed = false
  template.block = event.block.number
  template.timestamp = event.block.timestamp

  template.save()

  return template as Template
}

export function getTemplate(id: string): Template {
  let template = Template.load(id)
  return template as Template
}
