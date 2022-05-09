const initialState={
    profileData:''
}

const SaveProfileReducer =(state=initialState, action)=>{
switch(action.type){
    case "GET_PROFILE": {
        return {
          ...state,
          profileData: JSON.parse(action.data)
        };
      }
      default:
        return state;
    }
}
export default SaveProfileReducer