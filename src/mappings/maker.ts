// Doesn't appear to be used but might need it for computating historic data accurately in future

// import { dataSource, log } from '@graphprotocol/graph-ts'

// import { Maker } from '../../generated/schema'
// import { Maker as MakerContract } from '../../generated/SushiMaker/Maker'

// function getMaker(): Maker {
//   let entity = Maker.load(dataSource.address().toHex())

//   if (entity === null) {
//     const contract = MakerContract.bind(dataSource.address())
//     entity = new Maker(dataSource.address().toHex())
//     entity.save()
//   }

//   return entity as Maker
// }

// function updateMaker(maker: Maker): Maker {
//   const contract = MakerContract.bind(dataSource.address())
//   maker.save()
//   return maker as Maker
// }
