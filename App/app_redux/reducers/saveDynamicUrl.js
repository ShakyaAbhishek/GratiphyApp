const initialState={
    urlData:''
}

const SaveDynamicUrl =(state=initialState, action)=>{
switch(action.type){
    case "DYNAMIC_URL": {
        return {
          ...state,
          urlData: JSON.parse(action.data)
        };
      }
      default:
        return state;
    }
}
export default SaveDynamicUrl