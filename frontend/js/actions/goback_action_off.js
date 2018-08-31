// We speciify the name of the action as a variable
export const IS_GO_BACK_OFF = 'IS_GO_BACK_OFF'
// This is an action creator, it simply specifies the action.
// this is what we call to send an action.
export function isGoBackOff() {
    return {
      type: IS_GO_BACK_OFF
    }
  }