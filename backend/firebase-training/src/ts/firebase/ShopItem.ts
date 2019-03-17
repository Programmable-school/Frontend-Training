import { FirebaseBase, property } from './FirestoreBase'

/**
 * FirebaseBaseを継承して利用する。
 * @propertyを修飾子とするパラメータをフィールド対象とする。
 */
class ShopItem extends FirebaseBase {
  @property uid?: string
  @property name: string = ''
  @property price: number = 50
  @property remainCount: number = 10
}

export { ShopItem }
