import { Factory } from '../../generated/schema'

export function getOrCreateFactory(id: string): Factory {
  let factory = Factory.load(id)

  if (factory === null) {
    factory = new Factory(id)
    factory.save()
  }

  return factory as Factory
}
