// We speciify the name of the action as a variable
export const IS_GO_BACK_EDIT_OFF = 'IS_GO_BACK_EDIT_OFF'
// This is an action creator, it simply specifies the action.
// this is what we call to send an action.
export function isGoBackEditOff() {
    return {
      type: IS_GO_BACK_EDIT_OFF
    }
  }