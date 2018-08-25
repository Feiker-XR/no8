import * as types from '../types/type.userinfo'

const USERINFO = {
  [types.USER_ID] (state, userID) {
    state.userId = userID
  }
}

export default USERINFO
