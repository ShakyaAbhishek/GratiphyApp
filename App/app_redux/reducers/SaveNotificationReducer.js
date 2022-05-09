

const initialState={
    notificationData:''
}

const SaveNotificationReducer =(state=initialState, action)=>{
    console.warn("notification daftaa", action.data)
switch(action.type){
    case "notification": {
        return {
          ...state,
          notificationData: action.data
        };
      }
      default:
        return state;
    }
}
export default SaveNotificationReducer