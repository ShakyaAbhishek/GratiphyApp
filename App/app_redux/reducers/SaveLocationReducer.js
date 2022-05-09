

const initialState={
    locationData:''
}

const SaveLocationReducer =(state=initialState, action)=>{
  console.warn("hhhhhhhhiiit reduser", action.data)
switch(action.type){
    case "GET_LOCATION": {
        return {
          ...state,
          locationData: action.data
        };
      }
      default:
        return state;
    }
}
export default SaveLocationReducer