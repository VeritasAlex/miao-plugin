import { Common } from '../../components/index.js'
import { getTargetUid } from '../profile/ProfileCommon.js'
import GachaData from './GachaData.js'
import { Character, Player } from '../../models/index.js'

let Gacha = {
  async detail (e) {
    let msg = e.msg.replace(/#|抽卡|记录|祈愿|分析|池/g, '')
    let type = 301
    switch (msg) {
      case 'up':
      case '抽卡':
      case '角色':
      case '抽奖':
        type = 301
        break
      case '常驻':
        type = 200
        break
      case '武器':
        type = 302
        break
    }
    let uid = e.uid || await getTargetUid(e)
    let qq = e.user_id
    if (!uid || !qq) {
      return false
    }

    let gacha = GachaData.analyse(e.user_id, uid, type)
    await Common.render('gacha/gacha-detail', {
      save_id: uid,
      uid,
      gacha,
      face: Gacha.getFace(uid)
    }, { e, scale: 1.1, retMsgId: true })
  },
  async stat (e) {
    let uid = e.uid || await getTargetUid(e)
    let qq = e.user_id
    if (!uid || !qq) {
      return false
    }
    let gacha = GachaData.stat(e.user_id, uid)
    await Common.render('gacha/gacha-stat', {
      save_id: uid,
      uid,
      gacha,
      face: Gacha.getFace(uid)
    }, { e, scale: 1.1, retMsgId: true })
  },

  getFace (uid) {
    let player = Player.create(uid)

    let faceChar = Character.get(player.face || '100000003')
    let imgs = faceChar.imgs
    return {
      banner: imgs?.banner,
      face: imgs?.face,
      qFace: imgs?.qFace,
      name: player.name || `#${uid}`,
      sign: player.sign,
      level: player.level
    }
  }
}
export default Gacha
