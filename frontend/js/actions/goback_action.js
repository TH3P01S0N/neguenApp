// We speciify the name of the action as a variable
export const IS_GO_BACK = 'IS_GO_BACK'
// This is an action creator, it simply specifies the action.
// this is what we call to send an action.
export function isGoBack() {
    return {
      type: IS_GO_BACK
    }
  }